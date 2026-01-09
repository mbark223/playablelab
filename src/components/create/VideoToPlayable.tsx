import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles, Play, Pause, SkipForward, Layers, MousePointer, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { VideoAnalysis, PlayableStoryboard, VideoProcessor } from '@/lib/videoProcessor';
import { MarketingAsset } from '@/lib/AssetContext';

interface VideoToPlayableProps {
  videoAsset: MarketingAsset;
  onBack: () => void;
  onNext: (storyboard: PlayableStoryboard) => void;
}

export default function VideoToPlayable({ videoAsset, onBack, onNext }: VideoToPlayableProps) {
  const [storyboard, setStoryboard] = useState<PlayableStoryboard | null>(null);
  const [selectedScene, setSelectedScene] = useState(0);
  const [previewTime, setPreviewTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoAsset.videoAnalysis) {
      const processor = new VideoProcessor();
      const generatedStoryboard = processor.generatePlayableStoryboard(videoAsset.videoAnalysis);
      setStoryboard(generatedStoryboard);
    }
  }, [videoAsset]);

  const handleGeneratePlayable = () => {
    if (storyboard) {
      onNext(storyboard);
    }
  };

  if (!videoAsset.videoAnalysis || !storyboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-lg font-medium">Processing video...</p>
        </div>
      </div>
    );
  }

  const analysis = videoAsset.videoAnalysis;
  const currentScene = storyboard.scenes[selectedScene];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Video to Playable Converter</h2>
        <p className="text-muted-foreground">Transform your video into an interactive playable ad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview and Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
                <img 
                  src={currentScene.thumbnail} 
                  alt={`Scene ${selectedScene + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span>{formatTime(previewTime)}</span>
                    <span>{formatTime(analysis.duration)}</span>
                  </div>
                  <Slider
                    value={[previewTime]}
                    onValueChange={([value]) => setPreviewTime(value)}
                    max={analysis.duration}
                    step={0.1}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Scene Timeline */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Scene Timeline</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {storyboard.scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => setSelectedScene(index)}
                      className={cn(
                        "relative flex-shrink-0 w-32 rounded-lg overflow-hidden border-2 transition-all",
                        selectedScene === index ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img 
                        src={scene.thumbnail} 
                        alt={`Scene ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 left-1 right-1 text-white text-xs">
                        <p className="font-medium">Scene {index + 1}</p>
                        <p className="opacity-80">{scene.duration.toFixed(1)}s</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scene Details and Interactions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Scene Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Scene {selectedScene + 1}</h4>
                  <Badge variant="secondary" className="capitalize">
                    {currentScene.type}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Duration</h4>
                  <p className="text-2xl font-bold">{currentScene.duration.toFixed(1)}s</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Suggested Interactions</h4>
                  <div className="space-y-2">
                    {currentScene.interactions.map((interaction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                      >
                        {interaction.type === 'tap' && <MousePointer className="h-4 w-4" />}
                        {interaction.type === 'swipe' && <Hand className="h-4 w-4" />}
                        {interaction.type === 'button' && <Play className="h-4 w-4" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{interaction.type}</p>
                          <p className="text-xs text-muted-foreground">{interaction.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{formatTime(analysis.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium">{analysis.width} × {analysis.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FPS</span>
                <span className="font-medium">{analysis.fps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scenes</span>
                <span className="font-medium">{storyboard.scenes.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button 
          size="lg" 
          onClick={handleGeneratePlayable}
          className="min-w-[200px]"
        >
          Generate Playable
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}