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
  config?: any;
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

export default function ExportModal({ open, onOpenChange, config }: ExportModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('meta');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportLog, setExportLog] = useState<string[]>([]);

  // Helper to convert blob/url to base64
  const toBase64 = async (url: string): Promise<string> => {
    try {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Failed to convert to base64", url, e);
        return url; // Fallback
    }
  };

  const generateHTML = async () => {
    if (!config) return "<!-- No Config Provided -->";

    // 1. Prepare Assets
    const bgBase64 = await toBase64(config.background);
    const logoBase64 = await toBase64(config.logo);
    
    // 2. Build HTML
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${config.headline || 'Playable Ad'}</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #000; font-family: sans-serif; touch-action: none; }
    #game-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-col; align-items: center; justify-content: center; background-image: url('${bgBase64}'); background-size: cover; background-position: center; }
    #ui-layer { position: absolute; inset: 0; pointer-events: none; display: flex; flex-direction: column; align-items: center; }
    #logo { margin-top: 20px; height: 60px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); }
    #headline { color: ${config.colors?.text || '#fff'}; font-size: 32px; font-weight: 900; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-top: 10px; text-align: center; }
    #slots-board { width: 90%; max-width: 400px; aspect-ratio: 4/3; background: rgba(0,0,0,0.5); border: 4px solid #fbbf24; border-radius: 12px; margin-top: auto; margin-bottom: auto; display: grid; grid-template-columns: repeat(${config.gameSettings?.slotCols || 3}, 1fr); padding: 5px; gap: 5px; pointer-events: auto; }
    .reel { background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .symbol { font-size: 24px; color: gold; }
    #controls { width: 100%; padding: 20px; display: flex; flex-direction: column; align-items: center; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); pointer-events: auto; }
    #cta-btn { background: linear-gradient(to right, #f59e0b, #fbbf24); border: none; padding: 15px 40px; border-radius: 50px; font-size: 20px; font-weight: bold; color: #451a03; cursor: pointer; animation: pulse 1.5s infinite; box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    #spins-left { color: white; margin-bottom: 10px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    #end-card { position: absolute; inset: 0; background: rgba(0,0,0,0.9); display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 100; pointer-events: auto; }
    #end-card.visible { display: flex; animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="ui-layer">
      <img id="logo" src="${logoBase64}" />
      <div id="headline">${config.headline}</div>
    </div>
    
    <div id="slots-board">
       <!-- Reels will be generated by JS -->
    </div>

    <div id="controls">
      <div id="spins-left">${config.gameSettings?.spins || 5} SPINS LEFT</div>
      <button id="cta-btn" onclick="spin()">${config.ctaText}</button>
    </div>
  </div>

  <div id="end-card">
    <h1 style="color: white; font-size: 40px; margin: 0; text-transform: uppercase;">YOU WON!</h1>
    <h2 style="color: #fbbf24; margin: 10px 0 30px 0;">$500 BONUS</h2>
    <button id="cta-btn" onclick="install()">CLAIM NOW</button>
  </div>

  <script>
    let spins = ${config.gameSettings?.spins || 5};
    const cols = ${config.gameSettings?.slotCols || 3};
    const rows = ${config.gameSettings?.slotRows || 1};
    const board = document.getElementById('slots-board');
    const spinsDisplay = document.getElementById('spins-left');
    const btn = document.getElementById('cta-btn');

    // Init Board
    for(let i=0; i<cols; i++) {
        const reel = document.createElement('div');
        reel.className = 'reel';
        reel.innerHTML = '<div class="symbol">7️⃣</div>'; // Placeholder symbol
        board.appendChild(reel);
    }

    function spin() {
        if(spins <= 0) return;
        spins--;
        spinsDisplay.innerText = spins + " SPINS LEFT";
        
        // Simple animation simulation
        const reels = document.querySelectorAll('.reel');
        reels.forEach((r, i) => {
            r.style.transition = 'none';
            r.style.transform = 'translateY(0)';
            setTimeout(() => {
                r.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                r.style.transform = 'translateY(10px)'; // Bounce effect
                setTimeout(() => r.style.transform = 'translateY(0)', 500);
            }, i * 100);
        });

        if(spins === 0) {
            setTimeout(() => {
                document.getElementById('end-card').classList.add('visible');
            }, 1000);
        }
    }

    function install() {
        // Platform specific install call
        console.log("Install Clicked");
        if(window.mraid) window.mraid.open("https://apps.apple.com");
        else window.open("https://apps.apple.com");
    }
  </script>
</body>
</html>`;
  };

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

    const interval = setInterval(async () => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            
            // Generate Real HTML
            const htmlContent = await generateHTML();
            
            const element = document.createElement("a");
            const file = new Blob([htmlContent], {type: 'text/html'});
            element.href = URL.createObjectURL(file);
            element.download = `playable-ad-${selectedPlatform}.html`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

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
