import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { projectsRouter } from "./routes/projects";
import { channelsRouter } from "./routes/channels";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register API routes
  app.use("/api/projects", projectsRouter());
  app.use("/api/channels", channelsRouter());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
