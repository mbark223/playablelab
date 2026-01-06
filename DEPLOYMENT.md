# Vercel Deployment Guide

This guide explains how to deploy your Playable Maker application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. A PostgreSQL database (you can use Vercel Postgres, Supabase, Neon, or any PostgreSQL provider)

## Environment Variables

Before deploying, you need to set up the following environment variables in your Vercel project:

- `DATABASE_URL` - Your PostgreSQL connection string (required)
- `NODE_ENV` - Set to "production" for production deployments
- `PORT` - This will be automatically set by Vercel (do not override)

## Deployment Steps

### 1. Link Your Project to Vercel

```bash
vercel link
```

Follow the prompts to link your local project to a Vercel project.

### 2. Set Environment Variables

You can set environment variables through the Vercel dashboard or using the CLI:

```bash
# Set DATABASE_URL
vercel env add DATABASE_URL

# Set NODE_ENV for production
vercel env add NODE_ENV production
```

### 3. Deploy to Production

```bash
vercel --prod
```

This will:
1. Build your application using `npm run build`
2. Deploy the static files from `dist/public`
3. Set up the API routes from the Express server

### 4. Database Setup

After deployment, you need to push your database schema:

```bash
npm run db:push
```

Make sure your `DATABASE_URL` environment variable is set correctly.

## Project Structure for Vercel

The project has been configured for Vercel deployment with:

- **vercel.json** - Configures build settings and routing
- **api/index.js** - Wrapper that exports the Express app for Vercel's serverless functions
- **server/index.ts** - Modified to export the app when running in Vercel environment

## Deployment Architecture

- **Static Assets**: Served from `dist/public` via Vercel's CDN
- **API Routes**: Handled by Express running as serverless functions
- **Database**: External PostgreSQL database (not hosted by Vercel)

## Troubleshooting

### Build Failures
- Check that all dependencies are in `dependencies` not `devDependencies`
- Verify that `npm run build` works locally

### API Routes Not Working
- Ensure the `api/index.js` file exists and properly exports the Express app
- Check that routes are prefixed with `/api/`

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your database allows connections from Vercel's IP addresses
- Ensure SSL is configured if required by your database provider

## Local Development

The application continues to work normally in local development:

```bash
npm run dev
```

The VERCEL environment variable is only set during Vercel deployments, so local development is unaffected.