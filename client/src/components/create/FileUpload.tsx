import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAssets } from '@/lib/AssetContext';
import { Badge } from '@/components/ui/badge';

interface FileUploadProps {
  onNext: () => void;
}

export default function FileUpload({ onNext }: FileUploadProps) {
  const { assets, addAsset, removeAsset } = useAssets();
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true);
    // Simulate processing time for "AI Analysis"
    setTimeout(() => {
      addAsset(acceptedFiles);
      setIsProcessing(false);
    }, 1500);
  }, [addAsset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold mb-3">Upload Your Marketing Kit</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Start by uploading your brand assets. We'll automatically analyze them and populate the templates with your logos, backgrounds, and products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="md:col-span-2 space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer relative overflow-hidden",
              isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-card/50 hover:bg-card",
              "h-80 flex flex-col items-center justify-center"
            )}
          >
            <input {...getInputProps()} />
            
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center relative">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">Analyzing Assets...</p>
                  <p className="text-sm text-muted-foreground">Categorizing logos & symbols</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center transition-colors",
                  isDragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop files now" : "Drag & drop files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload logos, backgrounds, products, or characters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Asset List Side Panel */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-80">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
            <span>Detected Assets</span>
            <Badge variant="secondary">{assets.length}</Badge>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            <AnimatePresence>
              {assets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-border/50 rounded-lg">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No assets uploaded yet</p>
                </div>
              ) : (
                assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-background border border-border group relative"
                  >
                    <div className="h-10 w-10 rounded bg-muted/30 p-1 flex items-center justify-center shrink-0 border border-border/50">
                      <img src={asset.previewUrl} className="w-full h-full object-contain" alt={asset.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 capitalize mt-1">
                        {asset.type}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all bg-background/80 backdrop-blur-sm rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          size="lg" 
          onClick={onNext} 
          disabled={assets.length === 0}
          className="w-full md:w-auto min-w-[200px] shadow-lg shadow-primary/20"
        >
          Generate Templates
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
