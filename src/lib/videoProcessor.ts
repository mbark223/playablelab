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
    
    return new Promise((resolve, reject) => {
      this.video.src = url;
      this.video.muted = true;
      
      this.video.onloadedmetadata = async () => {
        try {
          const analysis = await this.processVideo();
          URL.revokeObjectURL(url);
          resolve(analysis);
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      this.video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video'));
      };
    });
  }

  private async processVideo(): Promise<VideoAnalysis> {
    const duration = this.video.duration;
    const fps = 30; // Assume 30fps for now
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    const frames: VideoFrame[] = [];
    const scenes: SceneData[] = [];
    const frameInterval = 1; // Capture every second
    
    // Extract frames at regular intervals
    for (let time = 0; time < duration; time += frameInterval) {
      const frame = await this.captureFrame(time);
      frames.push(frame);
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
    return new Promise((resolve) => {
      this.video.currentTime = timestamp;
      this.video.onseeked = () => {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const dataUrl = this.canvas.toDataURL('image/jpeg', 0.8);
        resolve({
          timestamp,
          dataUrl,
          isKeyFrame: false
        });
      };
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