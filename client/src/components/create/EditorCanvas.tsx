import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Monitor, Smartphone, Tablet, Download, Share2, Layers, Type, Palette, Coins, Dices, Crown, Check, Trophy, LayoutTemplate, Eye, EyeOff, Sparkles, Disc, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportModal from './ExportModal';
import { useAssets } from '@/lib/AssetContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';
import slotsBg from '@assets/generated_images/slot_machine_mobile_ui_background.png';
import symbol7 from '@assets/generated_images/slot_machine_symbol_7.png';
import symbolDiamond from '@assets/generated_images/slot_machine_symbol_diamond.png';
import symbolBell from '@assets/generated_images/slot_machine_symbol_bell.png';
import symbolCherry from '@assets/generated_images/slot_machine_symbol_cherry.png';
import chipRed from '@assets/generated_images/poker_chip_red.png';
import chipBlue from '@assets/generated_images/poker_chip_blue.png';
import casinoLogo from '@assets/generated_images/casino_logo_placeholder.png';
import wheelImg from '@assets/generated_images/wheel_of_fortune.png';
import scratchImg from '@assets/generated_images/scratch_card_game.png';

interface EditorCanvasProps {
  templateId?: string | null;
}

export default function EditorCanvas({ templateId }: EditorCanvasProps) {
  const { assets, getAssetsByType } = useAssets();
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');
  const [viewMode, setViewMode] = useState<'game' | 'endcard'>('game');
  
  // Determine Editor Mode based on templateId
  const editorMode = templateId?.includes('wheel') ? 'wheel' : 
                     templateId?.includes('scratch') ? 'scratch' : 'slots';

  // Customization State
  const [headline, setHeadline] = useState("MEGA JACKPOT");
  const [ctaText, setCtaText] = useState(editorMode === 'wheel' ? "SPIN WHEEL" : editorMode === 'scratch' ? "SCRATCH NOW" : "SPIN NOW");
  const [logo, setLogo] = useState(casinoLogo);
  const [customSymbols, setCustomSymbols] = useState<string[]>([]);
  const [background, setBackground] = useState(slotsBg);
  
  // Game Settings
  const [spins, setSpins] = useState(5);
  const [currentSpins, setCurrentSpins] = useState(5);
  const [isReelSpinning, setIsReelSpinning] = useState(false);
  
  // Advanced Settings
  const [slotRows, setSlotRows] = useState(1); // 1 = 3x1 (classic), 3 = 3x3 (video slot)
  const [textColor, setTextColor] = useState('#ffffff');
  const [subheadline, setSubheadline] = useState('');

  // End Card Settings
  const [endCardHeadline, setEndCardHeadline] = useState("YOU WON!");
  const [endCardSubtext, setEndCardSubtext] = useState("$500 BONUS + 50 SPINS");
  const [endCardCta, setEndCardCta] = useState("CLAIM PRIZE");
  const [showEndCard, setShowEndCard] = useState(false);

  // Element Visibility (Switch Elements)
  const [visibleElements, setVisibleElements] = useState({
    logo: true,
    jackpot: true,
    paylines: true,
    headline: true
  });

  // Auto-populate from uploaded assets
  useEffect(() => {
    const logos = getAssetsByType('logo');
    if (logos.length > 0) setLogo(logos[0].previewUrl);

    const bgs = getAssetsByType('background');
    if (bgs.length > 0) setBackground(bgs[0].previewUrl);

    const symbols = getAssetsByType('symbol');
    if (symbols.length > 0) {
      setCustomSymbols(symbols.map(s => s.previewUrl));
    }
  }, [assets]);

  // Reset current spins when entering preview mode
  useEffect(() => {
    if (isPlaying) {
      setCurrentSpins(spins);
      setShowEndCard(false);
      setViewMode('game');
    } else {
      setIsReelSpinning(false);
      setShowEndCard(false);
    }
  }, [isPlaying, spins]);

  // Handle Game Interaction
  const handleInteraction = () => {
    if (!isPlaying || currentSpins <= 0 || isReelSpinning) return;

    setIsReelSpinning(true);
    setCurrentSpins(prev => prev - 1);

    // Simulate duration
    setTimeout(() => {
      setIsReelSpinning(false);
      
      // Check if that was the last play
      if (currentSpins - 1 === 0) {
        setTimeout(() => {
          setShowEndCard(true);
        }, 500);
      }
    }, 2000);
  };

  const toggleElement = (key: keyof typeof visibleElements) => {
    setVisibleElements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      <ExportModal open={showExport} onOpenChange={setShowExport} />
      
      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Configuration</h3>
          <p className="text-xs text-muted-foreground capitalize">Mode: {editorMode}</p>
        </div>
        
        <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-5 h-auto py-1">
              <TabsTrigger value="assets" className="px-1"><Layers className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="game" className="px-1">
                {editorMode === 'wheel' ? <Disc className="h-4 w-4" /> : 
                 editorMode === 'scratch' ? <Sparkles className="h-4 w-4" /> : 
                 <Dices className="h-4 w-4" />}
              </TabsTrigger>
              <TabsTrigger value="text" className="px-1"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="elements" className="px-1"><LayoutTemplate className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="endcard" className="px-1"><Trophy className="h-4 w-4" /></TabsTrigger>
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
                {getAssetsByType('logo').length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {getAssetsByType('logo').map(asset => (
                      <div key={asset.id} onClick={() => setLogo(asset.previewUrl)} className="h-10 w-10 border rounded bg-white p-1 cursor-pointer hover:border-primary shrink-0">
                        <img src={asset.previewUrl} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Background Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => setBackground(slotsBg)}
                    className={cn("aspect-[9/16] rounded-md border-2 overflow-hidden relative cursor-pointer", background === slotsBg ? "border-primary" : "border-transparent")}
                  >
                    <img src={slotsBg} className="w-full h-full object-cover" />
                  </div>
                  {getAssetsByType('background').map(asset => (
                    <div 
                      key={asset.id}
                      onClick={() => setBackground(asset.previewUrl)}
                      className={cn("aspect-[9/16] rounded-md border-2 overflow-hidden relative cursor-pointer", background === asset.previewUrl ? "border-primary" : "border-transparent")}
                    >
                      <img src={asset.previewUrl} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="game" className="mt-0 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Dices className="h-4 w-4 text-primary" />
                  Game Settings
                </label>
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                   <div className="flex justify-between items-center">
                     <label className="text-xs font-medium text-muted-foreground">
                       {editorMode === 'wheel' ? 'Spins Allowed' : editorMode === 'scratch' ? 'Cards per User' : 'Free Spins Count'}
                     </label>
                     <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{spins}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Button 
                       variant="outline" size="icon" className="h-8 w-8"
                       onClick={() => setSpins(Math.max(1, spins - 1))}
                     >
                       -
                     </Button>
                     <div className="flex-1">
                       <input 
                         type="range" 
                         min="1" max="50" 
                         value={spins} 
                         onChange={(e) => setSpins(parseInt(e.target.value))}
                         className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                       />
                     </div>
                     <Button 
                       variant="outline" size="icon" className="h-8 w-8"
                       onClick={() => setSpins(Math.min(50, spins + 1))}
                     >
                       +
                     </Button>
                   </div>
                </div>

                {editorMode === 'slots' && (
                  <>
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border mt-4">
                       <div className="flex justify-between items-center">
                         <label className="text-xs font-medium text-muted-foreground">Grid Layout</label>
                         <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">3 x {slotRows}</span>
                       </div>
                       <div className="flex gap-2">
                         <Button 
                           variant={slotRows === 1 ? "default" : "outline"} 
                           size="sm" 
                           className="flex-1 text-xs"
                           onClick={() => setSlotRows(1)}
                         >
                           3x1 Classic
                         </Button>
                         <Button 
                           variant={slotRows === 3 ? "default" : "outline"} 
                           size="sm" 
                           className="flex-1 text-xs"
                           onClick={() => setSlotRows(3)}
                         >
                           3x3 Video
                         </Button>
                       </div>
                    </div>

                    <label className="text-sm font-medium flex items-center gap-2 mt-6">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      High Value Symbols
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(customSymbols.length > 0 ? customSymbols : [symbol7, symbolDiamond, symbolBell]).slice(0, 3).map((sym, i) => (
                        <div key={i} className="aspect-square rounded-md border border-border bg-background p-2 flex items-center justify-center cursor-pointer hover:border-primary">
                          <img src={sym} className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {editorMode === 'wheel' && (
                  <div className="mt-4 p-4 border border-dashed rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Wheel segments are automatically generated from your Prize List.</p>
                  </div>
                )}
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
                <label className="text-sm font-medium">Subheadline (Optional)</label>
                <input 
                  type="text" 
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="e.g. JOIN THE FUN"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
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

              <div className="space-y-3">
                 <label className="text-sm font-medium flex items-center gap-2">
                   <Palette className="h-4 w-4" /> Text Color
                 </label>
                 <div className="flex gap-2">
                   {['#ffffff', '#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#000000'].map(color => (
                     <div 
                       key={color}
                       onClick={() => setTextColor(color)}
                       className={cn(
                         "h-8 w-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110",
                         textColor === color ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                       )}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-4">Element Visibility</h4>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                     <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                     <Label htmlFor="show-logo" className="text-sm font-medium">Game Logo</Label>
                  </div>
                  <Switch 
                    id="show-logo" 
                    checked={visibleElements.logo} 
                    onCheckedChange={() => toggleElement('logo')} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                     <Coins className="h-4 w-4 text-muted-foreground" />
                     <Label htmlFor="show-jackpot" className="text-sm font-medium">Jackpot Counter</Label>
                  </div>
                  <Switch 
                    id="show-jackpot" 
                    checked={visibleElements.jackpot} 
                    onCheckedChange={() => toggleElement('jackpot')} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                     <Type className="h-4 w-4 text-muted-foreground" />
                     <Label htmlFor="show-headline" className="text-sm font-medium">Main Headline</Label>
                  </div>
                  <Switch 
                    id="show-headline" 
                    checked={visibleElements.headline} 
                    onCheckedChange={() => toggleElement('headline')} 
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="endcard" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                  <p className="text-xs text-primary font-medium flex items-center gap-2">
                    <Trophy className="h-3 w-3" />
                    This card appears after the game ends.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">End Headline</label>
                  <input 
                    type="text" 
                    value={endCardHeadline}
                    onChange={(e) => setEndCardHeadline(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-display font-bold tracking-wide"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Subtext / Reward</label>
                  <input 
                    type="text" 
                    value={endCardSubtext}
                    onChange={(e) => setEndCardSubtext(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Final CTA</label>
                  <input 
                    type="text" 
                    value={endCardCta}
                    onChange={(e) => setEndCardCta(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-bold uppercase"
                  />
                </div>
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
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
              <button 
                onClick={() => { setViewMode('game'); setActiveTab('game'); }}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                  viewMode === 'game' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Dices className="h-3 w-3" /> Game
              </button>
              <button 
                onClick={() => { setViewMode('endcard'); setActiveTab('endcard'); }}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                  viewMode === 'endcard' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Trophy className="h-3 w-3" /> End Card
              </button>
            </div>
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
            <div className="absolute inset-0 bg-black">
              {/* Background */}
              <img 
                src={background} 
                className="absolute inset-0 w-full h-full object-cover opacity-90" 
                alt="Game Background" 
              />
              
              {/* UI Layer */}
              <div className="absolute inset-0 flex flex-col z-10">
                {/* Header / Logo */}
                {visibleElements.logo && (
                  <div className="h-24 flex items-center justify-center pt-8 animate-in slide-in-from-top duration-700">
                    <img src={logo} className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                  </div>
                )}

                {/* GAME CONTENT AREA */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
                  {/* Jackpot Counter */}
                  {visibleElements.jackpot && (
                    <div className="bg-black/60 backdrop-blur-sm border border-yellow-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.3)]">
                      <span className="text-yellow-400 font-display font-black text-2xl tracking-widest drop-shadow-md">
                        $1,240,500
                      </span>
                    </div>
                  )}

                  {/* === MODE: SLOTS === */}
                  {editorMode === 'slots' && (
                    <div className={cn(
                      "w-[90%] bg-gradient-to-b from-purple-900 to-black rounded-lg border-4 border-yellow-600/50 relative shadow-2xl overflow-hidden p-1 transition-all duration-300",
                      slotRows === 3 ? "aspect-[3/4]" : "aspect-[4/3]"
                    )}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                      
                      {/* Reels Container */}
                      <div className={cn(
                        "w-full h-full bg-white/5 rounded grid gap-1 p-1",
                        "grid-cols-3" // Always 3 columns
                      )}>
                        {Array.from({ length: 3 * slotRows }).map((_, i) => {
                          const colIndex = i % 3;
                          const symbols = (customSymbols.length > 0 ? customSymbols : [symbol7, symbolDiamond, symbolBell]);
                          const sym = symbols[colIndex % symbols.length];
                          
                          return (
                          <div key={i} className="bg-gradient-to-b from-white to-gray-200 rounded overflow-hidden relative shadow-inner">
                            <div 
                              className={cn(
                                "absolute inset-0 flex flex-col items-center justify-center transition-all duration-100", 
                                isReelSpinning ? "blur-md translate-y-[100%] animate-spin-blur" : "translate-y-0"
                              )}
                              style={{ 
                                animation: isReelSpinning ? `spin 0.2s linear infinite` : 'none',
                                animationDelay: `${i * 0.1}s` 
                              }}
                            >
                               <img src={sym} className="w-[80%] h-auto drop-shadow-md" />
                            </div>
                            {!isReelSpinning && (
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <img src={sym} className="w-[80%] h-auto drop-shadow-md" />
                               </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50" />
                          </div>
                          );
                        })}
                      </div>
                      
                      {/* Payline */}
                      {visibleElements.paylines && (
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/50 shadow-[0_0_10px_red]" />
                      )}
                    </div>
                  )}

                  {/* === MODE: WHEEL === */}
                  {editorMode === 'wheel' && (
                    <div className="w-[90%] aspect-square relative flex items-center justify-center">
                      <div className={cn(
                        "w-full h-full rounded-full border-8 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.5)] overflow-hidden bg-black/50 relative transition-transform duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1)",
                        isReelSpinning ? "rotate-[1080deg]" : "rotate-0"
                      )}>
                         <img src={wheelImg} className="w-full h-full object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl z-20 flex items-center justify-center border-4 border-white">
                             <div className="w-2 h-2 rounded-full bg-black/20" />
                           </div>
                         </div>
                      </div>
                      {/* Pointer */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-red-600 z-30 shadow-lg" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                    </div>
                  )}

                  {/* === MODE: SCRATCH === */}
                  {editorMode === 'scratch' && (
                    <div className="w-[90%] aspect-[3/4] bg-white rounded-xl shadow-2xl p-1 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10" />
                      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-4 grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} className="relative rounded-lg overflow-hidden bg-gray-100 shadow-inner flex items-center justify-center">
                             <span className="font-bold text-gray-400">PRIZE</span>
                             
                             {/* Scratch Layer */}
                             <div className={cn(
                               "absolute inset-0 bg-gray-300 flex items-center justify-center cursor-crosshair transition-opacity duration-700",
                               isReelSpinning ? "opacity-0" : "opacity-100 bg-[url('https://www.transparenttextures.com/patterns/foil.png')]"
                             )}>
                               <Hexagon className="text-gray-400 opacity-20 w-8 h-8" />
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Headline */}
                  {visibleElements.headline && (
                    <div className="text-center space-y-2 z-20">
                      <h2 
                        className="text-3xl font-display font-black text-white text-center uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4"
                        style={{ color: textColor }}
                      >
                        {headline}
                      </h2>
                      {subheadline && (
                        <p className="text-sm font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm inline-block tracking-wider animate-pulse border border-white/10">
                          {subheadline}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pb-12 pt-4 px-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      "backdrop-blur border px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors",
                      currentSpins > 0 ? "bg-black/80 border-white/20 text-white" : "bg-red-500/90 border-red-400 text-white"
                    )}>
                      {currentSpins > 0 && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                      {currentSpins} {editorMode === 'scratch' ? 'Cards' : 'Spins'} Left
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={handleInteraction}
                    disabled={!isPlaying || currentSpins <= 0 || isReelSpinning}
                    className={cn(
                      "w-full max-w-[280px] h-14 text-xl font-black rounded-full border-b-4 shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all",
                      !isPlaying 
                        ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                        : currentSpins > 0
                          ? "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 border-yellow-700 hover:scale-105 active:scale-95 active:border-b-0 translate-y-0 text-yellow-950 animate-pulse"
                          : "bg-gray-700 border-gray-800 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {currentSpins > 0 ? ctaText : "No Plays Left"}
                  </Button>
                  <p className="text-[10px] text-white/40 font-medium text-center max-w-[200px] leading-tight">
                    No Purchase Necessary. 18+. T&Cs Apply.
                  </p>
                </div>
              </div>

              {/* End Card Overlay */}
              {(viewMode === 'endcard' || showEndCard) && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-full max-w-sm text-center space-y-6">
                    {/* Winner Icon */}
                    <div className="mx-auto h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.4)] animate-bounce">
                      <Trophy className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-white uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                        {endCardHeadline}
                      </h2>
                      <p className="text-xl text-yellow-300 font-bold tracking-wide">
                        {endCardSubtext}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button 
                        size="lg" 
                        className="w-full h-16 text-2xl font-black rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 border-b-4 border-emerald-800 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform animate-pulse"
                      >
                        {endCardCta}
                      </Button>
                      <p className="text-xs text-white/50 mt-4">
                        Offer expires in 10:00 minutes
                      </p>
                    </div>
                  </div>
                  
                  {/* Confetti (Simulated with simple particles for mockup) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute h-2 w-2 bg-yellow-500 rounded-full animate-pulse"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: Math.random()
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}