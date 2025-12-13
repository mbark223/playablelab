import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Monitor, Smartphone, Tablet, Download, Share2, Layers, Type, Palette, Coins, Dices, Crown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportModal from './ExportModal';

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';
import slotsBg from '@assets/generated_images/slot_machine_mobile_ui_background.png';
import symbol7 from '@assets/generated_images/slot_machine_symbol_7.png';
import symbolCherry from '@assets/generated_images/slot_machine_symbol_cherry.png';
import symbolBell from '@assets/generated_images/slot_machine_symbol_bell.png';
import symbolDiamond from '@assets/generated_images/slot_machine_symbol_diamond.png';
import chipRed from '@assets/generated_images/poker_chip_red.png';
import chipBlue from '@assets/generated_images/poker_chip_blue.png';
import casinoLogo from '@assets/generated_images/casino_logo_placeholder.png';

export default function EditorCanvas() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');
  
  // Customization State
  const [headline, setHeadline] = useState("MEGA JACKPOT");
  const [ctaText, setCtaText] = useState("SPIN NOW");
  const [logo, setLogo] = useState(casinoLogo);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      <ExportModal open={showExport} onOpenChange={setShowExport} />
      
      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Configuration</h3>
        </div>
        
        <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="assets"><Layers className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="casino"><Dices className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="text"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="style"><Palette className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <TabsContent value="assets" className="mt-0 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Brand Logo</label>
                <div className="aspect-video rounded-lg border border-dashed border-border flex flex-col items-center justify-center bg-background/50 hover:bg-background transition-colors cursor-pointer group relative overflow-hidden">
                  <img src={logo} className="h-16 w-auto object-contain z-10" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="text-xs text-white font-medium">Click to replace</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Background Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-[9/16] rounded-md border-2 border-primary overflow-hidden relative cursor-pointer">
                    <img src={slotsBg} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="aspect-[9/16] rounded-md border border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50">
                    <span className="text-xs text-muted-foreground">+ Upload</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="casino" className="mt-0 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  High Value Symbols
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[symbol7, symbolDiamond, symbolBell].map((sym, i) => (
                    <div key={i} className="aspect-square rounded-md border border-border bg-background p-2 flex items-center justify-center cursor-pointer hover:border-primary">
                      <img src={sym} className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                  ))}
                </div>

                <label className="text-sm font-medium flex items-center gap-2 mt-4">
                  <Coins className="h-4 w-4 text-blue-500" />
                  Low Value Symbols
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[symbolCherry, chipRed, chipBlue].map((sym, i) => (
                    <div key={i} className="aspect-square rounded-md border border-border bg-background p-2 flex items-center justify-center cursor-pointer hover:border-primary">
                      <img src={sym} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Main Headline</label>
                <input 
                  type="text" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-display font-bold tracking-wide"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">CTA Button Text</label>
                <input 
                  type="text" 
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-bold uppercase"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t border-border bg-card">
          <Button className="w-full" size="lg" onClick={() => setShowExport(true)}>
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
            {/* Mockup Content - SLOT MACHINE */}
            <div className="absolute inset-0 bg-black">
              {/* Background */}
              <img 
                src={slotsBg} 
                className="absolute inset-0 w-full h-full object-cover opacity-90" 
                alt="Casino Background" 
              />
              
              {/* UI Layer */}
              <div className="absolute inset-0 flex flex-col z-10">
                {/* Header / Logo */}
                <div className="h-24 flex items-center justify-center pt-8 animate-in slide-in-from-top duration-700">
                  <img src={logo} className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                </div>

                {/* Slot Reels Area */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  {/* Jackpot Counter */}
                  <div className="bg-black/60 backdrop-blur-sm border border-yellow-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.3)]">
                    <span className="text-yellow-400 font-display font-black text-2xl tracking-widest drop-shadow-md">
                      $1,240,500
                    </span>
                  </div>

                  {/* The Machine */}
                  <div className="w-[90%] aspect-[4/3] bg-gradient-to-b from-purple-900 to-black rounded-lg border-4 border-yellow-600/50 relative shadow-2xl overflow-hidden p-1">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    
                    {/* Reels Container */}
                    <div className="w-full h-full bg-white/5 rounded grid grid-cols-3 gap-1 p-1">
                      {[symbol7, symbolDiamond, symbolBell].map((sym, i) => (
                        <div key={i} className="bg-gradient-to-b from-white to-gray-200 rounded overflow-hidden relative shadow-inner">
                          <div className={cn("absolute inset-0 flex flex-col items-center justify-center", isPlaying ? "animate-pulse blur-sm" : "")}>
                             <img src={sym} className="w-[80%] h-auto drop-shadow-md" />
                          </div>
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Payline */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/50 shadow-[0_0_10px_red]" />
                  </div>
                  
                  {/* Headline */}
                  <h2 className="text-3xl font-display font-black text-white text-center uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4">
                    {headline}
                  </h2>
                </div>

                {/* Footer Controls */}
                <div className="pb-12 pt-4 px-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/90 to-transparent">
                  <Button 
                    size="lg" 
                    className="w-full max-w-[280px] h-14 text-xl font-black rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 border-b-4 border-yellow-700 shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform active:scale-95 active:border-b-0 translate-y-0 text-yellow-950 animate-pulse"
                  >
                    {ctaText}
                  </Button>
                  <p className="text-[10px] text-white/40 font-medium text-center max-w-[200px] leading-tight">
                    No Purchase Necessary. 18+. T&Cs Apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
