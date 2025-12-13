import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';
import puzzleImg from '@assets/generated_images/match-3_puzzle_game_screenshot.png';
import quizImg from '@assets/generated_images/interactive_quiz_interface.png';
import racingImg from '@assets/generated_images/car_racing_game_screenshot.png';
import slotsBg from '@assets/generated_images/casino_slot_machine_background.png';

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
    description: 'High-retention slot machine mechanic with custom symbols.',
    image: slotsBg,
    category: 'Casino'
  },
  {
    id: 'runner',
    title: 'Endless Runner',
    description: 'Classic infinite runner mechanic perfect for high engagement.',
    image: runnerImg,
    category: 'Action'
  },
  {
    id: 'puzzle',
    title: 'Match-3 Puzzle',
    description: 'Addictive puzzle mechanic suitable for casual audiences.',
    image: puzzleImg,
    category: 'Puzzle'
  },
  {
    id: 'quiz',
    title: 'Interactive Quiz',
    description: 'Engage users with trivia related to your brand.',
    image: quizImg,
    category: 'Trivia'
  },
  {
    id: 'racing',
    title: 'Street Racer',
    description: 'High-octane racing experience for automotive brands.',
    image: racingImg,
    category: 'Sports'
  }
];

export default function TemplateGrid({ onSelect, selectedId, onNext, onBack }: TemplateGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Choose a Template</h2>
          <p className="text-muted-foreground text-lg">
            Select a playable format that fits your campaign goals.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button disabled={!selectedId} onClick={onNext}>Continue to Editor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelect(template.id)}
            className={cn(
              "group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all h-[320px] flex flex-col bg-card",
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
               <div className="absolute top-3 left-3 z-20">
                 <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                   {template.category}
                 </span>
               </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-display font-bold text-lg mb-1">{template.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {template.description}
              </p>
            </div>

            {selectedId === template.id && (
              <div className="absolute top-3 right-3 z-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
