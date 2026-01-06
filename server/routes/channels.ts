import { Request, Response, Router } from "express";
import { storage } from "../storage";

export function channelsRouter() {
  const router = Router();

  // Get all available channels
  router.get("/", async (_req: Request, res: Response) => {
    try {
      console.log("Fetching channels from storage...");
      const allChannels = await storage.getChannels();
      console.log(`Found ${allChannels.length} channels`);
      res.json(allChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ 
        error: "Failed to fetch channels",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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