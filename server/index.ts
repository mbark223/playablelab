// Main server entry point for development and production (non-Vercel)
import { createApp, initializeApp } from "./app";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const { app, httpServer } = createApp();

// Initialize and start the server
initializeApp(app, httpServer).then(async () => {
  // Setup Vite in development
  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }
  
  // Start listening
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, () => {
    log(`serving on port ${port}`);
  });
}).catch((error) => {
  console.error("Failed to initialize server:", error);
  process.exit(1);
});