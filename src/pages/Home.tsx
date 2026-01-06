import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowRight, Clock, Star, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Assets
import runnerImg from '@assets/generated_images/mobile_runner_game_screenshot.png';
import puzzleImg from '@assets/generated_images/match-3_puzzle_game_screenshot.png';

export default function Home() {
  const projects = [
    { id: 1, name: "Nike Summer Campaign", type: "Endless Runner", date: "2 mins ago", status: "Draft", image: runnerImg },
    { id: 2, name: "Spotify Wrapped Quiz", type: "Interactive Quiz", date: "2 days ago", status: "Published", image: puzzleImg },
    { id: 3, name: "Coca-Cola Holiday", type: "Match-3 Puzzle", date: "1 week ago", status: "Published", image: null },
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, Alex</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your playable ads.</p>
          </div>
          <Link href="/create">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Campaigns", value: "12", trend: "+2 this week" },
            { label: "Total Impressions", value: "845K", trend: "+15% vs last month" },
            { label: "Avg. Engagement", value: "45s", trend: "+12s vs benchmark" }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-display">{stat.value}</span>
                  <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Recent Projects</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="h-40 bg-muted relative overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sidebar-accent to-background flex items-center justify-center">
                      <Star className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{project.date}</span>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full font-medium",
                      project.status === 'Published' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* New Project Card */}
            <Link href="/create">
              <div className="h-full min-h-[280px] bg-background border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-medium">Create New Project</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
