import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

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
  // For now, we'll use a simple header-based auth
  // In production, this should be replaced with proper authentication
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
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