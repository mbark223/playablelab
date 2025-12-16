import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Monitor, Smartphone, Tablet, Download, Share2, Layers, Type, Palette, Coins, Dices, Crown, Check, Trophy, LayoutTemplate, Eye, EyeOff, Sparkles, Disc, Hexagon, Plus, Image as ImageIcon, X, PartyPopper, Zap, CloudRain, Heart, Star, Sun, Snowflake, Flame, Droplets, Ribbon, Wand2, Waves, Lightbulb, Music, ZapOff, Aperture, Activity, ArrowDown, Layout, Gamepad2, Gift, MousePointerClick, Combine, Brush, AlertCircle, PackageOpen, Timer, Grid3X3, BarChart3, MousePointer2, LockOpen, Shuffle, RefreshCw, Diamond, Sword, Hammer, Scroll, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
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
import borderBrick from '@assets/Huff_N_Even_More_Puff_Sym_Brick_House_border_1765722611336.png';
import borderStraw from '@assets/Huff_N_Even_More_Puff_Sym_Staw_House_border_1765722616572.png';
import borderWood from '@assets/Huff_N_Even_More_Puff_sym_Wood_House_border_1765722627179.png';
import quizImg from '@assets/generated_images/interactive_quiz_interface.png';

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
  const [editorMode, setEditorMode] = useState<'slots' | 'wheel' | 'scratch' | 'pick' | 'match' | 'fall' | 'quiz'>(
    templateId?.includes('wheel') ? 'wheel' : 
    templateId?.includes('scratch') ? 'scratch' : 
    templateId?.includes('quiz') ? 'quiz' :
    'slots'
  );

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
  const [uploadTarget, setUploadTarget] = useState<{ type: 'symbol' | 'endCardBg' | 'endCardImage' | 'gridCell' | 'jackpotBorder' | 'music' | 'spinSound' | 'winSound', index?: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement>(null);
  const winAudioRef = useRef<HTMLAudioElement>(null);

  const [background, setBackground] = useState(slotsBg);
  const [backgroundMusic, setBackgroundMusic] = useState<string | null>(null);
  const [spinSound, setSpinSound] = useState<string | null>(null);
  const [winSound, setWinSound] = useState<string | null>(null);
  
  // Game Settings
  const [jackpots, setJackpots] = useState<{label: string, value: string, border?: string}[]>([
    { label: "GRAND", value: "$1,240,500", border: borderBrick },
    { label: "MAJOR", value: "$50,000", border: borderWood },
    { label: "MINOR", value: "$2,500", border: borderStraw },
    { label: "MINI", value: "$500" },
    { label: "TINY", value: "$100" }
  ]);
  const [jackpotCount, setJackpotCount] = useState(4);
  const [jackpotFontSize, setJackpotFontSize] = useState(18); // Default font size in px
  const [jackpotLayout, setJackpotLayout] = useState<'row' | 'distributed'>('distributed');
  const [spins, setSpins] = useState(5);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState([
    { id: 1, question: "What makes our product unique?", options: ["All Natural", "Zero Sugar", "Double Caffeinated", "Blue Color"], correct: 0 },
    { id: 2, question: "Which flavor is our newest?", options: ["Vanilla", "Chocolate", "Strawberry", "Mango"], correct: 3 },
    { id: 3, question: "Our brand was founded in?", options: ["1995", "2005", "2015", "2025"], correct: 2 }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // --- PLAYABLE TEMPLATE DEFINITIONS ---
  
  interface MechanicTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    image?: string;
    features: string[];
    config?: { rows?: number; cols?: number; spins?: number; color?: string };
  }

  interface MechanicCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    templates: MechanicTemplate[];
  }

  const mechanicCategories: MechanicCategory[] = [
    {
      id: 'spin-based',
      name: 'Spin-Based Slots',
      description: 'Classic reel mechanics with various progression styles',
      icon: Disc,
      templates: [
        { 
          id: 'spin-2-win', 
          name: '2 Spins → Win', 
          description: 'Guaranteed small win on 2nd spin', 
          icon: Zap,
          image: background, // Dynamic: Uses current background
          features: ['Quick gratification', 'High conversion', 'Simple loop'],
          config: { spins: 2 }
        },
        { 
          id: 'spin-3-tease', 
          name: '3 Spins → Near Miss', 
          description: 'Near miss on 2nd, bonus tease on 3rd', 
          icon: AlertCircle,
          image: background,
          features: ['Engagement building', 'Retention focus', 'Emotional hook'],
          config: { spins: 3 }
        },
        { 
          id: 'spin-mega', 
          name: 'Spin → Collect → Mega', 
          description: 'Collect symbols to trigger final mega spin', 
          icon: Crown,
          image: background,
          features: ['Progressive', 'High stakes finale', 'Collection mechanic'],
          config: { spins: 5 }
        },
      ]
    },
    {
      id: 'bonus-round',
      name: 'Bonus Rounds',
      description: 'Interactive mini-games and pick mechanics',
      icon: Gift,
      templates: [
        { 
          id: 'pick-chest', 
          name: 'Pick 1 of 3', 
          description: 'Player chooses 1 of 3 mystery chests', 
          icon: PackageOpen,
          image: 'https://www.transparenttextures.com/patterns/wood-pattern.png', // Placeholder for chest bg
          features: ['Player agency', 'Mystery', 'Instant reward']
        },
        { 
          id: 'tap-reveal', 
          name: 'Tap-to-Reveal', 
          description: 'Tap multiple items to find multipliers', 
          icon: MousePointerClick,
          image: scratchImg,
          features: ['High interaction', 'Variable reward', 'Speed']
        },
        { 
          id: 'timed-bonus', 
          name: 'Timed Countdown', 
          description: 'Complete task before timer expires', 
          icon: Timer,
          image: slotsBg,
          features: ['Urgency', 'Skill element', 'Excitement']
        },
      ]
    },
    {
      id: 'match-mechanics',
      name: 'Match Mechanics',
      description: 'Grid-based matching puzzles',
      icon: Combine,
      templates: [
        { 
          id: 'match-3', 
          name: 'Match 3 Colors', 
          description: 'Connect 3 same-colored items to win', 
          icon: Grid3X3,
          image: 'https://www.transparenttextures.com/patterns/cubes.png',
          features: ['Puzzle element', 'Casual appeal', 'Visual feedback'],
          config: { rows: 5, cols: 5 }
        },
        { 
          id: 'match-progressive', 
          name: 'Progressive Match', 
          description: 'Fills meter to trigger bonus', 
          icon: BarChart3,
          image: 'https://www.transparenttextures.com/patterns/cubes.png',
          features: ['Goal oriented', 'Visual progress', 'Reward loop']
        },
      ]
    },
    {
      id: 'tap-collect',
      name: 'Tap / Collect',
      description: 'Active gameplay requiring player input',
      icon: MousePointer2,
      templates: [
        { 
          id: 'tap-falling', 
          name: 'Tap Falling Coins', 
          description: 'Catch items falling from top', 
          icon: ArrowDown,
          image: runnerImg,
          features: ['Reflex based', 'High activity', 'Fun chaos']
        },
        { 
          id: 'collect-unlock', 
          name: 'Collect to Unlock', 
          description: 'Gather specific symbols to spin', 
          icon: LockOpen,
          image: runnerImg,
          features: ['Collection', 'Anticipation', 'Reward gate']
        },
      ]
    },
    {
      id: 'hybrid',
      name: 'Hybrid',
      description: 'Mixed mechanics for deeper gameplay',
      icon: Shuffle,
      templates: [
        { 
          id: 'match-spin', 
          name: 'Match → Spin', 
          description: 'Match items to earn spins', 
          icon: RefreshCw,
          image: wheelImg,
          features: ['Multi-stage', 'Genre blend', 'Deep engagement']
        },
        { 
          id: 'spin-pick', 
          name: 'Spin → Pick', 
          description: 'Spin results trigger pick bonus', 
          icon: Gift,
          image: wheelImg,
          features: ['Classic combo', 'Variety', 'Extended play']
        },
      ]
    },
    {
      id: 'quiz',
      name: 'Interactive Quiz',
      description: 'Educate users while they play',
      icon: HelpCircle,
      templates: [
        {
          id: 'quiz-master',
          name: 'Brand Trivia',
          description: 'Answer questions to win',
          icon: HelpCircle,
          image: quizImg,
          features: ['Educational', 'Brand awareness', 'Low friction']
        }
      ]
    }
  ];

  interface ThemeTemplate {
    id: string;
    name: string;
    color: string;
    bg?: string;
    icon: React.ElementType;
  }

  const themes: ThemeTemplate[] = [
    { id: 'vegas', name: 'Vegas Luxury', color: '#fbbf24', icon: Diamond },
    { id: 'fantasy', name: 'Epic Fantasy', color: '#8b5cf6', icon: Sword },
    { id: 'sports', name: 'Sports Arena', color: '#3b82f6', icon: Trophy },
    { id: 'gold-rush', name: 'Gold Rush', color: '#f59e0b', icon: Hammer },
    { id: 'neon', name: 'Neon Cyber', color: '#ec4899', icon: Zap },
    { id: 'ocean', name: 'Deep Ocean', color: '#0ea5e9', icon: Waves },
    { id: 'candy', name: 'Sweet Candy', color: '#f43f5e', icon: Heart },
    { id: 'ancient', name: 'Ancient Gods', color: '#d97706', icon: Scroll },
  ];

  // Helper icons for templates (imports needed)
  // Assuming these are available or I need to import them. 
  // I'll add imports for missing icons in a separate edit if needed, or replace with generic ones.
  // Using Lucide icons already imported + some new ones.
  
  const applyMechanic = (template: MechanicTemplate) => {
    // Logic to apply mechanic settings
    if (template.config?.rows) setSlotRows(template.config.rows);
    if (template.config?.cols) setSlotCols(template.config.cols);
    if (template.config?.spins) setSpins(template.config.spins);
    
    // Set headline based on mechanic for feedback
    setSubheadline(template.name.toUpperCase());
    
    // Switch mode based on category
    const categoryId = mechanicCategories.find(c => c.templates.some(t => t.id === template.id))?.id;
    
    if (categoryId === 'spin-based') {
      setEditorMode('slots');
      setCtaText("SPIN NOW");
    } else if (categoryId === 'bonus-round') {
      setEditorMode('pick');
      setCtaText("PICK A CHEST");
    } else if (categoryId === 'match-mechanics') {
      setEditorMode('match');
      setCtaText("PLAY MATCH");
    } else if (categoryId === 'tap-collect') {
      setEditorMode('fall');
      setCtaText("CATCH 'EM!");
    } else if (categoryId === 'hybrid') {
      setEditorMode('slots'); // Default to slots for hybrid
      setCtaText("SPIN & WIN");
    } else if (categoryId === 'quiz') {
      setEditorMode('quiz');
      setCtaText("START QUIZ");
      setSubheadline("TEST YOUR KNOWLEDGE");
    }
  };

  const applyTheme = (theme: ThemeTemplate) => {
    setTextColor(theme.color);
    // In real app, this would swap assets/bg/sounds
  };

  const [currentSpins, setCurrentSpins] = useState(5);
  const [isReelSpinning, setIsReelSpinning] = useState(false);
  const [reelsSpinning, setReelsSpinning] = useState<boolean[]>([]);
  
  // Advanced Settings
  const [slotRows, setSlotRows] = useState(templateConfig.rows || 1); // 1 = 3x1 (classic), 3 = 3x3 (video slot)
  const [slotCols, setSlotCols] = useState(templateConfig.cols || 3); // Default 3 columns
  const [isCustomGrid, setIsCustomGrid] = useState(false);
  
  // Board Dimensions
  const [boardScale, setBoardScale] = useState(98);
  const [boardAspectRatio, setBoardAspectRatio] = useState<'auto' | 'portrait' | 'landscape' | 'square'>('auto');

  const [textColor, setTextColor] = useState(templateConfig.color || '#ffffff');
  const [subheadline, setSubheadline] = useState('');
  const [disclaimerText, setDisclaimerText] = useState('No purchase necessary. 18+ only. T&Cs apply.');
  
  // Win Configurations per Spin
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [winConfigs, setWinConfigs] = useState<Array<{text: string, animation: string}>>(
    Array(10).fill(null).map((_, i) => ({
      text: i === 4 ? 'JACKPOT!' : 'BIG WIN!', 
      animation: ['coins', 'confetti', 'money-rain', 'starfall', 'fire'][i % 5]
    }))
  );

  const [showWinMessage, setShowWinMessage] = useState(false);
  const [currentWinConfig, setCurrentWinConfig] = useState(winConfigs[0]);
  const [winBorder, setWinBorder] = useState<string | null>(null);

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
      
      if (uploadTarget?.type === 'symbol' || uploadTarget?.type === 'gridCell') {
        handleSymbolUpdate(previewUrl);
      } else if (uploadTarget?.type === 'endCardBg') {
        setEndCardBackground(previewUrl);
      } else if (uploadTarget?.type === 'endCardImage') {
        setEndCardImage(previewUrl);
      } else if (uploadTarget?.type === 'jackpotBorder' && typeof uploadTarget.index === 'number') {
        const newJackpots = [...jackpots];
        newJackpots[uploadTarget.index].border = previewUrl;
        setJackpots(newJackpots);
      } else if (uploadTarget?.type === 'music') {
        setBackgroundMusic(previewUrl);
      } else if (uploadTarget?.type === 'spinSound') {
        setSpinSound(previewUrl);
      } else if (uploadTarget?.type === 'winSound') {
        setWinSound(previewUrl);
      }
      
      // Reset target
      setUploadTarget(null);
    }
  };

  const triggerUpload = (target: { type: 'symbol' | 'endCardBg' | 'endCardImage' | 'gridCell' | 'jackpotBorder' | 'music' | 'spinSound' | 'winSound', index?: number }) => {
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

    // Play Spin Sound
    if (spinSound && spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play().catch(console.error);
    }

    setIsReelSpinning(true);
    setReelsSpinning(new Array(slotCols).fill(true));
    setCurrentSpins(prev => prev - 1);

    // Staggered stop
    const totalDuration = 2000;
    const staggerDelay = 300; // Time between each reel stopping
    
    // Stop reels one by one
    for (let i = 0; i < slotCols; i++) {
        setTimeout(() => {
            setReelsSpinning(prev => {
                const newState = [...prev];
                newState[i] = false;
                return newState;
            });
        }, totalDuration + (i * staggerDelay));
    }

    // End game logic
    const totalTime = totalDuration + (slotCols * staggerDelay) + 500; // Buffer

    // Determine which spin this is (0-indexed)
    const spinIndex = spins - currentSpins; 
    const thisWinConfig = winConfigs[spinIndex] || winConfigs[0];

    setTimeout(() => {
      setIsReelSpinning(false);
      
      // Trigger win animation occasionally or on last spin
      if (currentSpins - 1 === 0 || Math.random() > 0.5) {
         setCurrentWinConfig(thisWinConfig);
         setShowWinMessage(true);
         
         // Play Win Sound
         if (winSound && winAudioRef.current) {
           winAudioRef.current.currentTime = 0;
           winAudioRef.current.play().catch(console.error);
         }
         
         setTimeout(() => setShowWinMessage(false), 2000);
      }

      // Check if that was the last play
      if (currentSpins - 1 === 0) {
        setTimeout(() => {
          setShowEndCard(true);
        }, 2500); // Wait for win animation
      }
    }, totalTime);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (answerState !== 'idle') return;
    
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === quizQuestions[currentQuestionIndex].correct;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      // Play Win Sound for correct answer
      if (winSound && winAudioRef.current) {
         winAudioRef.current.currentTime = 0;
         winAudioRef.current.play().catch(console.error);
      }
    }

    // Move to next question or end
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswerState('idle');
      } else {
        // Quiz finished
        setShowEndCard(true);
        setEndCardHeadline(isCorrect ? "PERFECT SCORE!" : "GREAT EFFORT!");
        setEndCardSubtext(`You got ${quizScore + (isCorrect ? 1 : 0)}/${quizQuestions.length} correct!`);
      }
    }, 1500);
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
        accept={['music', 'spinSound', 'winSound'].includes(uploadTarget?.type || '') ? "audio/*" : "image/*"}
        onChange={handleFileUpload}
      />
      
      {/* Background Music Player */}
      {backgroundMusic && (
        <audio 
          ref={(audio) => {
            if (audio) {
              audio.volume = 0.5;
              if (isPlaying) {
                audio.play().catch(e => console.log("Audio play failed:", e));
              } else {
                audio.pause();
                audio.currentTime = 0;
              }
            }
          }}
          src={backgroundMusic} 
          loop 
        />
      )}

      {/* SFX Players (Hidden) */}
      <audio 
        ref={spinAudioRef}
        src={spinSound || undefined} 
        preload="auto"
      />
      <audio 
        ref={winAudioRef}
        src={winSound || undefined} 
        preload="auto"
      />

      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Configuration</h3>
          <p className="text-xs text-muted-foreground capitalize">Mode: {editorMode}</p>
        </div>
        
        <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col relative">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-6 h-auto py-1">
              <TabsTrigger value="playables" className="px-1"><Gamepad2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="assets" className="px-1"><Layers className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="game" className="px-1">
                {editorMode === 'wheel' ? <Disc className="h-4 w-4" /> : 
                 editorMode === 'scratch' ? <Sparkles className="h-4 w-4" /> : 
                 editorMode === 'pick' ? <Gift className="h-4 w-4" /> :
                 editorMode === 'match' ? <Grid3X3 className="h-4 w-4" /> :
                 editorMode === 'fall' ? <ArrowDown className="h-4 w-4" /> :
                 <Dices className="h-4 w-4" />}
              </TabsTrigger>
              <TabsTrigger value="text" className="px-1"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="elements" className="px-1"><LayoutTemplate className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="endcard" className="px-1"><Trophy className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </div>

          {/* Scroll to Bottom Button */}
          <div className="absolute bottom-6 right-6 z-20">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 rounded-full shadow-lg opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 pb-40 custom-scrollbar scroll-smooth" ref={scrollContainerRef}>
            <TabsContent value="playables" className="mt-0 space-y-6">
              
              {/* Mechanics Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Game Mechanics</h3>
                </div>
                
                <div className="space-y-6">
                  {mechanicCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <category.icon className="h-4 w-4" />
                         <span className="text-xs font-bold uppercase">{category.name}</span>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-2 pl-2 border-l-2 border-border/50">
                         {category.templates.map((template) => (
                           <div 
                             key={template.id}
                             onClick={() => applyMechanic(template)}
                             className="p-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-muted/50 cursor-pointer transition-all group"
                           >
                             {/* Mini Preview showing mechanic over current background */}
                             <div className="relative w-full h-24 rounded-md overflow-hidden mb-3 border border-border/50 shadow-sm group-hover:shadow-md transition-shadow">
                               {/* Background Layer - Uses current uploaded background */}
                               <img 
                                 src={background} 
                                 alt="preview" 
                                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                               />
                               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                               
                               {/* Mechanic Overlay Visuals */}
                               <div className="absolute inset-0 flex items-center justify-center">
                                  {/* Different visuals based on category & template */}
                                  {category.id === 'spin-based' && (
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                          <div key={i} className="w-5 h-8 bg-white/90 rounded-sm border border-gray-300 flex items-center justify-center text-[10px] overflow-hidden p-0.5 shadow-sm">
                                            {template.id === 'spin-3-tease' && i === 3 ? (
                                              <span className="text-muted-foreground opacity-50 text-[8px]">❌</span>
                                            ) : (
                                              <img src={customSymbols[0]} className="w-full h-full object-contain" alt="sym" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {template.id === 'spin-mega' && (
                                        <div className="w-16 h-1 bg-black/50 rounded-full overflow-hidden mt-1">
                                          <div className="h-full w-2/3 bg-yellow-400" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {category.id === 'bonus-round' && (
                                    <>
                                      {template.id === 'pick-chest' && (
                                        <div className="flex gap-2">
                                          {[1, 2, 3].map(i => (
                                            <div key={i} className={cn(
                                              "w-6 h-5 rounded-sm border shadow-sm flex items-center justify-center overflow-hidden transition-all duration-500",
                                              i === 2 ? "bg-white border-yellow-400 scale-110" : "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-200"
                                            )}>
                                              {i === 2 ? (
                                                <img src={customSymbols[1] || customSymbols[0]} className="w-4 h-4 object-contain animate-bounce" />
                                              ) : (
                                                <span className="text-[8px] font-bold text-yellow-900">?</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {template.id === 'tap-reveal' && (
                                        <div className="grid grid-cols-2 gap-1">
                                          {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-6 h-6 bg-gray-300 rounded-sm border-dashed border border-gray-400 relative overflow-hidden flex items-center justify-center">
                                               {i === 1 ? (
                                                 <img src={customSymbols[2] || customSymbols[0]} className="w-4 h-4 object-contain drop-shadow-sm" />
                                               ) : (
                                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/foil.png')] opacity-30" />
                                               )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {template.id === 'timed-bonus' && (
                                        <div className="relative">
                                          <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
                                            <img src={customSymbols[0]} className="absolute opacity-20 w-full h-full object-cover" />
                                            <span className="text-white font-mono font-bold text-xs animate-pulse relative z-10">0:10</span>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {category.id === 'match-mechanics' && (
                                    <div className="flex flex-col gap-1 items-center">
                                      <div className="grid grid-cols-3 gap-0.5 opacity-90 bg-black/20 p-0.5 rounded-sm">
                                        {[...Array(9)].map((_, i) => (
                                          <div 
                                            key={i} 
                                            className={cn("w-2.5 h-2.5 rounded-[1px] shadow-sm flex items-center justify-center overflow-hidden bg-white/10", 
                                              template.id === 'match-3' && [0, 1, 2].includes(i) ? "ring-1 ring-yellow-400 animate-pulse" : ""
                                            )} 
                                          >
                                            <img 
                                              src={customSymbols[i % Math.min(3, customSymbols.length)]} 
                                              className="w-full h-full object-contain" 
                                              alt="match"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      {template.id === 'match-progressive' && (
                                         <div className="w-10 h-1 bg-green-900 rounded-full overflow-hidden">
                                           <div className="h-full w-1/2 bg-green-400" />
                                         </div>
                                      )}
                                    </div>
                                  )}

                                  {category.id === 'tap-collect' && (
                                    <>
                                      {template.id === 'tap-falling' ? (
                                        <div className="relative w-full h-full overflow-hidden">
                                           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 animate-bounce">
                                              <img src={customSymbols[0]} className="w-full h-full object-contain drop-shadow-md" />
                                           </div>
                                           <div className="w-8 h-8 rounded-full border-2 border-white absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/20" />
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/20">
                                           <img src={customSymbols[1] || customSymbols[0]} className="w-3 h-3 object-contain" />
                                           <span className="text-[8px] text-white font-bold">2/5</span>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {category.id === 'hybrid' && (
                                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-md">
                                       {template.id === 'match-spin' ? (
                                         <>
                                            <Grid3X3 className="w-3 h-3 text-white" />
                                            <span className="text-white text-[8px]">→</span>
                                            <Disc className="w-3 h-3 text-white" />
                                         </>
                                       ) : (
                                         <>
                                            <Disc className="w-3 h-3 text-white" />
                                            <span className="text-white text-[8px]">→</span>
                                            <Gift className="w-3 h-3 text-white" />
                                         </>
                                       )}
                                    </div>
                                  )}
                                  
                                  {/* Icon Overlay as Fallback/Accent */}
                                  <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full backdrop-blur-sm">
                                    <template.icon className="h-3 w-3 text-white" />
                                  </div>
                               </div>
                             </div>

                             <div className="flex gap-3 items-start">
                               <div>
                                 <h4 className="text-sm font-bold leading-none mb-1 group-hover:text-primary transition-colors">{template.name}</h4>
                                 <p className="text-[10px] text-muted-foreground mb-2 leading-snug">{template.description}</p>
                                 <div className="flex flex-wrap gap-1">
                                   {template.features.slice(0, 2).map((feature, i) => (
                                     <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-medium border border-border">
                                       {feature}
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Themes Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Visual Themes</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <div 
                      key={theme.id}
                      onClick={() => applyTheme(theme)}
                      className="p-3 rounded-lg border border-border bg-card hover:border-primary cursor-pointer transition-all group flex flex-col gap-2 items-center text-center"
                    >
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: theme.color }}
                      >
                        <theme.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold">{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </TabsContent>

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
                <label className="text-sm font-medium">Jackpot Settings</label>
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Jackpot Tiers</label>
                      {jackpots.slice(0, jackpotCount).map((jackpot, index) => (
                      <div key={index} className="grid grid-cols-[1fr_1.5fr_auto] gap-2 items-center">
                          <input 
                             type="text" 
                             value={jackpot.label}
                             onChange={(e) => {
                               const newJackpots = [...jackpots];
                               newJackpots[index].label = e.target.value;
                               setJackpots(newJackpots);
                             }}
                             placeholder="Label"
                             className="h-8 px-2 text-xs rounded-md border border-input bg-background font-bold uppercase w-full"
                          />
                          <input 
                             type="text" 
                             value={jackpot.value}
                             onChange={(e) => {
                               const newJackpots = [...jackpots];
                               newJackpots[index].value = e.target.value;
                               setJackpots(newJackpots);
                             }}
                             placeholder="Value"
                             className="h-8 px-2 text-xs rounded-md border border-input bg-background w-full"
                          />
                          <Button 
                             variant="outline" 
                             size="icon" 
                             className="h-8 w-8 shrink-0 relative overflow-hidden group"
                             onClick={() => triggerUpload({ type: 'jackpotBorder', index })}
                             title="Upload Border Image"
                          >
                             {jackpot.border ? (
                               <img src={jackpot.border} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                             ) : (
                               <ImageIcon className="h-4 w-4 text-muted-foreground" />
                             )}
                          </Button>
                        </div>
                      ))}
                   </div>
                   
                   <div className="space-y-1 pt-2">
                       <div className="flex justify-between items-center">
                         <label className="text-xs font-medium text-muted-foreground">Jackpot Count</label>
                         <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{jackpotCount}</span>
                       </div>
                       <input 
                         type="range" 
                         min="1" max="5" 
                         value={jackpotCount}
                         onChange={(e) => setJackpotCount(parseInt(e.target.value))}
                         className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                       />
                   </div>

                   <div className="space-y-1 pt-2">
                       <div className="flex justify-between items-center">
                         <label className="text-xs font-medium text-muted-foreground">Text Size</label>
                         <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{jackpotFontSize}px</span>
                       </div>
                       <input 
                         type="range" 
                         min="10" max="32" 
                         value={jackpotFontSize}
                         onChange={(e) => setJackpotFontSize(parseInt(e.target.value))}
                         className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                       />
                   </div>

                   <div className="space-y-1 pt-2">
                       <label className="text-xs font-medium text-muted-foreground">Layout Style</label>
                       <div className="grid grid-cols-2 gap-2 mt-1">
                          <Button 
                            variant={jackpotLayout === 'row' ? 'default' : 'outline'} 
                            size="sm" 
                            className="text-xs h-8" 
                            onClick={() => setJackpotLayout('row')}
                          >
                            <Layers className="h-3 w-3 mr-1" /> Row
                          </Button>
                          <Button 
                            variant={jackpotLayout === 'distributed' ? 'default' : 'outline'} 
                            size="sm" 
                            className="text-xs h-8" 
                            onClick={() => setJackpotLayout('distributed')}
                          >
                            <LayoutTemplate className="h-3 w-3 mr-1" /> Distributed
                          </Button>
                       </div>
                   </div>
                </div>
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

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center justify-between">
                  Background Music
                  {backgroundMusic && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-destructive hover:text-destructive"
                      onClick={() => setBackgroundMusic(null)}
                    >
                      Remove
                    </Button>
                  )}
                </label>
                
                {!backgroundMusic ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed"
                    onClick={() => triggerUpload({ type: 'music' })}
                  >
                    <Music className="h-4 w-4 mr-2" /> Upload Audio
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                     <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                       <Music className="h-4 w-4 text-primary" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs font-medium truncate">Music Track</p>
                       <p className="text-[10px] text-muted-foreground">Ready to play</p>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-8 w-8"
                       onClick={() => triggerUpload({ type: 'music' })}
                     >
                       <RotateCcw className="h-4 w-4" />
                     </Button>
                  </div>
                )}
                
                {getAssetsByType('music').length > 0 && (
                  <div className="space-y-2 mt-2">
                    <label className="text-xs text-muted-foreground">Library</label>
                    <div className="flex flex-col gap-2">
                      {getAssetsByType('music').map(asset => (
                        <div 
                          key={asset.id} 
                          className={cn(
                            "flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors",
                            backgroundMusic === asset.previewUrl ? "border-primary bg-primary/5" : "border-border"
                          )}
                          onClick={() => setBackgroundMusic(asset.previewUrl)}
                        >
                          <Music className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs truncate flex-1">{asset.name}</span>
                          {backgroundMusic === asset.previewUrl && <Check className="h-3 w-3 text-primary" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Effects Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Sound Effects</label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Spin Sound */}
                  <div className="p-2 border rounded-md bg-muted/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium">Spin Sound</label>
                      {spinSound && (
                        <Button 
                          variant="ghost" size="icon" className="h-4 w-4 text-destructive"
                          onClick={() => setSpinSound(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {!spinSound ? (
                      <Button 
                        variant="outline" size="sm" className="w-full text-xs h-8 border-dashed"
                        onClick={() => triggerUpload({ type: 'spinSound' })}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 bg-background p-1.5 rounded border">
                        <Music className="h-3 w-3 text-primary" />
                        <span className="text-[10px] truncate flex-1">Spin.mp3</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => triggerUpload({ type: 'spinSound' })}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Win Sound */}
                  <div className="p-2 border rounded-md bg-muted/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium">Win Sound</label>
                      {winSound && (
                        <Button 
                          variant="ghost" size="icon" className="h-4 w-4 text-destructive"
                          onClick={() => setWinSound(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {!winSound ? (
                      <Button 
                        variant="outline" size="sm" className="w-full text-xs h-8 border-dashed"
                        onClick={() => triggerUpload({ type: 'winSound' })}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 bg-background p-1.5 rounded border">
                        <Music className="h-3 w-3 text-primary" />
                        <span className="text-[10px] truncate flex-1">Win.mp3</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => triggerUpload({ type: 'winSound' })}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
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


                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border mt-3">
                    <label className="text-xs font-medium text-muted-foreground">Win Frame (Big Win)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant={winBorder === null ? 'default' : 'outline'} 
                            size="sm" 
                            className="text-xs justify-start h-8" 
                            onClick={() => setWinBorder(null)}
                        >
                            <X className="h-3 w-3 mr-2" /> None
                        </Button>
                        {jackpots.filter(j => j.border).map((j, i) => (
                             <Button 
                                key={i}
                                variant={winBorder === j.border ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs justify-start h-8 relative overflow-hidden" 
                                onClick={() => setWinBorder(j.border || null)}
                            >
                                <div className="absolute inset-0 opacity-20">
                                    <img src={j.border} className="w-full h-full object-cover" />
                                </div>
                                <span className="relative z-10 truncate pl-1">{j.label} Border</span>
                            </Button>
                        ))}
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

                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border mt-4">
                       <label className="text-xs font-medium text-muted-foreground">Board Dimensions</label>
                       
                       {/* Scale Slider */}
                       <div className="space-y-1">
                          <div className="flex justify-between">
                            <label className="text-[10px] text-muted-foreground">Board Scale</label>
                            <span className="text-[10px] font-mono">{boardScale}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="50" max="100" 
                            value={boardScale}
                            onChange={(e) => setBoardScale(parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                       </div>

                       {/* Aspect Ratio Select */}
                       <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Aspect Ratio</label>
                          <div className="grid grid-cols-4 gap-1">
                             {['auto', 'portrait', 'square', 'landscape'].map((ratio) => (
                               <Button
                                 key={ratio}
                                 variant={boardAspectRatio === ratio ? 'default' : 'outline'}
                                 size="sm"
                                 className="text-[10px] h-7 px-1 capitalize"
                                 onClick={() => setBoardAspectRatio(ratio as any)}
                               >
                                 {ratio === 'auto' ? 'Auto' : ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                               </Button>
                             ))}
                          </div>
                       </div>
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
                              onClick={() => triggerUpload({ type: 'gridCell' })}
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
                            onClick={() => triggerUpload({ type: 'symbol' })}
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
                  <div className="mt-4 space-y-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Disc className="h-4 w-4" /> Wheel Segments
                    </label>
                    <p className="text-xs text-muted-foreground">Customize colors and labels for your wheel.</p>
                    
                    <div className="space-y-2">
                      {jackpots.map((jackpot, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
                          <div 
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm shrink-0"
                            style={{ backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 6] }}
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={jackpot.label}
                              onChange={(e) => {
                                const newJackpots = [...jackpots];
                                newJackpots[index].label = e.target.value;
                                setJackpots(newJackpots);
                              }}
                              className="w-full h-7 px-2 text-xs rounded border border-input bg-background font-bold"
                              placeholder="Label (e.g. WIN)"
                            />
                            <input
                              type="text"
                              value={jackpot.value}
                              onChange={(e) => {
                                const newJackpots = [...jackpots];
                                newJackpots[index].value = e.target.value;
                                setJackpots(newJackpots);
                              }}
                              className="w-full h-7 px-2 text-xs rounded border border-input bg-background"
                              placeholder="Value (e.g. $500)"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const newJackpots = jackpots.filter((_, i) => i !== index);
                              setJackpots(newJackpots);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed"
                        onClick={() => setJackpots([...jackpots, { label: "NEW PRIZE", value: "$100" }])}
                      >
                        <Plus className="h-3 w-3 mr-2" /> Add Segment
                      </Button>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg flex justify-center">
                        <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden animate-in zoom-in duration-500">
                          {/* Simplified CSS Conic Gradient approximation for preview */}
                           <div 
                             className="absolute inset-0"
                             style={{
                               background: `conic-gradient(${
                                 jackpots.map((_, i) => {
                                   const color = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i % 6];
                                   const start = (i / jackpots.length) * 100;
                                   const end = ((i + 1) / jackpots.length) * 100;
                                   return `${color} ${start}% ${end}%`;
                                 }).join(', ')
                               })`
                             }}
                           />
                           <div className="absolute inset-0 flex items-center justify-center">
                             <div className="h-8 w-8 bg-white rounded-full shadow-lg z-10" />
                           </div>
                        </div>
                    </div>
                  </div>
                )}

                {editorMode === 'quiz' && (
                  <div className="mt-4 space-y-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" /> Quiz Questions
                    </label>
                    <p className="text-xs text-muted-foreground">Configure your questions and answers.</p>

                    <div className="space-y-4">
                      {quizQuestions.map((q, qIdx) => (
                        <div key={q.id} className="p-3 border rounded-lg bg-card space-y-3">
                           <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-muted-foreground">Question {qIdx + 1}</span>
                             {quizQuestions.length > 1 && (
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-5 w-5 text-destructive"
                                 onClick={() => {
                                   const newQ = [...quizQuestions];
                                   newQ.splice(qIdx, 1);
                                   setQuizQuestions(newQ);
                                 }}
                               >
                                 <X className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={q.question}
                             onChange={(e) => {
                               const newQ = [...quizQuestions];
                               newQ[qIdx].question = e.target.value;
                               setQuizQuestions(newQ);
                             }}
                             className="w-full h-8 px-2 text-xs rounded border border-input bg-background font-medium"
                             placeholder="Enter question..."
                           />
                           
                           <div className="space-y-2 pl-2 border-l-2 border-border/50">
                             {q.options.map((opt, optIdx) => (
                               <div key={optIdx} className="flex items-center gap-2">
                                  <div 
                                    className={cn(
                                      "w-4 h-4 rounded-full border cursor-pointer flex items-center justify-center",
                                      q.correct === optIdx ? "bg-green-500 border-green-600" : "bg-muted border-input"
                                    )}
                                    onClick={() => {
                                      const newQ = [...quizQuestions];
                                      newQ[qIdx].correct = optIdx;
                                      setQuizQuestions(newQ);
                                    }}
                                  >
                                    {q.correct === optIdx && <Check className="h-2 w-2 text-white" />}
                                  </div>
                                  <input 
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const newQ = [...quizQuestions];
                                      newQ[qIdx].options[optIdx] = e.target.value;
                                      setQuizQuestions(newQ);
                                    }}
                                    className="flex-1 h-7 px-2 text-xs rounded border border-input bg-background"
                                    placeholder={`Option ${optIdx + 1}`}
                                  />
                               </div>
                             ))}
                           </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-dashed"
                        onClick={() => setQuizQuestions([...quizQuestions, { 
                          id: Date.now(), 
                          question: "New Question?", 
                          options: ["Option A", "Option B", "Option C", "Option D"], 
                          correct: 0 
                        }])}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Question
                      </Button>
                    </div>
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

              {/* Win Configuration Selector */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Win Configuration</label>
                    <div className="flex bg-muted rounded-md p-1 gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                            <button
                                key={i}
                                onClick={() => setActiveConfigIndex(i)}
                                className={cn(
                                    "px-2.5 py-1 text-xs rounded font-medium transition-all",
                                    activeConfigIndex === i 
                                        ? "bg-background text-primary shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Spin {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Win Message (Spin {activeConfigIndex + 1})</label>
                        <input 
                          type="text" 
                          value={winConfigs[activeConfigIndex]?.text || ''}
                          onChange={(e) => {
                              const newConfigs = [...winConfigs];
                              newConfigs[activeConfigIndex] = { ...newConfigs[activeConfigIndex], text: e.target.value };
                              setWinConfigs(newConfigs);
                          }}
                          className="w-full h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-bold uppercase text-sm"
                        />
                    </div>
                </div>
              </div>

              {/* Win Animation Settings */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Celebration Style
                </label>
                <p className="text-xs text-muted-foreground">Animation for Spin {activeConfigIndex + 1} win.</p>
                
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {[
                        { id: 'coins', icon: Coins, label: 'Coins' },
                        { id: 'confetti', icon: PartyPopper, label: 'Confetti' },
                        { id: 'pulse', icon: Activity, label: 'Pulse' },
                        { id: 'flash', icon: Zap, label: 'Flash' },
                        { id: 'money-rain', icon: CloudRain, label: 'Money Rain' },
                        { id: 'lightning', icon: ZapOff, label: 'Lightning' },
                        { id: 'heart-burst', icon: Heart, label: 'Heart Burst' },
                        { id: 'starfall', icon: Star, label: 'Starfall' },
                        { id: 'glitch', icon: Activity, label: 'Glitch' },
                        { id: 'neon-glow', icon: Lightbulb, label: 'Neon Glow' },
                        { id: 'spotlight', icon: Aperture, label: 'Spotlight' },
                        { id: 'disco-ball', icon: Disc, label: 'Disco Ball' },
                        { id: 'snowfall', icon: Snowflake, label: 'Snowfall' },
                        { id: 'fire', icon: Flame, label: 'Fire' },
                        { id: 'bubbles', icon: Droplets, label: 'Bubbles' },
                        { id: 'laser-beams', icon: Zap, label: 'Lasers' },
                        { id: 'ribbon', icon: Ribbon, label: 'Ribbon' },
                        { id: 'shockwave', icon: Waves, label: 'Shockwave' },
                        { id: 'magic', icon: Wand2, label: 'Magic' }
                    ].map((anim) => (
                        <Button 
                            key={anim.id}
                            variant={winConfigs[activeConfigIndex]?.animation === anim.id ? 'default' : 'outline'} 
                            size="sm" 
                            className="text-xs justify-start h-8" 
                            onClick={() => {
                                const newConfigs = [...winConfigs];
                                newConfigs[activeConfigIndex] = { ...newConfigs[activeConfigIndex], animation: anim.id };
                                setWinConfigs(newConfigs);
                            }}
                        >
                            <anim.icon className="h-3 w-3 mr-2" /> {anim.label}
                        </Button>
                    ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
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
                        onClick={() => triggerUpload({ type: 'endCardBg' })}
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
                         onClick={() => triggerUpload({ type: 'endCardImage' })}
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
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2 relative w-full">
                  {/* (Old Win Message Overlay removed - now handled by global AnimatePresence above) */}

                  {/* Jackpot Counter */}
                  {visibleElements.jackpot && (
                    <div className={cn("w-full px-4 z-20 transition-all duration-300", 
                      jackpotLayout === 'distributed' ? "flex flex-col gap-2 w-full mb-2" : "flex flex-row gap-2 justify-center flex-wrap"
                    )}>
                       {jackpotLayout === 'row' ? (
                         // Row Layout (Original)
                         jackpots.slice(0, jackpotCount).map((jackpot, idx) => (
                             <div key={idx} className={cn("flex-1 min-w-[80px] bg-black/60 backdrop-blur-sm border border-yellow-500/30 px-2 py-2 rounded-lg shadow-[0_0_20px_rgba(255,165,0,0.3)] animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col items-center justify-center relative overflow-visible", jackpot.border ? "border-none bg-transparent shadow-none" : "")} style={{ animationDelay: `${idx * 100}ms` }}>
                                {jackpot.border && (
                                  <div className="absolute inset-[-4px] z-0 pointer-events-none">
                                    <img src={jackpot.border} className="w-full h-full object-fill" />
                                  </div>
                                )}
                                <span className={cn("text-yellow-200 font-display font-bold text-[10px] uppercase tracking-wider mb-0.5 opacity-80 z-10", jackpot.border ? "drop-shadow-md text-white" : "")}>{jackpot.label}</span>
                                <span 
                                  className="text-yellow-400 font-display font-black tracking-widest drop-shadow-md leading-none whitespace-nowrap"
                                  style={{ fontSize: `${jackpotFontSize}px` }}
                                >
                                  {jackpot.value}
                                </span>
                              </div>
                         ))
                       ) : (
                         // Distributed Layout (Refactored to sit ABOVE gameplay)
                         <div className="w-full flex flex-col gap-6">
                           {/* Grand Jackpot (Always Top) */}
                           {jackpots.length > 0 && jackpotCount >= 1 && (
                             <div className={cn("w-full h-20 relative bg-black/80 backdrop-blur-md border-4 border-yellow-400 rounded-xl shadow-[0_0_50px_rgba(255,215,0,0.6)] flex flex-col items-center justify-center animate-in zoom-in duration-500 overflow-visible", jackpots[0].border ? "bg-transparent border-none shadow-none" : "")}>
                                {/* Border Image Overlay */}
                                {jackpots[0].border && (
                                  <div className="absolute inset-[-6px] z-0 pointer-events-none">
                                    <img src={jackpots[0].border} className="w-full h-full object-fill" />
                                  </div>
                                )}
                                
                                {/* Industrial Stripes (Only if no border) */}
                                {!jackpots[0].border && (
                                  <>
                                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-50 border-r border-yellow-500/30" />
                                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-50 border-l border-yellow-500/30" />
                                  </>
                                )}
                                
                                <span className="font-display font-black uppercase tracking-widest opacity-90 z-10 text-red-500 text-lg drop-shadow-[0_2px_0_rgba(0,0,0,1)] stroke-black">
                                  {jackpots[0].label}
                                </span>
                                <span className="font-display font-black tracking-widest drop-shadow-lg leading-none whitespace-nowrap z-10 text-gradient bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 via-yellow-100 to-yellow-500 text-4xl drop-shadow-[0_4px_0_rgba(0,0,0,0.8)]">
                                  {jackpots[0].value}
                                </span>
                             </div>
                           )}

                           {/* Secondary Jackpots Grid */}
                           {jackpotCount > 1 && (
                             <div className="flex flex-wrap justify-between gap-3 w-full">
                               {jackpots.slice(1, jackpotCount).map((jackpot, idx) => (
                                 <div 
                                   key={idx + 1}
                                   className={cn("relative bg-black/80 backdrop-blur-md border-2 border-yellow-500/50 rounded-xl shadow-[0_0_30px_rgba(255,165,0,0.4)] flex flex-col items-center justify-center animate-in zoom-in duration-500 h-16 overflow-visible flex-1 min-w-[40%]", jackpot.border ? "bg-transparent border-none shadow-none" : "")}
                                   style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                                 >
                                    {jackpot.border && (
                                      <div className="absolute inset-[-4px] z-0 pointer-events-none">
                                        <img src={jackpot.border} className="w-full h-full object-fill" />
                                      </div>
                                    )}
                                    <span className="font-display font-black uppercase tracking-widest opacity-90 z-10 text-yellow-200 text-[10px]">
                                      {jackpot.label}
                                    </span>
                                    <span 
                                      className="font-display font-black tracking-widest drop-shadow-lg leading-none whitespace-nowrap z-10 text-gradient bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 via-yellow-100 to-yellow-500"
                                      style={{ fontSize: `${jackpotFontSize}px` }}
                                    >
                                      {jackpot.value}
                                    </span>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                  )}

                  {/* === MODE: SLOTS === */}
                  {editorMode === 'slots' && (
                    <div 
                      className={cn(
                        "bg-gradient-to-b from-purple-900 to-black rounded-lg border-4 border-yellow-600/50 relative shadow-2xl overflow-hidden p-1 transition-all duration-300",
                        boardAspectRatio === 'auto' ? (slotRows >= 3 ? "aspect-[3/4]" : "aspect-[4/3]") : "",
                        boardAspectRatio === 'portrait' ? "aspect-[3/4]" : "",
                        boardAspectRatio === 'landscape' ? "aspect-[4/3]" : "",
                        boardAspectRatio === 'square' ? "aspect-square" : ""
                      )}
                      style={{ width: `${boardScale}%` }}
                    >
                      {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
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
                               // Spinning state (loops)
                               reelsSpinning[colIndex] && (templateConfig.animation === 'spin' || !templateConfig.animation) && "animate-spin-reel",
                               // Stopped state (landing animation)
                               !reelsSpinning[colIndex] && isReelSpinning && "animate-spin-stop",
                               
                               isReelSpinning && templateConfig.animation === 'bounce' && "animate-bounce-spin",
                               isReelSpinning && templateConfig.animation === 'cascade' && "animate-cascade",
                               isReelSpinning && templateConfig.animation === 'fade' && "animate-fade-reveal",
                               isReelSpinning && templateConfig.animation === 'shake' && "animate-shake"
                             )}
                             style={{ animationDelay: reelsSpinning[colIndex] ? `${colIndex * 100}ms` : '0ms' }}
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
                                         reelsSpinning[colIndex] && (templateConfig.animation === 'spin' || !templateConfig.animation) && "blur-[2px]",
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
                    <div className="w-[98%] aspect-square relative flex items-center justify-center">
                      {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
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
                    <div className="w-[98%] aspect-[3/4] bg-white rounded-xl shadow-2xl p-1 relative overflow-hidden">
                      {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
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

                  {/* === MODE: PICK === */}
                  {editorMode === 'pick' && (
                    <div className="w-[98%] aspect-[3/4] bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl shadow-2xl p-4 relative overflow-hidden flex flex-col items-center justify-center gap-4">
                       {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-md">PICK A CHEST</h3>
                        <p className="text-xs text-white/70">Find the hidden treasure!</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 w-full max-w-[200px]">
                         {[1, 2, 3].map((i) => (
                           <motion.div 
                             key={i}
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => !isReelSpinning && handleInteraction()}
                             className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-1 shadow-lg cursor-pointer aspect-video flex items-center justify-center relative overflow-hidden group border-2 border-yellow-200"
                           >
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30" />
                             <PackageOpen className="text-yellow-900 w-12 h-12 relative z-10 drop-shadow-md group-hover:animate-bounce" />
                             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </motion.div>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* === MODE: MATCH === */}
                  {editorMode === 'match' && (
                    <div className="w-[98%] aspect-[3/4] bg-slate-900 rounded-xl shadow-2xl p-2 relative overflow-hidden flex flex-col items-center justify-center">
                       {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
                      <div className="grid grid-cols-5 gap-1 w-full p-2 bg-black/30 rounded-lg">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <motion.div
                            key={i}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => !isReelSpinning && handleInteraction()}
                            className={cn(
                              "aspect-square rounded-sm flex items-center justify-center shadow-sm cursor-pointer border border-white/10",
                              ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"][Math.floor(Math.random() * 5)]
                            )}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-sm" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* === MODE: FALL === */}
                  {editorMode === 'fall' && (
                    <div className="w-[98%] aspect-[3/4] bg-sky-900 rounded-xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-end pb-10">
                       {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
                      <div className="absolute inset-0 pointer-events-none">
                         {[...Array(15)].map((_, i) => (
                           <motion.div
                             key={i}
                             initial={{ y: -50, x: Math.random() * 300 }}
                             animate={{ y: 800 }}
                             transition={{ 
                               duration: 2 + Math.random() * 2, 
                               repeat: Infinity, 
                               ease: "linear",
                               delay: Math.random() * 2
                             }}
                             className="absolute"
                             onClick={() => !isReelSpinning && handleInteraction()} 
                           >
                              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-200 shadow-md flex items-center justify-center">
                                <span className="text-[10px] font-bold text-yellow-800">$</span>
                              </div>
                           </motion.div>
                         ))}
                      </div>
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/50 flex items-center justify-center z-10 cursor-pointer active:scale-95 transition-transform" onClick={handleInteraction}>
                         <ArrowDown className="w-10 h-10 text-white animate-bounce" />
                      </div>
                      <p className="text-white font-bold mt-4 z-10">TAP TO CATCH!</p>
                    </div>
                  )}

                  {/* === MODE: QUIZ === */}
                  {editorMode === 'quiz' && (
                    <div className="w-[98%] aspect-[3/4] bg-white rounded-xl shadow-2xl relative overflow-hidden flex flex-col p-6">
                      {/* Win Border Filter */}
                      {showWinMessage && winBorder && (
                        <div className="absolute inset-0 z-50 pointer-events-none animate-pulse">
                          <img src={winBorder} className="w-full h-full object-fill" />
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                        />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className="space-y-2 text-center">
                           <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                             Question {currentQuestionIndex + 1} of {quizQuestions.length}
                           </span>
                           <h3 className="text-xl font-bold text-slate-800 leading-tight">
                             {quizQuestions[currentQuestionIndex].question}
                           </h3>
                        </div>

                        <div className="w-full space-y-3">
                          {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              disabled={answerState !== 'idle'}
                              className={cn(
                                "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 relative overflow-hidden group",
                                answerState === 'idle' 
                                  ? "border-slate-100 bg-slate-50 hover:border-primary/50 hover:bg-white hover:shadow-md" 
                                  : answerState === 'correct' && idx === quizQuestions[currentQuestionIndex].correct
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : answerState === 'wrong' && selectedAnswer === idx
                                      ? "border-red-500 bg-red-50 text-red-700"
                                      : "border-slate-100 bg-slate-50 opacity-50"
                              )}
                            >
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-semibold">{option}</span>
                                {answerState !== 'idle' && idx === quizQuestions[currentQuestionIndex].correct && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 animate-in zoom-in" />
                                )}
                                {answerState === 'wrong' && selectedAnswer === idx && (
                                  <XCircle className="h-5 w-5 text-red-600 animate-in zoom-in" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
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
        {/* Win Animation Overlay */}
        <AnimatePresence>
            {showWinMessage && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                    {/* Background Dim - Optional */}
                    {/* <div className="absolute inset-0 bg-black/20" /> */}

                    {/* Flash Effect */}
                    {currentWinConfig.animation === 'flash' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white mix-blend-overlay"
                        />
                    )}

                    {/* Coin Shower */}
                    {currentWinConfig.animation === 'coins' && (
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
                    {currentWinConfig.animation === 'confetti' && (
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
                    {currentWinConfig.animation === 'pulse' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: 2 }}
                            className="absolute inset-0 border-8 border-yellow-400 rounded-xl"
                        />
                    )}

                    {/* NEW ANIMATIONS */}
                    
                    {/* Balloons */}
                    {currentWinConfig.animation === 'balloons' && (
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
                    {currentWinConfig.animation === 'money-rain' && (
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
                    {currentWinConfig.animation === 'lightning' && (
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
                    {currentWinConfig.animation === 'heart-burst' && (
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
                    {currentWinConfig.animation === 'starfall' && (
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
                    {currentWinConfig.animation === 'glitch' && (
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
                    {currentWinConfig.animation === 'neon-glow' && (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1, 0.5, 1] }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 border-4 border-pink-500 shadow-[0_0_100px_rgba(236,72,153,0.8),inset_0_0_50px_rgba(236,72,153,0.5)] rounded-xl z-10"
                        />
                    )}

                    {/* Spotlight */}
                    {currentWinConfig.animation === 'spotlight' && (
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
                    {currentWinConfig.animation === 'disco-ball' && (
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
                    {currentWinConfig.animation === 'snowfall' && (
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
                    {currentWinConfig.animation === 'fire' && (
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
                    {currentWinConfig.animation === 'bubbles' && (
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
                    {currentWinConfig.animation === 'laser-beams' && (
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
                    {currentWinConfig.animation === 'ribbon' && (
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
                    {currentWinConfig.animation === 'shockwave' && (
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
                    {currentWinConfig.animation === 'magic' && (
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
                    {currentWinConfig.animation === 'coins' && (
                         <motion.div 
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1.2, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-black/80 text-white font-black text-5xl px-10 py-6 rounded-2xl border-4 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.6)] backdrop-blur-md text-center z-50 relative"
                        >
                            <span className="block text-yellow-400 text-7xl mb-2 filter drop-shadow-lg">{currentWinConfig.text}</span>
                            <span className="text-xl font-bold tracking-widest uppercase text-white/90">You Won!</span>
                        </motion.div>
                    )}

                     {currentWinConfig.animation === 'money-rain' && (
                         <motion.div 
                            initial={{ scale: 0, y: -50 }}
                            animate={{ scale: 1.2, y: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-green-900/90 text-white font-black text-5xl px-12 py-8 rounded-xl border-4 border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.6)] backdrop-blur-md text-center z-50 relative"
                        >
                            <span className="block text-green-300 text-7xl mb-2 filter drop-shadow-lg tracking-tighter">{currentWinConfig.text}</span>
                            <span className="text-xl font-bold tracking-widest uppercase text-white/90 bg-green-600 px-4 py-1 rounded-full">Cash Out!</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'confetti' || currentWinConfig.animation === 'balloons') && (
                         <motion.div 
                            initial={{ scale: 0, rotate: 10 }}
                            animate={{ scale: 1.3, rotate: [-5, 5, -5, 0] }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-white text-blue-600 font-black text-6xl px-8 py-6 rounded-3xl border-8 border-dashed border-pink-400 shadow-2xl text-center z-50 relative transform -rotate-2"
                        >
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-0 filter drop-shadow-sm">{currentWinConfig.text}</span>
                            <span className="text-2xl font-bold tracking-wider text-slate-400 uppercase">Party Time!</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'pulse' || currentWinConfig.animation === 'shockwave') && (
                         <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-transparent text-white font-black text-8xl px-4 py-4 text-center z-50 relative tracking-tighter"
                        >
                            <span className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{currentWinConfig.text}</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'flash' || currentWinConfig.animation === 'lightning' || currentWinConfig.animation === 'laser-beams') && (
                         <motion.div 
                            initial={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 2, opacity: 0, filter: 'blur(20px)' }}
                            className="bg-blue-600/20 text-white font-black text-6xl px-12 py-4 border-y-4 border-blue-400 backdrop-blur-sm text-center z-50 relative w-full"
                        >
                            <span className="block text-cyan-200 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] italic">{currentWinConfig.text}</span>
                        </motion.div>
                    )}
                    
                    {currentWinConfig.animation === 'heart-burst' && (
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-pink-100 text-pink-600 font-black text-6xl px-12 py-8 rounded-full border-8 border-pink-300 shadow-[0_0_50px_rgba(244,114,182,0.6)] text-center z-50 relative"
                        >
                            <span className="block mb-2">❤️ {currentWinConfig.text} ❤️</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'glitch') && (
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, x: [-2, 2, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            exit={{ opacity: 0 }}
                            className="bg-black text-white font-mono font-bold text-6xl px-8 py-4 border border-green-500 shadow-[4px_4px_0_green] text-center z-50 relative"
                        >
                            <span className="block text-green-500 drop-shadow-[2px_0_0_red] tracking-widest">&lt;{currentWinConfig.text}/&gt;</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'neon-glow' || currentWinConfig.animation === 'spotlight' || currentWinConfig.animation === 'disco-ball') && (
                         <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="bg-slate-900/90 text-white font-black text-6xl px-10 py-6 rounded-xl border-2 border-fuchsia-500 shadow-[0_0_30px_fuchsia,inset_0_0_20px_fuchsia] text-center z-50 relative"
                        >
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-200 drop-shadow-[0_0_5px_white]">{currentWinConfig.text}</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'fire') && (
                         <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="text-white font-black text-7xl text-center z-50 relative"
                        >
                            <span className="block text-orange-500 drop-shadow-[0_0_15px_orange] animate-pulse">{currentWinConfig.text}</span>
                            <span className="block text-2xl text-yellow-500 font-bold uppercase tracking-[0.5em] mt-2">Hot Streak!</span>
                        </motion.div>
                    )}

                    {(currentWinConfig.animation === 'snowfall') && (
                         <motion.div 
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/10 text-white font-black text-6xl px-10 py-6 rounded-lg border border-white/50 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center z-50 relative"
                        >
                            <span className="block text-cyan-100 drop-shadow-md">{currentWinConfig.text}</span>
                            <span className="block text-xl text-white/80 font-light tracking-widest mt-2 uppercase">Cool Win</span>
                        </motion.div>
                    )}
                    
                    {(currentWinConfig.animation === 'starfall' || currentWinConfig.animation === 'magic') && (
                         <motion.div 
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-indigo-900/90 text-white font-serif font-bold text-6xl px-12 py-8 rounded-[3rem] border-4 border-indigo-400 shadow-[0_0_60px_indigo] text-center z-50 relative"
                        >
                            <span className="block text-yellow-200 drop-shadow-lg mb-1">✨ {currentWinConfig.text} ✨</span>
                        </motion.div>
                    )}
                    
                    {(currentWinConfig.animation === 'bubbles') && (
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.1 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-blue-400/30 text-white font-black text-6xl h-64 w-64 rounded-full border-4 border-white/40 shadow-[0_0_40px_rgba(59,130,246,0.4)] backdrop-blur-sm flex flex-col items-center justify-center z-50 relative"
                        >
                            <span className="block text-white drop-shadow-lg">{currentWinConfig.text}</span>
                        </motion.div>
                    )}
                    
                    {(currentWinConfig.animation === 'ribbon') && (
                         <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            className="bg-red-600 text-white font-serif font-bold text-5xl px-20 py-4 shadow-xl text-center z-50 relative"
                            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)' }}
                        >
                            <span className="block text-yellow-300 drop-shadow-md tracking-widest">{currentWinConfig.text}</span>
                        </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}