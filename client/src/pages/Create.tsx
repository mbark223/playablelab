import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

import Layout from '@/components/layout/Layout';
import FileUpload from '@/components/create/FileUpload';
import TemplateGrid from '@/components/create/TemplateGrid';
import EditorCanvas from '@/components/create/EditorCanvas';
import { Button } from '@/components/ui/button';
import { ChannelSelector } from '@/components/create/ChannelSelector';
import { ChannelProvider, useChannel } from '@/contexts/ChannelContext';
import { useQuery } from '@tanstack/react-query';

function CreateContent() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { selectedChannel, setSelectedChannel, channels, setChannels } = useChannel();

  const { data: channelsData, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch('/api/channels');
      if (!response.ok) throw new Error('Failed to fetch channels');
      return response.json();
    }
  });

  useEffect(() => {
    if (channelsData) {
      setChannels(channelsData);
    }
  }, [channelsData, setChannels]);

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
            <button 
              onClick={() => setStep(1)}
              className={cn(
                "transition-colors hover:text-primary",
                step >= 1 ? "text-primary" : "text-muted-foreground"
              )}
            >
              Channel
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
              Upload
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button 
              onClick={() => step >= 3 && setStep(3)}
              disabled={step < 3}
              className={cn(
                "transition-colors",
                step >= 3 ? "text-primary hover:text-primary cursor-pointer" : "text-muted-foreground cursor-default"
              )}
            >
              Template
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className={step >= 4 ? "text-primary" : "text-muted-foreground"}>Editor</span>
          </nav>
        </div>
        
        {step < 4 && (
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
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Select Ad Channel</h1>
                    <p className="text-muted-foreground">
                      Choose the platform where your playable ad will be displayed
                    </p>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ChannelSelector
                      channels={channels}
                      selectedChannel={selectedChannel}
                      onSelectChannel={setSelectedChannel}
                    />
                  )}
                  
                  <div className="flex justify-end mt-8">
                    <Button
                      size="lg"
                      onClick={nextStep}
                      disabled={!selectedChannel}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
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
              <FileUpload onNext={nextStep} onBack={prevStep} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
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
                selectedChannel={selectedChannel}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
            >
              <EditorCanvas 
                templateId={selectedTemplate} 
                selectedChannel={selectedChannel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Create() {
  return (
    <ChannelProvider>
      <CreateContent />
    </ChannelProvider>
  );
}
