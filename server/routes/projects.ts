import { Request, Response, Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../auth";

export function projectsRouter() {
  const router = Router();

  // Get all projects for the authenticated user
  router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const userProjects = await storage.getProjects(req.user!.id);
      
      // Add channel data to each project
      const projectsWithChannels = await Promise.all(
        userProjects.map(async (project) => {
          const channel = await storage.getChannelById(project.channelId);
          return {
            project,
            channel,
            template: null // Templates not implemented in storage yet
          };
        })
      );

      res.json(projectsWithChannels);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get a single project by ID
  router.get("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(req.params.id, req.user!.id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const channel = await storage.getChannelById(project.channelId);
      
      res.json({
        project,
        channel,
        template: null
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create a new project
  router.post("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, channelId, templateId, config, assets } = req.body;

      if (!name || !channelId) {
        return res.status(400).json({ error: "Name and channel are required" });
      }

      const newProject = await storage.createProject({
        name,
        userId: req.user!.id,
        channelId,
        templateId,
        config: config || {
          headline: "",
          subheadline: "",
          ctaText: "Play Now",
          colors: { text: "#000000", primary: "#fbbf24" },
          gameSettings: {},
          dimensions: { width: 1080, height: 1920 },
        },
        assets: assets || {},
      });

      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update a project
  router.put("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, config, assets, status } = req.body;

      const updates: any = {};
      if (name) updates.name = name;
      if (config) updates.config = config;
      if (assets) updates.assets = assets;
      if (status) updates.status = status;

      const updatedProject = await storage.updateProject(
        req.params.id,
        req.user!.id,
        updates
      );

      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete a project
  router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProject(req.params.id, req.user!.id);

      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return router;
}