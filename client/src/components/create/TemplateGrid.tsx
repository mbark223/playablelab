import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAssets } from '@/lib/AssetContext';

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';
import puzzleImg from '@assets/generated_images/match-3_puzzle_game_screenshot.png';
import quizImg from '@assets/generated_images/interactive_quiz_interface.png';
import racingImg from '@assets/generated_images/car_racing_game_screenshot.png';
import slotsBg from '@assets/generated_images/casino_slot_machine_background.png';
import egyptianImg from '@assets/generated_images/egyptian_slots_game.png';
import greekImg from '@assets/generated_images/greek_mythology_slots.png';
import wildWestImg from '@assets/generated_images/wild_west_slots.png';
import oceanImg from '@assets/generated_images/ocean_slots.png';
import spaceImg from '@assets/generated_images/space_sci-fi_slots.png';
import fruitImg from '@assets/generated_images/fruit_party_slots.png';
import rouletteImg from '@assets/generated_images/luxury_roulette.png';
import blackjackImg from '@assets/generated_images/blackjack_table.png';
import pokerImg from '@assets/generated_images/poker_tournament.png';
import wheelImg from '@assets/generated_images/wheel_of_fortune.png';
import scratchImg from '@assets/generated_images/scratch_card_game.png';
import plinkoImg from '@assets/generated_images/plinko_game.png';
import baccaratImg from '@assets/generated_images/baccarat_table.png';
import crapsImg from '@assets/generated_images/craps_dice_game.png';
import kenoImg from '@assets/generated_images/keno_lottery.png';

interface TemplateGridProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const templates = [
  {
    id: 'slots',
    title: 'Jackpot Slots',
    description: 'Auto-populated with your high-value symbols.',
    image: slotsBg,
    category: 'Casino',
    compatibility: ['logo', 'symbol', 'background']
  },
  {
    id: 'egyptian-slots',
    title: 'Pharaoh\'s Riches',
    description: 'Mysterious Egyptian theme with expanding wilds.',
    image: egyptianImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol']
  },
  {
    id: 'greek-slots',
    title: 'Zeus Thunder',
    description: 'Epic mythology theme with lightning bonuses.',
    image: greekImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol']
  },
  {
    id: 'wild-west-slots',
    title: 'Sheriff\'s Gold',
    description: 'High volatility western theme with sticky wilds.',
    image: wildWestImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol', 'background']
  },
  {
    id: 'ocean-slots',
    title: 'Deep Blue Treasure',
    description: 'Relaxing underwater theme with bubble pop bonus.',
    image: oceanImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol']
  },
  {
    id: 'space-slots',
    title: 'Galactic Spins',
    description: 'Futuristic sci-fi theme with cascading reels.',
    image: spaceImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol', 'background']
  },
  {
    id: 'fruit-slots',
    title: 'Fruit Party',
    description: 'Classic fruit machine with a modern twist.',
    image: fruitImg,
    category: 'Casino',
    compatibility: ['logo', 'symbol']
  },
  {
    id: 'roulette',
    title: 'Royal Roulette',
    description: 'Premium European roulette experience.',
    image: rouletteImg,
    category: 'Table Game',
    compatibility: ['logo', 'background']
  },
  {
    id: 'blackjack',
    title: 'Pro Blackjack',
    description: 'First-person blackjack with side bets.',
    image: blackjackImg,
    category: 'Table Game',
    compatibility: ['logo', 'background']
  },
  {
    id: 'poker',
    title: 'Texas Hold\'em',
    description: 'Tournament style poker showdown.',
    image: pokerImg,
    category: 'Card Game',
    compatibility: ['logo', 'background']
  },
  {
    id: 'wheel',
    title: 'Spin & Win',
    description: 'Colorful fortune wheel with custom prizes.',
    image: wheelImg,
    category: 'Instant Win',
    compatibility: ['logo', 'product', 'background']
  },
  {
    id: 'scratch',
    title: 'Gold Rush Scratch',
    description: 'Satisfying scratch card reveal mechanic.',
    image: scratchImg,
    category: 'Instant Win',
    compatibility: ['logo', 'symbol']
  },
  {
    id: 'plinko',
    title: 'Plinko Drop',
    description: 'Addictive ball drop game with multipliers.',
    image: plinkoImg,
    category: 'Arcade',
    compatibility: ['logo', 'background']
  },
  {
    id: 'baccarat',
    title: 'VIP Baccarat',
    description: 'High-stakes baccarat for VIP players.',
    image: baccaratImg,
    category: 'Table Game',
    compatibility: ['logo', 'background']
  },
  {
    id: 'craps',
    title: 'Dice Master',
    description: 'Exciting craps table with realistic physics.',
    image: crapsImg,
    category: 'Table Game',
    compatibility: ['logo', 'background']
  },
  {
    id: 'keno',
    title: 'Lucky Keno',
    description: 'Fast-paced lottery style number game.',
    image: kenoImg,
    category: 'Instant Win',
    compatibility: ['logo', 'background']
  },
  {
    id: 'runner',
    title: 'Endless Runner',
    description: 'Your character running in your branded environment.',
    image: runnerImg,
    category: 'Action',
    compatibility: ['character', 'background', 'logo']
  },
  {
    id: 'puzzle',
    title: 'Match-3 Puzzle',
    description: 'Match your product icons to win points.',
    image: puzzleImg,
    category: 'Puzzle',
    compatibility: ['product', 'logo', 'background']
  },
  {
    id: 'quiz',
    title: 'Interactive Quiz',
    description: 'Trivia about your brand features.',
    image: quizImg,
    category: 'Trivia',
    compatibility: ['logo', 'background']
  }
];

export default function TemplateGrid({ onSelect, selectedId, onNext, onBack }: TemplateGridProps) {
  const { assets } = useAssets();
  const uploadedTypes = new Set(assets.map(a => a.type));

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Recommended Templates</h2>
          <p className="text-muted-foreground text-lg">
            We've matched your assets to these playable formats.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>Back to Upload</Button>
          <Button disabled={!selectedId} onClick={onNext}>Customize Design</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          // Calculate match score based on uploaded assets
          const matchCount = template.compatibility.filter(type => uploadedTypes.has(type as any)).length;
          const isBestMatch = matchCount >= 2;

          return (
            <motion.div
              key={template.id}
              whileHover={{ y: -5 }}
              onClick={() => onSelect(template.id)}
              className={cn(
                "group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all h-[360px] flex flex-col bg-card",
                selectedId === template.id
                  ? "border-primary shadow-[0_0_0_4px_rgba(124,58,237,0.2)]"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <div className="h-48 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                 <img 
                   src={template.image} 
                   alt={template.title}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 
                 {/* Asset Preview Overlay - Simulating "Your assets inside" */}
                 {assets.length > 0 && (
                   <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                     <div className="flex -space-x-2">
                       {assets.slice(0, 3).map((asset, i) => (
                         <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-background overflow-hidden">
                           <img src={asset.previewUrl} className="w-full h-full object-cover" />
                         </div>
                       ))}
                       {assets.length > 3 && (
                         <div className="h-8 w-8 rounded-full border-2 border-white bg-background flex items-center justify-center text-[10px] font-bold">
                           +{assets.length - 3}
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 <div className="absolute top-3 left-3 z-20 flex gap-2">
                   <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                     {template.category}
                   </span>
                   {isBestMatch && (
                      <span className="px-2 py-1 rounded-full bg-primary/90 backdrop-blur-md text-xs font-bold text-white shadow-lg flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Best Match
                      </span>
                   )}
                 </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display font-bold text-lg mb-1">{template.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {template.description}
                </p>
                
                <div className="mt-auto">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Asset Usage</p>
                  <div className="flex flex-wrap gap-1">
                    {template.compatibility.map(type => (
                      <span 
                        key={type} 
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded border capitalize",
                          uploadedTypes.has(type as any) 
                            ? "bg-green-500/10 text-green-500 border-green-500/20" 
                            : "bg-muted text-muted-foreground/50 border-transparent"
                        )}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedId === template.id && (
                <div className="absolute top-3 right-3 z-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
