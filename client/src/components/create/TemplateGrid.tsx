import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAssets } from '@/lib/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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
    title: 'Classic Spin',
    description: 'Traditional reel spinning animation. Best for classic slot experiences. (3x1 Grid)',
    image: slotsBg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol', 'background'],
    requiredAssets: ['symbol']
  },
  {
    id: 'space-slots',
    title: 'Cascading Drops',
    description: 'Symbols fall from above like a waterfall. Great for modern video slots. (4x4 Grid)',
    image: spaceImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol', 'background'],
    requiredAssets: ['symbol']
  },
  {
    id: 'fruit-slots',
    title: 'Bouncing Reels',
    description: 'Playful bounce effect when reels stop. energetic and fun. (3x3 Grid)',
    image: fruitImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol'],
    requiredAssets: ['symbol']
  },
  {
    id: 'ocean-slots',
    title: 'Bubble Reveal',
    description: 'Symbols float up and fade in. Perfect for underwater or ethereal themes. (5x3 Grid)',
    image: oceanImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol'],
    requiredAssets: ['symbol']
  },
  {
    id: 'egyptian-slots',
    title: 'Expanding Wilds',
    description: 'Focus on central expanding symbols animation. High volatility feel. (5x3 Grid)',
    image: egyptianImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol'],
    requiredAssets: ['symbol']
  },
  {
    id: 'greek-slots',
    title: 'Thunder Strike',
    description: 'Intense flash and shake animation on win. (5x4 Grid)',
    image: greekImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol'],
    requiredAssets: ['symbol']
  },
  {
    id: 'wild-west-slots',
    title: 'Sticky Wins',
    description: 'Winning symbols stay in place while others respin. (3x5 Grid)',
    image: wildWestImg,
    category: 'Mechanic',
    compatibility: ['logo', 'symbol', 'background'],
    requiredAssets: ['symbol']
  },
  {
    id: 'roulette',
    title: 'Royal Roulette',
    description: 'Premium European roulette experience.',
    image: rouletteImg,
    category: 'Table Game',
    compatibility: ['logo', 'background'],
    requiredAssets: ['logo']
  },
  {
    id: 'wheel',
    title: 'Spin & Win',
    description: 'Colorful fortune wheel with custom prizes.',
    image: wheelImg,
    category: 'Instant Win',
    compatibility: ['logo', 'product', 'background'],
    requiredAssets: ['product']
  },
  {
    id: 'scratch',
    title: 'Gold Rush Scratch',
    description: 'Satisfying scratch card reveal mechanic.',
    image: scratchImg,
    category: 'Instant Win',
    compatibility: ['logo', 'symbol'],
    requiredAssets: ['symbol']
  },
  {
    id: 'blackjack',
    title: 'Pro Blackjack',
    description: 'First-person blackjack with side bets.',
    image: blackjackImg,
    category: 'Table Game',
    compatibility: ['logo', 'background'],
    requiredAssets: ['logo']
  }
];

export default function TemplateGrid({ onSelect, selectedId, onNext, onBack }: TemplateGridProps) {
  const { assets } = useAssets();
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const uploadedTypes = new Set(assets.map(a => a.type));

  // Filter templates based on required assets
  const matchingTemplates = templates.filter(template => {
    // If no required assets are defined, it's always compatible (or fallback to logo)
    if (!template.requiredAssets || template.requiredAssets.length === 0) return true;
    
    // Check if user has uploaded ANY of the required asset types for this template
    // (Relaxed strictness: has at least one required type)
    // Or Strict: Must have ALL required types? 
    // Let's go with: Must have at least one of the "required" types (usually the key mechanic asset)
    return template.requiredAssets.some(type => uploadedTypes.has(type as any));
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Recommended Templates</h2>
          <p className="text-muted-foreground text-lg">
            Showing {matchingTemplates.length} templates compatible with your uploaded assets.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>Back to Upload</Button>
          <Button disabled={!selectedId} onClick={onNext}>Customize Design</Button>
        </div>
      </div>
      
      {matchingTemplates.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Matching Templates Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any templates that match your uploaded assets. Try uploading a <strong>Logo</strong>, <strong>Character</strong>, or <strong>Product Image</strong> to unlock more options.
          </p>
          <Button variant="secondary" onClick={onBack}>Upload More Assets</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchingTemplates.map((template) => {
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
                   
                 {/* Asset Preview Overlay - ALWAYS VISIBLE now */}
                 {assets.length > 0 && (
                   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300">
                     
                     {/* If it's a Logo-compatible template and we have a logo, show it prominently */}
                     {template.compatibility.includes('logo') && assets.some(a => a.type === 'logo') && (
                        <div className="mb-4 relative">
                          <img 
                            src={assets.find(a => a.type === 'logo')?.previewUrl} 
                            className="h-16 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500" 
                          />
                          <div className="absolute -right-2 -top-2 bg-primary text-[10px] px-1.5 py-0.5 rounded text-white font-bold shadow-sm animate-in fade-in delay-300">
                            YOUR LOGO
                          </div>
                        </div>
                     )}

                     <div className="flex -space-x-2 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-xl">
                       {assets.filter(a => template.compatibility.includes(a.type)).slice(0, 3).map((asset, i) => (
                         <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-background overflow-hidden relative group/asset">
                           <img src={asset.previewUrl} className="w-full h-full object-cover" />
                         </div>
                       ))}
                       {assets.filter(a => template.compatibility.includes(a.type)).length > 3 && (
                         <div className="h-8 w-8 rounded-full border-2 border-white bg-background flex items-center justify-center text-[10px] font-bold">
                           +{assets.filter(a => template.compatibility.includes(a.type)).length - 3}
                         </div>
                       )}
                     </div>
                     <div className="mt-2 bg-primary/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                       GENERATED FOR YOU
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

                   {/* Preview Button */}
                   <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0 rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId(template.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-1">{template.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {template.description}
                  </p>
                  
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Required Assets</p>
                    <div className="flex flex-wrap gap-1">
                      {template.compatibility.map(type => (
                        <span 
                          key={type} 
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border capitalize",
                            uploadedTypes.has(type as any) 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : (template.requiredAssets?.includes(type) ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted text-muted-foreground/50 border-transparent")
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
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplateId} onOpenChange={(open) => !open && setPreviewTemplateId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {templates.find(t => t.id === previewTemplateId)?.title}
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                {templates.find(t => t.id === previewTemplateId)?.category}
              </span>
            </DialogTitle>
            <DialogDescription>
              {templates.find(t => t.id === previewTemplateId)?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative aspect-video rounded-lg overflow-hidden border bg-black/5 mt-2">
            {previewTemplateId && (
              <img 
                src={templates.find(t => t.id === previewTemplateId)?.image} 
                className="w-full h-full object-contain"
                alt="Preview"
              />
            )}
            
             {/* Overlay Assets on Preview too */}
             {assets.length > 0 && previewTemplateId && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Logo overlay logic similar to card but larger */}
                  {templates.find(t => t.id === previewTemplateId)?.compatibility.includes('logo') && assets.some(a => a.type === 'logo') && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-150">
                       <img 
                        src={assets.find(a => a.type === 'logo')?.previewUrl} 
                        className="h-20 w-auto object-contain drop-shadow-2xl" 
                      />
                    </div>
                  )}
               </div>
             )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
             <div className="flex gap-2">
                {templates.find(t => t.id === previewTemplateId)?.compatibility.map(type => (
                  <span key={type} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                    {type} Compatible
                  </span>
                ))}
             </div>
             <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewTemplateId(null)}>Close</Button>
                <Button onClick={() => {
                  if (previewTemplateId) {
                    onSelect(previewTemplateId);
                    setPreviewTemplateId(null);
                  }
                }}>
                  Select This Template
                </Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
