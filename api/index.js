// This file serves as a bridge for Vercel Serverless Functions
// It imports the Express app from the built server code

// Set VERCEL environment variable so the server knows to export instead of listen
process.env.VERCEL = '1';

// Import the built server application
const app = require('../dist/index.cjs');

// Export the Express app for Vercel to handle
module.exports = app;