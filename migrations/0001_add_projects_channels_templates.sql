-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  specs JSONB NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  channel_id VARCHAR NOT NULL REFERENCES channels(id),
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  channel_id VARCHAR NOT NULL REFERENCES channels(id),
  template_id VARCHAR REFERENCES templates(id),
  config JSONB NOT NULL,
  assets JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_channel_id ON projects(channel_id);
CREATE INDEX idx_templates_channel_id ON templates(channel_id);

-- Insert default channels
INSERT INTO channels (id, name, slug, description, specs, icon, color) VALUES
  (gen_random_uuid(), 'Meta Ads', 'meta', 'Facebook and Instagram ads', 
   '{"fileSize": {"max": 2, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}, {"width": 1080, "height": 1080, "aspectRatio": "1:1"}], "format": ["HTML5", "Single Index.html"], "requirements": ["No external resources", "All assets embedded", "Click-through URL support"]}'::jsonb,
   'facebook', 'bg-blue-600'),
  
  (gen_random_uuid(), 'Snapchat', 'snapchat', 'Snapchat playable ads',
   '{"fileSize": {"max": 4, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}], "format": ["MRAID 2.0", "Playable Ad"], "requirements": ["MRAID compliant", "Portrait orientation only", "Auto-play support"]}'::jsonb,
   'ghost', 'bg-yellow-400'),
  
  (gen_random_uuid(), 'DSP / Ad Networks', 'dsp', 'Programmatic ad networks',
   '{"fileSize": {"max": 5, "unit": "MB"}, "dimensions": [{"width": 320, "height": 480}, {"width": 768, "height": 1024}, {"width": 1080, "height": 1920}], "format": ["MRAID 2.0"], "requirements": ["Multiple size support", "MRAID 2.0 compliance", "Responsive design"]}'::jsonb,
   'globe', 'bg-purple-600'),
  
  (gen_random_uuid(), 'Unity / AppLovin', 'unity', 'Unity Ads and AppLovin',
   '{"fileSize": {"max": 5, "unit": "MB"}, "dimensions": [{"width": 1080, "height": 1920, "aspectRatio": "9:16"}, {"width": 1920, "height": 1080, "aspectRatio": "16:9"}], "format": ["MRAID", "Custom Events"], "requirements": ["Custom event tracking", "Both orientations", "End card support"]}'::jsonb,
   'smartphone', 'bg-zinc-800');