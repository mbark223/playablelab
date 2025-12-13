import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Monitor, Smartphone, Tablet, Download, Share2, Layers, Type, Palette, Coins, Dices, Crown, Check, Trophy, LayoutTemplate, Eye, EyeOff, Sparkles, Disc, Hexagon, Plus, Image as ImageIcon, X, PartyPopper, Zap, CloudRain, Heart, Star, Sun, Snowflake, Flame, Droplets, Ribbon, Wand2, Waves, Lightbulb, Music, ZapOff, Aperture, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportModal from './ExportModal';
import { useAssets } from '@/lib/AssetContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { assets, getAssetsByType, addAsset } = useAssets();
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');
  const [viewMode, setViewMode] = useState<'game' | 'endcard'>('game');
  
  // Determine Editor Mode based on templateId
  const editorMode = templateId?.includes('wheel') ? 'wheel' : 
                     templateId?.includes('scratch') ? 'scratch' : 'slots';

  // Helper for template configuration
  const getTemplateConfig = (id: string | null) => {
    if (!id) return {};
    if (id.includes('egyptian')) return { rows: 3, cols: 5, color: '#fbbf24', headline: 'PHARAOH\'S GOLD', animation: 'expanding' }; // Gold
    if (id.includes('greek')) return { rows: 4, cols: 5, color: '#3b82f6', headline: 'ZEUS THUNDER', animation: 'shake' }; // Blue
    if (id.includes('fruit')) return { rows: 3, cols: 3, color: '#ef4444', headline: 'FRUIT PARTY', animation: 'bounce' }; // Red
    if (id.includes('neon')) return { rows: 4, cols: 4, color: '#10b981', headline: 'NEON NIGHTS', animation: 'spin' }; // Green/Neon
    if (id.includes('ocean')) return { rows: 3, cols: 5, color: '#3b82f6', headline: 'DEEP BLUE', animation: 'fade' }; // Blue
    if (id.includes('wild-west')) return { rows: 3, cols: 5, color: '#fbbf24', headline: 'WESTERN WINS', animation: 'sticky' }; // Orange/Gold
    if (id.includes('space')) return { rows: 4, cols: 4, color: '#8b5cf6', headline: 'GALACTIC SPINS', animation: 'cascade' }; // Purple
    return { rows: 1, cols: 3, color: '#ffffff', headline: 'MEGA JACKPOT', animation: 'spin' };
  };

  const templateConfig = getTemplateConfig(templateId || null);

  // Customization State
  const [headline, setHeadline] = useState(templateConfig.headline || "MEGA JACKPOT");
  const [ctaText, setCtaText] = useState(editorMode === 'wheel' ? "SPIN WHEEL" : editorMode === 'scratch' ? "SCRATCH NOW" : "SPIN NOW");
  const [logo, setLogo] = useState(casinoLogo);
  // Initialize with defaults so we can always edit indices 0, 1, 2
  const [customSymbols, setCustomSymbols] = useState<string[]>([symbol7, symbolDiamond, symbolBell]);
  
  // Grid State - stores the symbol URL for each cell in the grid
  const [gridSymbols, setGridSymbols] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

  const [activeSymbolIndex, setActiveSymbolIndex] = useState<number | null>(null);
  const [uploadTarget, setUploadTarget] = useState<'symbol' | 'endCardBg' | 'endCardImage' | 'gridCell' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [background, setBackground] = useState(slotsBg);
  
  // Game Settings
  const [spins, setSpins] = useState(5);
  const [currentSpins, setCurrentSpins] = useState(5);
  const [isReelSpinning, setIsReelSpinning] = useState(false);
  
  // Advanced Settings
  const [slotRows, setSlotRows] = useState(templateConfig.rows || 1); // 1 = 3x1 (classic), 3 = 3x3 (video slot)
  const [slotCols, setSlotCols] = useState(templateConfig.cols || 3); // Default 3 columns
  const [isCustomGrid, setIsCustomGrid] = useState(false);
  const [textColor, setTextColor] = useState(templateConfig.color || '#ffffff');
  const [subheadline, setSubheadline] = useState('');
  const [disclaimerText, setDisclaimerText] = useState('No purchase necessary. 18+ only. T&Cs apply.');
  const [winText, setWinText] = useState('BIG WIN!');
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [winAnimationType, setWinAnimationType] = useState<'coins' | 'confetti' | 'pulse' | 'flash' | 'balloons' | 'money-rain' | 'lightning' | 'heart-burst' | 'starfall' | 'glitch' | 'neon-glow' | 'spotlight' | 'disco-ball' | 'snowfall' | 'fire' | 'bubbles' | 'laser-beams' | 'ribbon' | 'shockwave' | 'magic'>('coins');

  // End Card Settings
  const [endCardHeadline, setEndCardHeadline] = useState("YOU WON!");
  const [endCardSubtext, setEndCardSubtext] = useState("$500 BONUS + 50 SPINS");
  const [endCardCta, setEndCardCta] = useState("CLAIM PRIZE");
  const [showEndCard, setShowEndCard] = useState(false);
  const [endCardBackground, setEndCardBackground] = useState<string | null>(null);
  const [endCardImage, setEndCardImage] = useState<string | null>(null);
  const [showEndCardLogo, setShowEndCardLogo] = useState(true);

  // Element Visibility (Switch Elements)
  const [visibleElements, setVisibleElements] = useState({
    logo: true,
    jackpot: true,
    paylines: true,
    headline: true
  });

  // Auto-populate from uploaded assets but preserve order if possible
  useEffect(() => {
    const logos = getAssetsByType('logo');
    if (logos.length > 0 && logo === casinoLogo) setLogo(logos[0].previewUrl);

    const bgs = getAssetsByType('background');
    if (bgs.length > 0 && background === slotsBg) setBackground(bgs[0].previewUrl);

    // Don't auto-overwrite symbols anymore, let user choose
  }, [assets]);

  const handleSymbolUpdate = (newUrl: string) => {
    // Handle grid cell update
    if (activeCell) {
      setGridSymbols(prev => ({
        ...prev,
        [`${activeCell.row}-${activeCell.col}`]: newUrl
      }));
      // Don't close immediately to allow rapid testing
      return;
    }

    if (activeSymbolIndex === null) return;
    
    const newSymbols = [...customSymbols];
    // Ensure array is long enough
    while (newSymbols.length <= activeSymbolIndex) {
      newSymbols.push(symbol7); // Fill with default
    }
    
    newSymbols[activeSymbolIndex] = newUrl;
    setCustomSymbols(newSymbols);
    // Don't close immediately so they can try others
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addAsset(Array.from(e.target.files));
      // The asset will be added to context. 
      // We can optimistically use the object URL for immediate feedback
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      if (uploadTarget === 'symbol' || uploadTarget === 'gridCell') {
        handleSymbolUpdate(previewUrl);
      } else if (uploadTarget === 'endCardBg') {
        setEndCardBackground(previewUrl);
      } else if (uploadTarget === 'endCardImage') {
        setEndCardImage(previewUrl);
      }
      
      // Reset target
      setUploadTarget(null);
    }
  };

  const triggerUpload = (target: 'symbol' | 'endCardBg' | 'endCardImage' | 'gridCell') => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

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
      
      // Trigger win animation occasionally or on last spin
      if (currentSpins - 1 === 0 || Math.random() > 0.5) {
         setShowWinMessage(true);
         setTimeout(() => setShowWinMessage(false), 2000);
      }

      // Check if that was the last play
      if (currentSpins - 1 === 0) {
        setTimeout(() => {
          setShowEndCard(true);
        }, 2500); // Wait for win animation
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
      
      {/* Hidden File Input (Shared) */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileUpload}
      />
      
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

                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                    <label className="text-xs font-medium text-muted-foreground">Win Celebration Style</label>
                    <div className="grid grid-cols-2 gap-2 h-48 overflow-y-auto custom-scrollbar pr-1">
                        <Button variant={winAnimationType === 'coins' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('coins')}>
                            <Coins className="h-3 w-3 mr-2" /> Coin Shower
                        </Button>
                        <Button variant={winAnimationType === 'confetti' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('confetti')}>
                            <PartyPopper className="h-3 w-3 mr-2" /> Fireworks
                        </Button>
                        <Button variant={winAnimationType === 'pulse' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('pulse')}>
                            <Activity className="h-3 w-3 mr-2" /> Pulse
                        </Button>
                        <Button variant={winAnimationType === 'flash' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('flash')}>
                            <Zap className="h-3 w-3 mr-2" /> Flash
                        </Button>
                        
                        {/* New Styles */}
                        <Button variant={winAnimationType === 'balloons' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('balloons')}>
                            <div className="h-3 w-3 mr-2 rounded-full bg-red-400" /> Balloons
                        </Button>
                        <Button variant={winAnimationType === 'money-rain' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('money-rain')}>
                            <CloudRain className="h-3 w-3 mr-2" /> Money Rain
                        </Button>
                        <Button variant={winAnimationType === 'lightning' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('lightning')}>
                            <ZapOff className="h-3 w-3 mr-2" /> Lightning
                        </Button>
                        <Button variant={winAnimationType === 'heart-burst' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('heart-burst')}>
                            <Heart className="h-3 w-3 mr-2" /> Heart Burst
                        </Button>
                        <Button variant={winAnimationType === 'starfall' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('starfall')}>
                            <Star className="h-3 w-3 mr-2" /> Starfall
                        </Button>
                        <Button variant={winAnimationType === 'glitch' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('glitch')}>
                            <Zap className="h-3 w-3 mr-2" /> Glitch
                        </Button>
                        <Button variant={winAnimationType === 'neon-glow' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('neon-glow')}>
                            <Lightbulb className="h-3 w-3 mr-2" /> Neon Glow
                        </Button>
                        <Button variant={winAnimationType === 'spotlight' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('spotlight')}>
                            <Aperture className="h-3 w-3 mr-2" /> Spotlight
                        </Button>
                        <Button variant={winAnimationType === 'disco-ball' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('disco-ball')}>
                            <Disc className="h-3 w-3 mr-2" /> Disco Ball
                        </Button>
                        <Button variant={winAnimationType === 'snowfall' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('snowfall')}>
                            <Snowflake className="h-3 w-3 mr-2" /> Snowfall
                        </Button>
                        <Button variant={winAnimationType === 'fire' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('fire')}>
                            <Flame className="h-3 w-3 mr-2" /> Fire
                        </Button>
                        <Button variant={winAnimationType === 'bubbles' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('bubbles')}>
                            <Droplets className="h-3 w-3 mr-2" /> Bubbles
                        </Button>
                        <Button variant={winAnimationType === 'laser-beams' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('laser-beams')}>
                            <div className="h-0.5 w-3 mr-2 bg-red-500" /> Lasers
                        </Button>
                        <Button variant={winAnimationType === 'ribbon' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('ribbon')}>
                            <Ribbon className="h-3 w-3 mr-2" /> Ribbon
                        </Button>
                        <Button variant={winAnimationType === 'shockwave' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('shockwave')}>
                            <Waves className="h-3 w-3 mr-2" /> Shockwave
                        </Button>
                         <Button variant={winAnimationType === 'magic' ? 'default' : 'outline'} size="sm" className="text-xs justify-start h-8" onClick={() => setWinAnimationType('magic')}>
                            <Wand2 className="h-3 w-3 mr-2" /> Magic
                        </Button>
                    </div>
                </div>

                {editorMode === 'slots' && (
                  <>
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border mt-4">
                       <div className="flex justify-between items-center">
                         <label className="text-xs font-medium text-muted-foreground">Grid Layout</label>
                         <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{slotCols} x {slotRows}</span>
                       </div>
                       
                       {/* Grid Presets */}
                       {!isCustomGrid ? (
                         <div className="flex gap-2">
                           <Button 
                             variant={slotRows === 1 && slotCols === 3 ? "default" : "outline"} 
                             size="sm" 
                             className="flex-1 text-xs"
                             onClick={() => { setSlotRows(1); setSlotCols(3); }}
                           >
                             3x1 Classic
                           </Button>
                           <Button 
                             variant={slotRows === 3 && slotCols === 3 ? "default" : "outline"} 
                             size="sm" 
                             className="flex-1 text-xs"
                             onClick={() => { setSlotRows(3); setSlotCols(3); }}
                           >
                             3x3 Video
                           </Button>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="flex-1 text-xs"
                             onClick={() => setIsCustomGrid(true)}
                           >
                             Custom
                           </Button>
                         </div>
                       ) : (
                         <div className="space-y-3 pt-2">
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                               <label className="text-[10px] text-muted-foreground uppercase font-bold">Rows</label>
                               <input 
                                 type="number" 
                                 min="1" max="6" 
                                 value={slotRows}
                                 onChange={(e) => setSlotRows(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                                 className="w-full h-8 px-2 text-sm rounded-md border border-input bg-background"
                               />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] text-muted-foreground uppercase font-bold">Columns</label>
                               <input 
                                 type="number" 
                                 min="1" max="5" 
                                 value={slotCols}
                                 onChange={(e) => setSlotCols(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                                 className="w-full h-8 px-2 text-sm rounded-md border border-input bg-background"
                               />
                             </div>
                           </div>
                           <Button 
                             variant="secondary" 
                             size="sm" 
                             className="w-full text-xs"
                             onClick={() => setIsCustomGrid(false)}
                           >
                             Back to Presets
                           </Button>
                         </div>
                       )}
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <LayoutTemplate className="h-4 w-4 text-primary" />
                        Cell Customization
                      </label>
                      <p className="text-xs text-muted-foreground mb-3">Click on any cell in the preview grid to change its specific symbol.</p>
                      
                      {activeCell ? (
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-primary">Editing Cell {activeCell.row + 1}x{activeCell.col + 1}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setActiveCell(null)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto p-1 custom-scrollbar">
                            {/* Defaults + Current Grid Symbol */}
                            {[
                               gridSymbols[`${activeCell.row}-${activeCell.col}`] || symbol7,
                               symbol7, symbolDiamond, symbolBell, symbolCherry, chipRed, chipBlue
                             ].filter((v, i, a) => a.indexOf(v) === i).map((s, i) => (
                              <div 
                                key={`cell-opt-${i}`}
                                onClick={() => handleSymbolUpdate(s)}
                                className={cn(
                                  "aspect-square rounded border bg-white p-1 cursor-pointer hover:scale-110 transition-transform",
                                  gridSymbols[`${activeCell.row}-${activeCell.col}`] === s ? "border-primary ring-1 ring-primary" : "border-transparent"
                                )}
                              >
                                <img src={s} className="w-full h-full object-contain" />
                              </div>
                            ))}
                            
                            {/* User Uploads */}
                            {getAssetsByType('symbol').map((asset) => (
                               <div 
                                 key={asset.id}
                                 onClick={() => handleSymbolUpdate(asset.previewUrl)}
                                 className={cn(
                                   "aspect-square rounded border bg-white p-1 cursor-pointer hover:scale-110 transition-transform",
                                   gridSymbols[`${activeCell.row}-${activeCell.col}`] === asset.previewUrl ? "border-primary ring-1 ring-primary" : "border-transparent"
                                 )}
                               >
                                 <img src={asset.previewUrl} className="w-full h-full object-contain" />
                               </div>
                            ))}

                            {/* Upload Button */}
                            <div 
                              onClick={() => triggerUpload('gridCell')}
                              className="aspect-square rounded border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-background hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-lg border border-border border-dashed text-center">
                          <span className="text-xs text-muted-foreground">No cell selected</span>
                        </div>
                      )}
                    </div>

                    <label className="text-sm font-medium flex items-center gap-2 mt-6">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      Global High Value Symbols
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">Click a symbol to replace it.</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveSymbolIndex(i === activeSymbolIndex ? null : i)}
                          className={cn(
                            "aspect-square rounded-md border-2 bg-background p-2 flex items-center justify-center cursor-pointer transition-all relative",
                            activeSymbolIndex === i ? "border-primary ring-2 ring-primary/30 scale-105 z-10" : "border-border hover:border-primary/50"
                          )}
                        >
                          <img 
                            src={customSymbols[i] || [symbol7, symbolDiamond, symbolBell][i]} 
                            className="w-full h-full object-contain drop-shadow-lg" 
                          />
                          {activeSymbolIndex === i && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Symbol Selector Panel */}
                    {activeSymbolIndex !== null && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold uppercase text-muted-foreground">Select Replacement</span>
                           <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setActiveSymbolIndex(null)}>
                             <X className="h-3 w-3" />
                           </Button>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 mb-3 max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                          {/* Defaults */}
                          {[symbol7, symbolDiamond, symbolBell, symbolCherry, chipRed, chipBlue].map((s, i) => (
                            <div 
                              key={`def-${i}`}
                              onClick={() => handleSymbolUpdate(s)}
                              className={cn(
                                "aspect-square rounded border bg-white p-1 cursor-pointer hover:scale-110 transition-transform",
                                customSymbols[activeSymbolIndex] === s ? "border-primary ring-1 ring-primary" : "border-transparent"
                              )}
                            >
                              <img src={s} className="w-full h-full object-contain" />
                            </div>
                          ))}
                          
                          {/* User Uploads */}
                          {getAssetsByType('symbol').map((asset) => (
                             <div 
                               key={asset.id}
                               onClick={() => handleSymbolUpdate(asset.previewUrl)}
                               className={cn(
                                 "aspect-square rounded border bg-white p-1 cursor-pointer hover:scale-110 transition-transform",
                                 customSymbols[activeSymbolIndex] === asset.previewUrl ? "border-primary ring-1 ring-primary" : "border-transparent"
                               )}
                             >
                               <img src={asset.previewUrl} className="w-full h-full object-contain" />
                             </div>
                          ))}

                          {/* Upload Button */}
                          <div 
                            onClick={() => triggerUpload('symbol')}
                            className="aspect-square rounded border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-background hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    )}
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
                <label className="text-sm font-medium">Win Message</label>
                <input 
                  type="text" 
                  value={winText}
                  onChange={(e) => setWinText(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-bold uppercase"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Disclaimer Text</label>
                <textarea 
                  value={disclaimerText}
                  onChange={(e) => setDisclaimerText(e.target.value)}
                  className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
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

                {/* End Card Branding */}
                <div className="space-y-4 border-b border-border pb-4">
                  <h4 className="text-sm font-medium">Branding & Visuals</h4>
                  
                  <div className="flex items-center justify-between">
                     <label className="text-sm text-muted-foreground">Show Logo</label>
                     <Switch 
                       checked={showEndCardLogo} 
                       onCheckedChange={setShowEndCardLogo}
                     />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Background Image</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div 
                        onClick={() => setEndCardBackground(null)}
                        className={cn(
                          "aspect-video rounded border flex items-center justify-center cursor-pointer text-xs",
                          endCardBackground === null ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
                        )}
                      >
                        Default (Dark)
                      </div>
                      {getAssetsByType('background').map(asset => (
                        <div 
                          key={asset.id}
                          onClick={() => setEndCardBackground(asset.previewUrl)}
                          className={cn(
                            "aspect-video rounded border overflow-hidden cursor-pointer relative",
                            endCardBackground === asset.previewUrl ? "border-primary ring-1 ring-primary" : "border-transparent"
                          )}
                        >
                          <img src={asset.previewUrl} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      
                      {/* Upload for End Card Bg */}
                      <div 
                        onClick={() => triggerUpload('endCardBg')}
                        className="aspect-video rounded border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-background hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Prize Image / Icon</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                       <div 
                         onClick={() => setEndCardImage(null)}
                         className={cn(
                           "h-12 w-12 rounded border flex items-center justify-center cursor-pointer shrink-0",
                           endCardImage === null ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
                         )}
                       >
                         <Trophy className="h-6 w-6" />
                       </div>
                       {getAssetsByType('product').concat(getAssetsByType('symbol')).map(asset => (
                         <div 
                           key={asset.id}
                           onClick={() => setEndCardImage(asset.previewUrl)}
                           className={cn(
                             "h-12 w-12 rounded border overflow-hidden cursor-pointer shrink-0 bg-white",
                             endCardImage === asset.previewUrl ? "border-primary ring-1 ring-primary" : "border-border"
                           )}
                         >
                           <img src={asset.previewUrl} className="w-full h-full object-contain" />
                         </div>
                       ))}
                       
                       {/* Upload for End Card Image */}
                       <div 
                         onClick={() => triggerUpload('endCardImage')}
                         className="h-12 w-12 rounded border border-dashed border-border flex items-center justify-center cursor-pointer shrink-0 hover:bg-background hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                       >
                         <Plus className="h-4 w-4" />
                       </div>
                    </div>
                  </div>
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
            
            {isPlaying && (
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 animate-in fade-in"
                onClick={() => {
                  setIsReelSpinning(true);
                  setTimeout(() => {
                    setIsReelSpinning(false);
                    setShowWinMessage(true);
                    setTimeout(() => setShowWinMessage(false), 2000);
                  }, 1000);
                }}
              >
                <Trophy className="h-4 w-4" /> Test Win
              </Button>
            )}

            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Win Animation Overlay */}
        <AnimatePresence>
            {showWinMessage && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                    {/* Background Dim - Optional */}
                    {/* <div className="absolute inset-0 bg-black/20" /> */}

                    {/* Flash Effect */}
                    {winAnimationType === 'flash' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white mix-blend-overlay"
                        />
                    )}

                    {/* Coin Shower */}
                    {winAnimationType === 'coins' && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: -100, x: Math.random() * 100 + "%", rotate: 0 }}
                                    animate={{ y: 800, rotate: 360 }}
                                    transition={{ duration: 1.5, delay: i * 0.05, ease: "linear" }}
                                    className="absolute text-yellow-400 drop-shadow-md"
                                >
                                    <Coins size={32} fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Confetti / Fireworks */}
                    {winAnimationType === 'confetti' && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "50%", x: "50%", scale: 0 }}
                                    animate={{ 
                                        y: Math.random() * 100 + "%", 
                                        x: Math.random() * 100 + "%", 
                                        scale: [0, 1.5, 0],
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={cn(
                                        "absolute w-4 h-4 rounded-sm",
                                        ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"][i % 5]
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pulse Effect (on the game container) */}
                    {/* Note: This logic is slightly abstracted here, but we can animate the container itself if we passed a ref, 
                        or just overlay a pulsing ring */}
                    {winAnimationType === 'pulse' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: 2 }}
                            className="absolute inset-0 border-8 border-yellow-400 rounded-xl"
                        />
                    )}

                    {/* NEW ANIMATIONS */}
                    
                    {/* Balloons */}
                    {winAnimationType === 'balloons' && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "110%", x: `${Math.random() * 100}%` }}
                                    animate={{ y: "-120%" }}
                                    transition={{ duration: 3, delay: i * 0.1, ease: "easeIn" }}
                                    className="absolute"
                                >
                                    <div className={cn("w-8 h-10 rounded-full opacity-90 shadow-lg", ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500"][i % 5])} />
                                    <div className="w-0.5 h-12 bg-white/50 mx-auto mt-[-5px]" />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Money Rain */}
                    {winAnimationType === 'money-rain' && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "-20%", x: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
                                    animate={{ y: "120%", rotate: Math.random() * 360 }}
                                    transition={{ duration: 2.5, delay: i * 0.05, ease: "linear" }}
                                    className="absolute text-green-500 font-bold text-2xl drop-shadow-md"
                                >
                                    $
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Lightning */}
                    {winAnimationType === 'lightning' && (
                        <>
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-blue-100/30 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [0, 1, 0, 1, 0], scale: 1.5 }}
                                    transition={{ duration: 0.3, repeat: 3 }}
                                >
                                    <Zap className="w-96 h-96 text-yellow-400 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" fill="currentColor" />
                                </motion.div>
                            </div>
                        </>
                    )}

                    {/* Heart Burst */}
                    {winAnimationType === 'heart-burst' && (
                        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{ 
                                        scale: [0, 2, 0], 
                                        x: (Math.random() - 0.5) * 600,
                                        y: (Math.random() - 0.5) * 600
                                    }}
                                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                    className="absolute text-red-500 drop-shadow-lg"
                                >
                                    <Heart fill="currentColor" size={40} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Starfall */}
                    {winAnimationType === 'starfall' && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: -50, x: `${Math.random() * 100}%`, scale: 0 }}
                                    animate={{ y: "120%", scale: Math.random() * 1.5 }}
                                    transition={{ duration: 1.5, delay: i * 0.05 }}
                                    className="absolute text-yellow-300 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
                                >
                                    <Star fill="currentColor" size={24} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Glitch */}
                    {winAnimationType === 'glitch' && (
                        <motion.div
                            className="absolute inset-0 bg-transparent z-40"
                            animate={{
                                x: [0, -10, 10, -5, 5, 0],
                                filter: ["none", "hue-rotate(90deg)", "invert(1)", "none"]
                            }}
                            transition={{ duration: 0.5, repeat: 3 }}
                        >
                            <div className="absolute inset-0 bg-red-500/10 mix-blend-color-burn" />
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-white/50" />
                        </motion.div>
                    )}

                    {/* Neon Glow */}
                    {winAnimationType === 'neon-glow' && (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1, 0.5, 1] }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 border-4 border-pink-500 shadow-[0_0_100px_rgba(236,72,153,0.8),inset_0_0_50px_rgba(236,72,153,0.5)] rounded-xl z-10"
                        />
                    )}

                    {/* Spotlight */}
                    {winAnimationType === 'spotlight' && (
                        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
                            <motion.div 
                                animate={{ rotate: [0, 45, 0, -45, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-1/2 left-1/4 w-1/2 h-[200%] bg-gradient-to-b from-white/30 to-transparent transform origin-top blur-xl"
                            />
                             <motion.div 
                                animate={{ rotate: [0, -45, 0, 45, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -top-1/2 right-1/4 w-1/2 h-[200%] bg-gradient-to-b from-white/30 to-transparent transform origin-top blur-xl"
                            />
                        </div>
                    )}

                    {/* Disco Ball */}
                    {winAnimationType === 'disco-ball' && (
                        <div className="absolute inset-0 z-10 overflow-hidden">
                             {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1.5, 0.5]
                                    }}
                                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                                    className="absolute rounded-full blur-md"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)]
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Snowfall */}
                    {winAnimationType === 'snowfall' && (
                         <div className="absolute inset-0 overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: -20, x: `${Math.random() * 100}%` }}
                                    animate={{ y: "120%", x: `${(Math.random() * 100) + (Math.random() > 0.5 ? 20 : -20)}%` }}
                                    transition={{ duration: 3, delay: i * 0.05, ease: "linear" }}
                                    className="absolute text-white/80"
                                >
                                    <Snowflake size={Math.random() * 10 + 10} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Fire */}
                    {winAnimationType === 'fire' && (
                        <div className="absolute inset-0 overflow-hidden flex items-end justify-center">
                             {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "20%", opacity: 0, scale: 0 }}
                                    animate={{ y: "-100%", opacity: [1, 0], scale: [1, 2] }}
                                    transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity }}
                                    className="absolute bottom-0 w-20 h-20 bg-orange-500 rounded-full blur-xl mix-blend-screen"
                                    style={{ left: `${Math.random() * 100}%` }}
                                />
                            ))}
                        </div>
                    )}

                     {/* Bubbles */}
                    {winAnimationType === 'bubbles' && (
                        <div className="absolute inset-0 overflow-hidden">
                             {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "110%", opacity: 0 }}
                                    animate={{ y: "-20%", opacity: [0, 1, 0], x: "+=20" }}
                                    transition={{ duration: 4, delay: i * 0.1, ease: "easeInOut" }}
                                    className="absolute w-8 h-8 rounded-full border border-white/50 bg-white/10 backdrop-blur-sm"
                                    style={{ left: `${Math.random() * 100}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Laser Beams */}
                    {winAnimationType === 'laser-beams' && (
                        <div className="absolute inset-0 overflow-hidden z-0">
                             {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-1/2 left-1/2 w-[200%] h-1 bg-red-500 shadow-[0_0_20px_red] origin-left"
                                    style={{ marginLeft: '-100%' }}
                                />
                            ))}
                             {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={`b-${i}`}
                                    animate={{ rotate: [360, 0] }}
                                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-1/2 left-1/2 w-[200%] h-1 bg-blue-500 shadow-[0_0_20px_blue] origin-left"
                                    style={{ marginLeft: '-100%' }}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Ribbon */}
                    {winAnimationType === 'ribbon' && (
                        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="w-full h-32 bg-red-600 flex items-center justify-center shadow-lg transform -skew-y-6"
                            >
                                <div className="w-full h-2 border-t border-dashed border-white/30 absolute top-2" />
                                <div className="w-full h-2 border-b border-dashed border-white/30 absolute bottom-2" />
                            </motion.div>
                        </div>
                    )}

                    {/* Shockwave */}
                    {winAnimationType === 'shockwave' && (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                             {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ width: 0, height: 0, opacity: 1, borderWidth: 20 }}
                                    animate={{ width: "200%", height: "200%", opacity: 0, borderWidth: 0 }}
                                    transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                                    className="absolute rounded-full border-white"
                                />
                             ))}
                        </div>
                    )}

                     {/* Magic */}
                    {winAnimationType === 'magic' && (
                         <div className="absolute inset-0 overflow-hidden">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: 180 }}
                                    transition={{ duration: 1, delay: Math.random() * 1.5, repeat: Infinity }}
                                    className="absolute text-purple-400"
                                    style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                                >
                                    <Sparkles size={Math.random() * 20 + 10} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* The Win Text Itself */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="bg-black/80 text-white font-black text-5xl px-10 py-6 rounded-2xl border-4 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.6)] backdrop-blur-md text-center z-50"
                    >
                        <span className="block text-yellow-400 text-7xl mb-2 filter drop-shadow-lg">{winText}</span>
                        <span className="text-xl font-bold tracking-widest uppercase text-white/90">You Won!</span>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

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
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4 relative">
                  {/* (Old Win Message Overlay removed - now handled by global AnimatePresence above) */}

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
                      slotRows >= 3 ? "aspect-[3/4]" : "aspect-[4/3]"
                    )}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                      
                      {/* Reels Container */}
                      <div 
                        className={cn(
                          "w-full h-full bg-white/5 rounded grid gap-1 p-1"
                        )}
                        style={{ gridTemplateColumns: `repeat(${slotCols}, minmax(0, 1fr))` }}
                      >
                        {Array.from({ length: slotCols }).map((_, colIndex) => (
                          <div key={`col-${colIndex}`} className="flex flex-col gap-1 h-full overflow-hidden relative">
                             {/* Reel Strip Animation */}
                             <div className={cn(
                               "flex flex-col gap-1 w-full h-full",
                               isReelSpinning && (templateConfig.animation === 'spin' || !templateConfig.animation) && "animate-spin-reel",
                               isReelSpinning && templateConfig.animation === 'bounce' && "animate-bounce-spin",
                               isReelSpinning && templateConfig.animation === 'cascade' && "animate-cascade",
                               isReelSpinning && templateConfig.animation === 'fade' && "animate-fade-reveal",
                               isReelSpinning && templateConfig.animation === 'shake' && "animate-shake"
                             )}
                             style={{ animationDelay: `${colIndex * 100}ms` }}
                             >
                               {Array.from({ length: slotRows }).map((_, rowIndex) => {
                                 // Determine symbol source: Specific cell override OR random default
                                 const cellKey = `${rowIndex}-${colIndex}`;
                                 const hasOverride = gridSymbols[cellKey];
                                 const defaultSymbol = customSymbols[(colIndex + rowIndex) % customSymbols.length]; // Fallback pattern
                                 
                                 return (
                                   <div 
                                     key={`cell-${rowIndex}-${colIndex}`} 
                                     className={cn(
                                       "bg-white rounded border-2 border-slate-200 flex items-center justify-center p-2 shadow-inner relative group cursor-pointer hover:border-primary transition-colors flex-1 min-h-0",
                                       activeCell?.row === rowIndex && activeCell?.col === colIndex ? "border-primary ring-2 ring-primary z-10" : ""
                                     )}
                                     onClick={() => {
                                       setActiveCell({ row: rowIndex, col: colIndex });
                                       setActiveTab('game'); // Ensure game tab is open
                                     }}
                                   >
                                     <img 
                                       src={hasOverride || defaultSymbol} 
                                       className={cn(
                                         "w-full h-full object-contain drop-shadow-md transition-all duration-300",
                                         isReelSpinning && (templateConfig.animation === 'spin' || !templateConfig.animation) && "blur-[2px]",
                                         isReelSpinning && templateConfig.animation === 'fade' && "opacity-50 scale-90"
                                       )}
                                     />
                                     {/* Hover indicator */}
                                     <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                        <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                                          <Palette className="h-3 w-3" />
                                        </div>
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                          </div>
                        ))}
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

                  {/* Disclaimer */}
                  {disclaimerText && (
                    <div className="mt-2 text-center px-4 w-full z-10">
                      <p className="text-[10px] text-white/50 font-medium leading-tight whitespace-pre-wrap">
                        {disclaimerText}
                      </p>
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
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300 overflow-hidden">
                  {/* Background Layer */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0" />
                  {endCardBackground && (
                    <div className="absolute inset-0 z-0">
                      <img src={endCardBackground} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                  )}

                  <div className="w-full max-w-sm text-center space-y-6 relative z-10">
                    {/* Optional Logo */}
                    {showEndCardLogo && (
                       <div className="flex justify-center mb-4">
                         <img src={logo} className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                       </div>
                    )}

                    {/* Winner Icon / Image */}
                    {endCardImage ? (
                      <div className="mx-auto h-32 w-32 flex items-center justify-center animate-bounce">
                        <img src={endCardImage} className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]" />
                      </div>
                    ) : (
                      <div className="mx-auto h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.4)] animate-bounce">
                        <Trophy className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}

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