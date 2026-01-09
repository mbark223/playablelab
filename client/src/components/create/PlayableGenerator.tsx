import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Code, Eye, Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayableStoryboard, PlayableScene } from '@/lib/videoProcessor';
import { cn } from '@/lib/utils';

interface PlayableGeneratorProps {
  storyboard: PlayableStoryboard;
  onBack: () => void;
}

export default function PlayableGenerator({ storyboard, onBack }: PlayableGeneratorProps) {
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [autoplay, setAutoplay] = useState(true);
  const [showCTA, setShowCTA] = useState(true);
  const [ctaText, setCtaText] = useState('Play Now');
  const [isGenerating, setIsGenerating] = useState(true);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Generate the playable HTML/CSS/JS code
    generatePlayableCode();
  }, [storyboard]);

  const generatePlayableCode = () => {
    setIsGenerating(true);
    
    // Simulate generation time
    setTimeout(() => {
      const code = generateHTML5Playable(storyboard, { autoplay, showCTA, ctaText });
      setGeneratedCode(code);
      setIsGenerating(false);
      
      // Update preview
      if (previewRef.current) {
        const doc = previewRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(code);
          doc.close();
        }
      }
    }, 2000);
  };

  const handleExport = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playable-ad.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateSettings = () => {
    generatePlayableCode();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Playable Generated!</h2>
        <p className="text-muted-foreground">Your video has been converted into an interactive playable ad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                <Select value={previewMode} onValueChange={(value: 'mobile' | 'desktop') => setPreviewMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-2xl transition-all duration-300",
                previewMode === 'mobile' ? "w-[375px] h-[667px]" : "w-full h-[600px]"
              )}>
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                      <p className="text-lg font-medium">Generating playable...</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={previewRef}
                    className="w-full h-full border-0"
                    title="Playable Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Playable Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay</Label>
                <Switch
                  id="autoplay"
                  checked={autoplay}
                  onCheckedChange={setAutoplay}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-cta">Show CTA Button</Label>
                <Switch
                  id="show-cta"
                  checked={showCTA}
                  onCheckedChange={setShowCTA}
                />
              </div>

              <div className="space-y-2">
                <Label>CTA Text</Label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!showCTA}
                />
              </div>

              <Button 
                onClick={updateSettings} 
                className="w-full"
                disabled={isGenerating}
              >
                Update Preview
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleExport} 
                className="w-full"
                disabled={isGenerating}
              >
                <Download className="mr-2 h-4 w-4" />
                Download HTML5
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isGenerating}
              >
                <Code className="mr-2 h-4 w-4" />
                View Source Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storyboard Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Scenes</span>
                <span className="font-medium">{storyboard.scenes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{storyboard.totalDuration.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium">{storyboard.dimensions.width}×{storyboard.dimensions.height}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Video
        </Button>
        <Button 
          size="lg" 
          onClick={handleExport}
          className="min-w-[200px]"
          disabled={isGenerating}
        >
          Export Playable
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function generateHTML5Playable(
  storyboard: PlayableStoryboard, 
  options: { autoplay: boolean; showCTA: boolean; ctaText: string }
): string {
  const scenes = storyboard.scenes.map((scene, index) => ({
    ...scene,
    startTime: storyboard.scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0)
  }));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Playable Ad</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
        }
        
        #playable-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            background: #000;
        }
        
        .scene {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .scene.active {
            opacity: 1;
        }
        
        .scene img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .interaction-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
        }
        
        .tap-zone {
            position: absolute;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
        
        .swipe-indicator {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 14px;
            text-align: center;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        .cta-button {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 16px 32px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            z-index: 20;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
            display: ${options.showCTA ? 'block' : 'none'};
        }
        
        .cta-button:hover {
            background: #45a049;
            transform: translateX(-50%) scale(1.05);
        }
        
        .progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 4px;
            background: #4CAF50;
            z-index: 30;
            transition: width 0.1s linear;
        }
    </style>
</head>
<body>
    <div id="playable-container">
        <div class="progress-bar" id="progress"></div>
        
        ${scenes.map((scene, index) => `
        <div class="scene${index === 0 ? ' active' : ''}" id="scene-${index}" data-type="${scene.type}">
            <img src="${scene.thumbnail}" alt="Scene ${index + 1}">
            <div class="interaction-overlay">
                ${scene.type === 'action' ? '<div class="tap-zone" data-action="tap"></div>' : ''}
                ${scene.type === 'transition' ? '<div class="swipe-indicator">Swipe to continue →</div>' : ''}
            </div>
        </div>
        `).join('')}
        
        <button class="cta-button" onclick="handleCTA()">${options.ctaText}</button>
    </div>
    
    <script>
        let currentScene = 0;
        const totalScenes = ${scenes.length};
        const sceneDurations = ${JSON.stringify(scenes.map(s => s.duration))};
        const sceneStartTimes = ${JSON.stringify(scenes.map(s => s.startTime))};
        let startTime = Date.now();
        let sceneStartTime = Date.now();
        
        function showScene(index) {
            document.querySelectorAll('.scene').forEach(scene => {
                scene.classList.remove('active');
            });
            
            const scene = document.getElementById(\`scene-\${index}\`);
            if (scene) {
                scene.classList.add('active');
                currentScene = index;
                sceneStartTime = Date.now();
                
                // Set up interaction handlers
                setupInteractions(scene);
                
                // Auto-advance for static scenes
                if (scene.dataset.type === 'static' && ${options.autoplay}) {
                    setTimeout(() => {
                        if (currentScene === index && currentScene < totalScenes - 1) {
                            showScene(currentScene + 1);
                        }
                    }, sceneDurations[index] * 1000);
                }
            }
        }
        
        function setupInteractions(scene) {
            const tapZone = scene.querySelector('.tap-zone');
            if (tapZone) {
                tapZone.onclick = () => nextScene();
            }
            
            // Swipe detection
            if (scene.dataset.type === 'transition') {
                let touchStartX = 0;
                
                scene.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                });
                
                scene.addEventListener('touchend', (e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    if (touchStartX - touchEndX > 50) {
                        nextScene();
                    }
                });
                
                // Mouse swipe for desktop
                let mouseDown = false;
                let mouseStartX = 0;
                
                scene.addEventListener('mousedown', (e) => {
                    mouseDown = true;
                    mouseStartX = e.clientX;
                });
                
                scene.addEventListener('mouseup', (e) => {
                    if (mouseDown && mouseStartX - e.clientX > 50) {
                        nextScene();
                    }
                    mouseDown = false;
                });
            }
        }
        
        function nextScene() {
            if (currentScene < totalScenes - 1) {
                showScene(currentScene + 1);
            }
        }
        
        function updateProgress() {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min((elapsed / ${storyboard.totalDuration}) * 100, 100);
            document.getElementById('progress').style.width = progress + '%';
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            }
        }
        
        function handleCTA() {
            // This would normally open the app store or game URL
            window.open('https://example.com/download', '_blank');
        }
        
        // Initialize
        showScene(0);
        updateProgress();
    </script>
</body>
</html>`;
}