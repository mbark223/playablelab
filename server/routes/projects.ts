import { Request, Response, Router } from "express";
import { db } from "../db";
import { projects, channels, templates } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../auth";

export function projectsRouter() {
  const router = Router();

  // Get all projects for the authenticated user
  router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const userProjects = await db
        .select({
          project: projects,
          channel: channels,
          template: templates,
        })
        .from(projects)
        .leftJoin(channels, eq(projects.channelId, channels.id))
        .leftJoin(templates, eq(projects.templateId, templates.id))
        .where(eq(projects.userId, req.user!.id))
        .orderBy(projects.createdAt);

      res.json(userProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get a single project by ID
  router.get("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const [project] = await db
        .select({
          project: projects,
          channel: channels,
          template: templates,
        })
        .from(projects)
        .leftJoin(channels, eq(projects.channelId, channels.id))
        .leftJoin(templates, eq(projects.templateId, templates.id))
        .where(
          and(
            eq(projects.id, req.params.id),
            eq(projects.userId, req.user!.id)
          )
        );

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
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

      const [newProject] = await db
        .insert(projects)
        .values({
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
        })
        .returning();

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

      const [updatedProject] = await db
        .update(projects)
        .set({
          ...(name && { name }),
          ...(config && { config }),
          ...(assets && { assets }),
          ...(status && { status }),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(projects.id, req.params.id),
            eq(projects.userId, req.user!.id)
          )
        )
        .returning();

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
      const [deletedProject] = await db
        .delete(projects)
        .where(
          and(
            eq(projects.id, req.params.id),
            eq(projects.userId, req.user!.id)
          )
        )
        .returning();

      if (!deletedProject) {
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