import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

import Layout from '@/components/layout/Layout';
import FileUpload from '@/components/create/FileUpload';
import TemplateGrid from '@/components/create/TemplateGrid';
import EditorCanvas from '@/components/create/EditorCanvas';
import VideoToPlayable from '@/components/create/VideoToPlayable';
import PlayableGenerator from '@/components/create/PlayableGenerator';
import { Button } from '@/components/ui/button';
import { useAssets } from '@/lib/AssetContext';
import { PlayableStoryboard } from '@/lib/videoProcessor';

export default function Create() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [workflowType, setWorkflowType] = useState<'template' | 'video' | null>(null);
  const [selectedVideoAsset, setSelectedVideoAsset] = useState<string | null>(null);
  const [storyboard, setStoryboard] = useState<PlayableStoryboard | null>(null);
  const { assets } = useAssets();

  const nextStep = () => {
    if (step === 1) {
      // Check if user uploaded a video
      const videoAssets = assets.filter(asset => asset.type === 'video');
      if (videoAssets.length > 0) {
        setWorkflowType('video');
        setSelectedVideoAsset(videoAssets[0].id);
      } else {
        setWorkflowType('template');
      }
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <nav className="flex items-center gap-2 text-sm font-medium">
            <button 
              onClick={() => setStep(1)}
              className={cn(
                "transition-colors hover:text-primary",
                step >= 1 ? "text-primary" : "text-muted-foreground"
              )}
            >
              Upload
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button 
              onClick={() => step >= 2 && setStep(2)}
              disabled={step < 2}
              className={cn(
                "transition-colors",
                step >= 2 ? "text-primary hover:text-primary cursor-pointer" : "text-muted-foreground cursor-default"
              )}
            >
              {workflowType === 'video' ? 'Analyze' : 'Template'}
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className={step >= 3 ? "text-primary" : "text-muted-foreground"}>
              {workflowType === 'video' ? 'Generate' : 'Editor'}
            </span>
          </nav>
        </div>
        
        {step < 3 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Save & Exit</Link>
          </Button>
        )}
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <FileUpload onNext={nextStep} />
            </motion.div>
          )}

          {step === 2 && workflowType === 'template' && (
            <motion.div
              key="step2-template"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <TemplateGrid 
                onSelect={setSelectedTemplate} 
                selectedId={selectedTemplate}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 2 && workflowType === 'video' && (
            <motion.div
              key="step2-video"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <VideoToPlayable
                videoAsset={assets.find(a => a.id === selectedVideoAsset)!}
                onBack={prevStep}
                onNext={(storyboard) => {
                  setStoryboard(storyboard);
                  nextStep();
                }}
              />
            </motion.div>
          )}

          {step === 3 && workflowType === 'template' && (
            <motion.div
              key="step3-template"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <EditorCanvas templateId={selectedTemplate} />
            </motion.div>
          )}

          {step === 3 && workflowType === 'video' && storyboard && (
            <motion.div
              key="step3-video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <PlayableGenerator
                storyboard={storyboard}
                onBack={prevStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
