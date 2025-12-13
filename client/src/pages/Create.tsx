import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import FileUpload from '@/components/create/FileUpload';
import TemplateGrid from '@/components/create/TemplateGrid';
import EditorCanvas from '@/components/create/EditorCanvas';
import { Button } from '@/components/ui/button';

export default function Create() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const nextStep = () => setStep(prev => prev + 1);
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
            <span className={step >= 1 ? "text-primary" : "text-muted-foreground"}>Upload</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className={step >= 2 ? "text-primary" : "text-muted-foreground"}>Template</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className={step >= 3 ? "text-primary" : "text-muted-foreground"}>Editor</span>
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

          {step === 2 && (
            <motion.div
              key="step2"
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

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <EditorCanvas />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
