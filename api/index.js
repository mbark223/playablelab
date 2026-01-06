// Vercel serverless function handler
// This file serves as the entry point for all API routes in Vercel

const express = require('express');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Import routes directly
const { channelsRouter } = require('../dist/server/routes/channels.js');
const { projectsRouter } = require('../dist/server/routes/projects.js');

// Register routes
app.use('/api/channels', channelsRouter());
app.use('/api/projects', projectsRouter());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export for Vercel
module.exports = app;