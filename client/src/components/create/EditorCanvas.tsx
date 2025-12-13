import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Monitor, Smartphone, Tablet, Download, Share2, Layers, Type, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';

export default function EditorCanvas() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Configuration</h3>
        </div>
        
        <Tabs defaultValue="assets" className="flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="assets"><Layers className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="text"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="style"><Palette className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <TabsContent value="assets" className="mt-0 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Hero Image</label>
                <div className="aspect-video rounded-lg border border-dashed border-border flex items-center justify-center bg-background/50 hover:bg-background transition-colors cursor-pointer">
                  <span className="text-xs text-muted-foreground">Click to replace</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Player Character</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-md border border-border bg-background/50" />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="mt-0 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Headline</label>
                <input 
                  type="text" 
                  defaultValue="Play Now!"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">CTA Button</label>
                <input 
                  type="text" 
                  defaultValue="Install Now"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t border-border bg-card">
          <Button className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" /> Export Project
          </Button>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col bg-muted/30 relative">
        {/* Toolbar */}
        <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(device === 'mobile' && "bg-muted text-primary")}
              onClick={() => setDevice('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(device === 'tablet' && "bg-muted text-primary")}
              onClick={() => setDevice('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(device === 'desktop' && "bg-muted text-primary")}
              onClick={() => setDevice('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Reset' : 'Preview'}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div 
            className={cn(
              "relative bg-black shadow-2xl transition-all duration-500 ease-in-out border-[8px] border-zinc-800 overflow-hidden",
              device === 'mobile' && "w-[375px] h-[667px] rounded-[3rem]",
              device === 'tablet' && "w-[768px] h-[1024px] rounded-[2rem]",
              device === 'desktop' && "w-full h-full rounded-none border-0"
            )}
          >
            {/* Mockup Content */}
            <div className="absolute inset-0 bg-zinc-900">
              <img 
                src={runnerImg} 
                className="w-full h-full object-cover opacity-80" 
                alt="Game Preview" 
              />
              
              {/* Overlay UI */}
              <div className="absolute top-10 left-0 right-0 flex justify-center">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className="text-white font-bold text-xl font-display">1240 PTS</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 right-0 px-8 flex flex-col items-center gap-4">
                <h2 className="text-4xl font-display font-black text-white italic drop-shadow-lg text-center">
                  RUN FAST!
                </h2>
                <Button size="lg" className="w-full max-w-xs text-lg font-bold shadow-xl animate-bounce">
                  INSTALL NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
