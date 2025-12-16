import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Download, Facebook, Ghost, Smartphone, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Platform = 'meta' | 'snapchat' | 'dsp' | 'unity';

const platforms: { id: Platform; name: string; icon: any; color: string; specs: string }[] = [
  { 
    id: 'meta', 
    name: 'Meta Ads', 
    icon: Facebook, 
    color: 'bg-blue-600',
    specs: 'HTML5 < 2MB, Single Index.html' 
  },
  { 
    id: 'snapchat', 
    name: 'Snapchat', 
    icon: Ghost, 
    color: 'bg-yellow-400 text-black',
    specs: 'Playable Ad < 4MB, MRAID' 
  },
  { 
    id: 'dsp', 
    name: 'DSP / Ad Networks', 
    icon: Globe, 
    color: 'bg-purple-600',
    specs: 'MRAID 2.0, Various Sizes' 
  },
  { 
    id: 'unity', 
    name: 'Unity / AppLovin', 
    icon: Smartphone, 
    color: 'bg-zinc-800',
    specs: 'MRAID, Custom Events' 
  }
];

export default function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('meta');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportLog, setExportLog] = useState<string[]>([]);

  const handleExport = () => {
    setIsExporting(true);
    setExportLog([]);
    setExportStep(0);

    const steps = [
        "Initializing build environment...",
        "Optimizing assets (Images & Audio)...",
        "Compiling game logic...",
        `Generating ${platforms.find(p => p.id === selectedPlatform)?.name} manifest...`,
        "Packaging final bundle...",
        "Verifying file size constraints...",
        "Build complete!"
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            setTimeout(() => {
                setIsExporting(false);
                onOpenChange(false);
            }, 1000);
            return;
        }

        setExportLog(prev => [...prev, steps[currentStep]]);
        setExportStep(prev => prev + 1);
        currentStep++;
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border">
        <div className="flex h-[500px]">
          {/* Sidebar - Platform Selection */}
          <div className="w-1/3 border-r border-border bg-muted/30 p-4 space-y-2">
            <h3 className="font-display font-bold mb-4 px-2">Select Channel</h3>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  selectedPlatform === platform.id 
                    ? "bg-primary/10 border border-primary/20 shadow-sm" 
                    : "hover:bg-muted border border-transparent"
                )}
              >
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", platform.color)}>
                  <platform.icon className={cn("h-4 w-4", platform.id === 'snapchat' ? "text-black" : "text-white")} />
                </div>
                <div>
                  <div className={cn("font-bold text-sm", selectedPlatform === platform.id ? "text-primary" : "text-foreground")}>
                    {platform.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight">
                    {platform.specs}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Content - Configuration */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle>Export Settings: {platforms.find(p => p.id === selectedPlatform)?.name}</DialogTitle>
              <DialogDescription>
                Configure specific settings for this advertising channel.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Common Settings */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>App Store URL (iOS)</Label>
                    <Input placeholder="https://apps.apple.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Play Store URL (Android)</Label>
                    <Input placeholder="https://play.google.com/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Compression Level</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (Smaller File Size)</SelectItem>
                      <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                      <SelectItem value="quality">Best Quality (Larger File Size)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Estimated Output Size: ~1.8MB (Limit: 2MB)
                  </p>
                </div>
              </div>

              {/* Platform Specifics */}
              {selectedPlatform === 'meta' && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <h4 className="font-bold text-sm text-blue-500 flex items-center gap-2">
                    <Facebook className="h-3 w-3" /> Meta Optimization
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically inlines all assets (images, sounds, scripts) into a single HTML file as required by Facebook & Instagram Ads Manager.
                  </p>
                </div>
              )}

              {selectedPlatform === 'snapchat' && (
                <div className="p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/20 space-y-2">
                  <h4 className="font-bold text-sm text-yellow-600 flex items-center gap-2">
                    <Ghost className="h-3 w-3" /> Snapchat Requirements
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Ensures MRAID compliance and optimizes initial load time to be under 1s.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="p-4 border-t border-border bg-muted/10">
              {isExporting ? (
                <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span>Building Package...</span>
                        <span>{Math.round((exportStep / 7) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(exportStep / 7) * 100}%` }} 
                        />
                    </div>
                    <div className="h-24 p-2 bg-black/80 rounded font-mono text-[10px] text-green-400 overflow-y-auto">
                        {exportLog.map((log, i) => (
                            <div key={i} className="mb-1">&gt; {log}</div>
                        ))}
                        <div className="animate-pulse">&gt; _</div>
                    </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button onClick={handleExport} className="gap-2 min-w-[140px]">
                    <Download className="h-4 w-4" /> Export Package
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
