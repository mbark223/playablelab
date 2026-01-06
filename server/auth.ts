import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Extend Express Request type to include user
declare module "express" {
  interface Request {
    user?: {
      id: string;
      username: string;
    };
  }
}

// Simple auth middleware - in production you'd use proper sessions/JWT
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // For testing, we'll create a demo user if needed and use it
  // In production, this should be replaced with proper authentication
  const testUserId = "demo-user-id";
  
  try {
    let user = await storage.getUser(testUserId);
    
    if (!user) {
      // Create a demo user for testing
      user = await storage.createUser({
        username: "demo",
        password: "demo-password" // In production, this would be hashed
      });
      console.log("Created demo user for testing:", user.username);
    }

    req.user = {
      id: user.id,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}