import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Use PostgreSQL if DATABASE_URL is set, otherwise fall back to SQLite
let db: any;

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool);
} else {
  // Use SQLite for local development
  const { db: sqliteDb } = require('./db-sqlite');
  db = sqliteDb;
}

export { db };