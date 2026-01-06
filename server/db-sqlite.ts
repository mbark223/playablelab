// Fallback SQLite database for local development when DATABASE_URL is not set
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

console.log('⚠️  Using SQLite for development. Set DATABASE_URL for PostgreSQL.');

const sqlite = new Database(':memory:'); // In-memory database
export const db = drizzle(sqlite);

// Initialize tables for SQLite
const initSQL = `
-- Simplified schema for SQLite
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  specs TEXT NOT NULL, -- JSON as text
  icon TEXT,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  channel_id TEXT NOT NULL REFERENCES channels(id),
  config TEXT NOT NULL, -- JSON as text
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  channel_id TEXT NOT NULL REFERENCES channels(id),
  template_id TEXT REFERENCES templates(id),
  config TEXT NOT NULL, -- JSON as text
  assets TEXT NOT NULL, -- JSON as text
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default channels
INSERT OR IGNORE INTO channels (name, slug, description, specs, icon, color) VALUES
  ('Meta Ads', 'meta', 'Facebook and Instagram ads', 
   '{"fileSize": {"max": 2, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}, {"width": 1080, "height": 1080, "aspectRatio": "1:1"}], "format": ["HTML5", "Single Index.html"], "requirements": ["No external resources", "All assets embedded", "Click-through URL support"]}',
   'facebook', 'bg-blue-600'),
  
  ('Snapchat', 'snapchat', 'Snapchat playable ads',
   '{"fileSize": {"max": 4, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}], "format": ["MRAID 2.0", "Playable Ad"], "requirements": ["MRAID compliant", "Portrait orientation only", "Auto-play support"]}',
   'ghost', 'bg-yellow-400'),
  
  ('DSP / Ad Networks', 'dsp', 'Programmatic ad networks',
   '{"fileSize": {"max": 5, "unit": "MB"}, "dimensions": [{"width": 320, "height": 480}, {"width": 768, "height": 1024}, {"width": 1080, "height": 1920}], "format": ["MRAID 2.0"], "requirements": ["Multiple size support", "MRAID 2.0 compliance", "Responsive design"]}',
   'globe', 'bg-purple-600'),
  
  ('Unity / AppLovin', 'unity', 'Unity Ads and AppLovin',
   '{"fileSize": {"max": 5, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}, {"width": 1920, "height": 1080, "aspectRatio": "16:9"}], "format": ["MRAID", "Custom Events"], "requirements": ["Custom event tracking", "Both orientations", "End card support"]}',
   'smartphone', 'bg-zinc-800');
`;

// Initialize the database
sqlite.exec(initSQL);
console.log('✅ SQLite database initialized with channels');