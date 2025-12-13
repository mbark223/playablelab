import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onNext: () => void;
}

export default function FileUpload({ onNext }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'video/*': ['.mp4', '.webm']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold mb-3">Upload Marketing Assets</h2>
        <p className="text-muted-foreground text-lg">
          Drop your game assets, logos, and videos here to get started.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer bg-card/50 hover:bg-card",
          isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border",
          files.length > 0 ? "h-64" : "h-96 flex flex-col justify-center"
        )}
      >
        <input {...getInputProps()} />
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
              or click to browse from your computer
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Uploaded Files ({files.length})
              </h3>
              <Button onClick={(e) => { e.stopPropagation(); onNext(); }}>
                Continue to Templates
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group"
                >
                  <div className="h-10 w-10 rounded bg-background flex items-center justify-center shrink-0">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:text-destructive transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
