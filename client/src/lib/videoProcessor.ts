export interface VideoFrame {
  timestamp: number;
  dataUrl: string;
  isKeyFrame?: boolean;
}

export interface VideoAnalysis {
  duration: number;
  fps: number;
  width: number;
  height: number;
  frames: VideoFrame[];
  scenes: SceneData[];
}

export interface SceneData {
  startTime: number;
  endTime: number;
  keyFrame: VideoFrame;
  description?: string;
  type?: 'action' | 'transition' | 'static';
}

export class VideoProcessor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async analyzeVideo(file: File): Promise<VideoAnalysis> {
    const url = URL.createObjectURL(file);
    console.log('Video URL created:', url);
    
    return new Promise((resolve, reject) => {
      this.video.src = url;
      this.video.muted = true;
      
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        reject(new Error('Video loading timeout'));
      }, 30000); // 30 second timeout
      
      this.video.onloadedmetadata = async () => {
        clearTimeout(timeout);
        console.log('Video metadata loaded:', {
          duration: this.video.duration,
          width: this.video.videoWidth,
          height: this.video.videoHeight
        });
        try {
          const analysis = await this.processVideo();
          URL.revokeObjectURL(url);
          resolve(analysis);
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      this.video.onerror = (e) => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        console.error('Video error event:', e);
        reject(new Error('Failed to load video'));
      };
    });
  }

  private async processVideo(): Promise<VideoAnalysis> {
    const duration = this.video.duration;
    const fps = 30; // Assume 30fps for now
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    
    this.canvas.width = Math.min(width, 640); // Limit canvas size for performance
    this.canvas.height = Math.min(height, 480);
    
    const frames: VideoFrame[] = [];
    const scenes: SceneData[] = [];
    const frameInterval = Math.max(duration / 10, 1); // Capture max 10 frames
    
    console.log('Processing video frames, interval:', frameInterval);
    
    // Extract frames at regular intervals
    for (let time = 0; time < duration; time += frameInterval) {
      try {
        const frame = await this.captureFrame(time);
        frames.push(frame);
        console.log(`Captured frame at ${time}s`);
      } catch (error) {
        console.error(`Failed to capture frame at ${time}s:`, error);
      }
    }
    
    // If no frames were captured, create at least one
    if (frames.length === 0) {
      console.warn('No frames captured, creating placeholder');
      frames.push({
        timestamp: 0,
        dataUrl: this.canvas.toDataURL('image/jpeg', 0.8),
        isKeyFrame: true
      });
    }
    
    // Detect scene changes and key frames
    const detectedScenes = this.detectScenes(frames);
    scenes.push(...detectedScenes);
    
    return {
      duration,
      fps,
      width,
      height,
      frames,
      scenes
    };
  }

  private async captureFrame(timestamp: number): Promise<VideoFrame> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Frame capture timeout at ${timestamp}s`));
      }, 5000);
      
      this.video.onseeked = () => {
        clearTimeout(timeout);
        try {
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
          const dataUrl = this.canvas.toDataURL('image/jpeg', 0.8);
          resolve({
            timestamp,
            dataUrl,
            isKeyFrame: false
          });
        } catch (error) {
          reject(error);
        }
      };
      
      this.video.currentTime = timestamp;
    });
  }

  private detectScenes(frames: VideoFrame[]): SceneData[] {
    const scenes: SceneData[] = [];
    let sceneStart = 0;
    
    // Simple scene detection based on frame intervals
    // In a real implementation, this would use more sophisticated algorithms
    for (let i = 0; i < frames.length; i++) {
      const isSceneChange = i > 0 && this.isSignificantChange(frames[i-1], frames[i]);
      
      if (isSceneChange || i === frames.length - 1) {
        const endTime = i === frames.length - 1 ? frames[i].timestamp : frames[i-1].timestamp;
        const keyFrameIndex = Math.floor((sceneStart + i) / 2);
        
        scenes.push({
          startTime: frames[sceneStart].timestamp,
          endTime: endTime,
          keyFrame: { ...frames[keyFrameIndex], isKeyFrame: true },
          type: this.classifyScene(frames.slice(sceneStart, i))
        });
        
        sceneStart = i;
      }
    }
    
    return scenes;
  }

  private isSignificantChange(frame1: VideoFrame, frame2: VideoFrame): boolean {
    // Simplified change detection
    // In reality, this would compare pixel data, histograms, etc.
    return Math.random() > 0.7; // Placeholder logic
  }

  private classifyScene(frames: VideoFrame[]): 'action' | 'transition' | 'static' {
    // Simplified scene classification
    // Would normally analyze motion vectors, object detection, etc.
    const random = Math.random();
    if (random < 0.33) return 'action';
    if (random < 0.66) return 'transition';
    return 'static';
  }

  extractKeyMoments(analysis: VideoAnalysis): VideoFrame[] {
    return analysis.scenes.map(scene => scene.keyFrame);
  }

  generatePlayableStoryboard(analysis: VideoAnalysis): PlayableStoryboard {
    return {
      scenes: analysis.scenes.map((scene, index) => ({
        id: `scene-${index}`,
        duration: scene.endTime - scene.startTime,
        thumbnail: scene.keyFrame.dataUrl,
        type: scene.type || 'static',
        interactions: this.suggestInteractions(scene)
      })),
      totalDuration: analysis.duration,
      dimensions: {
        width: analysis.width,
        height: analysis.height
      }
    };
  }

  private suggestInteractions(scene: SceneData): InteractionSuggestion[] {
    const suggestions: InteractionSuggestion[] = [];
    
    switch (scene.type) {
      case 'action':
        suggestions.push({
          type: 'tap',
          description: 'Tap to trigger action'
        });
        break;
      case 'transition':
        suggestions.push({
          type: 'swipe',
          description: 'Swipe to continue'
        });
        break;
      case 'static':
        suggestions.push({
          type: 'button',
          description: 'Add interactive button'
        });
        break;
    }
    
    return suggestions;
  }
}

export interface PlayableStoryboard {
  scenes: PlayableScene[];
  totalDuration: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface PlayableScene {
  id: string;
  duration: number;
  thumbnail: string;
  type: 'action' | 'transition' | 'static';
  interactions: InteractionSuggestion[];
}

export interface InteractionSuggestion {
  type: 'tap' | 'swipe' | 'button' | 'drag';
  description: string;
}