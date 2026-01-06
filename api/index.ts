// Vercel Serverless Function Handler
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createServer } from 'http';

// Import server modules using relative paths
import { registerRoutes } from '../server/routes';

// Set environment variables
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

// Create Express app once
const app = express();
const httpServer = createServer(app);

// Configure middleware
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Initialize routes once
let initialized = false;
const initPromise = registerRoutes(httpServer, app).then(() => {
  initialized = true;
  console.log('Routes initialized for Vercel');
}).catch((error) => {
  console.error('Failed to initialize routes:', error);
  throw error;
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure routes are initialized
  if (!initialized) {
    await initPromise;
  }

  // Return a promise that resolves when Express finishes handling the request
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        console.error('Handler error:', err);
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}