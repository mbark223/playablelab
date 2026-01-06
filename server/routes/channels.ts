import { Request, Response, Router } from "express";
import { storage } from "../storage";

export function channelsRouter() {
  const router = Router();

  // Get all available channels
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const allChannels = await storage.getChannels();
      res.json(allChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  // Get a single channel by slug
  router.get("/:slug", async (req: Request, res: Response) => {
    try {
      const channel = await storage.getChannelBySlug(req.params.slug);

      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }

      res.json(channel);
    } catch (error) {
      console.error("Error fetching channel:", error);
      res.status(500).json({ error: "Failed to fetch channel" });
    }
  });

  return router;
}