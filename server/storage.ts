import { type User, type InsertUser, type Channel, type Project, type InsertProject } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Channel methods
  getChannels(): Promise<Channel[]>;
  getChannelBySlug(slug: string): Promise<Channel | undefined>;
  getChannelById(id: string): Promise<Channel | undefined>;
  
  // Project methods
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private channels: Map<string, Channel>;
  private projects: Map<string, Project>;

  constructor() {
    this.users = new Map();
    this.channels = new Map();
    this.projects = new Map();
    
    // Initialize default channels
    this.initializeChannels();
  }
  
  private initializeChannels() {
    const defaultChannels: Channel[] = [
      {
        id: randomUUID(),
        name: 'Meta Ads',
        slug: 'meta',
        description: 'Facebook and Instagram ads',
        specs: {
          fileSize: { max: 2, unit: 'MB' },
          dimensions: [
            { width: 1080, height: 1920, aspectRatio: '9:16' },
            { width: 1080, height: 1080, aspectRatio: '1:1' }
          ],
          format: ['HTML5', 'Single Index.html'],
          requirements: ['No external resources', 'All assets embedded', 'Click-through URL support']
        },
        icon: 'facebook',
        color: 'bg-blue-600',
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Snapchat',
        slug: 'snapchat',
        description: 'Snapchat playable ads',
        specs: {
          fileSize: { max: 4, unit: 'MB' },
          dimensions: [{ width: 1080, height: 1920, aspectRatio: '9:16' }],
          format: ['MRAID 2.0', 'Playable Ad'],
          requirements: ['MRAID compliant', 'Portrait orientation only', 'Auto-play support']
        },
        icon: 'ghost',
        color: 'bg-yellow-400',
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'DSP / Ad Networks',
        slug: 'dsp',
        description: 'Programmatic ad networks',
        specs: {
          fileSize: { max: 5, unit: 'MB' },
          dimensions: [
            { width: 320, height: 480 },
            { width: 768, height: 1024 },
            { width: 1080, height: 1920 }
          ],
          format: ['MRAID 2.0'],
          requirements: ['Multiple size support', 'MRAID 2.0 compliance', 'Responsive design']
        },
        icon: 'globe',
        color: 'bg-purple-600',
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Unity / AppLovin',
        slug: 'unity',
        description: 'Unity Ads and AppLovin',
        specs: {
          fileSize: { max: 5, unit: 'MB' },
          dimensions: [
            { width: 1080, height: 1920, aspectRatio: '9:16' },
            { width: 1920, height: 1080, aspectRatio: '16:9' }
          ],
          format: ['MRAID', 'Custom Events'],
          requirements: ['Custom event tracking', 'Both orientations', 'End card support']
        },
        icon: 'smartphone',
        color: 'bg-zinc-800',
        createdAt: new Date()
      }
    ];
    
    defaultChannels.forEach(channel => {
      this.channels.set(channel.id, channel);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Channel methods
  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }
  
  async getChannelBySlug(slug: string): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(ch => ch.slug === slug);
  }
  
  async getChannelById(id: string): Promise<Channel | undefined> {
    return this.channels.get(id);
  }
  
  // Project methods
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getProject(id: string, userId: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    return project && project.userId === userId ? project : undefined;
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      status: insertProject.status || 'draft',
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = await this.getProject(id, userId);
    if (!project) return undefined;
    
    const updated = {
      ...project,
      ...updates,
      id: project.id, // Ensure ID can't be changed
      userId: project.userId, // Ensure user can't be changed
      updatedAt: new Date()
    };
    
    this.projects.set(id, updated);
    return updated;
  }
  
  async deleteProject(id: string, userId: string): Promise<boolean> {
    const project = await this.getProject(id, userId);
    if (!project) return false;
    
    this.projects.delete(id);
    return true;
  }
}

export const storage = new MemStorage();
