// Vercel Serverless Function Handler
import { createApp, initializeApp } from "../server/app";

// Set environment variables
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

// Create Express app
const { app, httpServer } = createApp();

// Initialize routes
let routesInitialized = false;
const initPromise = initializeApp(app, httpServer).then(() => {
  routesInitialized = true;
  console.log("Vercel handler initialized successfully");
}).catch((error) => {
  console.error("Failed to initialize Vercel handler:", error);
  throw error;
});

// Export the handler for Vercel
export default async function handler(req: any, res: any) {
  if (!routesInitialized) {
    await initPromise;
  }
  return app(req, res);
}