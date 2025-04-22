# Dynamics 365 Monitor - Vercel Deployment

This document provides instructions for deploying the Dynamics 365 Monitoring Dashboard to Vercel for permanent hosting.

## Prerequisites

- Vercel account
- GitHub account (optional, for continuous deployment)

## Deployment Steps

### 1. Prepare the Repository for Vercel

1. Create a `vercel.json` file in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/src/frontend/build/index.html" }
  ]
}
```

2. Update the frontend package.json build script if needed

### 2. Deploy to Vercel

#### Option 1: Deploy via Vercel UI

1. Log in to your Vercel account
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - Framework Preset: Other
   - Root Directory: src/frontend
   - Build Command: npm install --legacy-peer-deps && npm run build
   - Output Directory: build
5. Add environment variables:
   - REACT_APP_API_URL: URL of your backend API
   - REACT_APP_AUTH_REDIRECT_URI: Authentication redirect URI
   - REACT_APP_ENVIRONMENT: production
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Follow the CLI prompts to configure your project

### 3. Set Up Custom Domain

1. In the Vercel dashboard, go to your project
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings
5. Vercel will automatically provision an SSL certificate

## Backend Deployment Options

Since Vercel primarily hosts frontend applications, you'll need to deploy the backend separately:

### Option 1: Deploy Backend to Vercel Serverless Functions

For simple backends, you can use Vercel Serverless Functions:

1. Create an `api` directory in your project root
2. Create serverless functions in this directory
3. Update your frontend to use these API endpoints

### Option 2: Deploy Backend to a Separate Service

Follow the instructions in the main deployment guide for deploying the backend to:
- Heroku
- DigitalOcean App Platform
- Azure App Service
- AWS Elastic Beanstalk

## Connecting Frontend to Backend

After deploying both frontend and backend:

1. Update the frontend environment variables in Vercel to point to your backend URL
2. Update the CORS configuration in the backend to allow requests from your Vercel domain

## Maintenance and Updates

### Continuous Deployment

Vercel automatically rebuilds and deploys your site when you push changes to your connected repository.

### Manual Deployment

To manually trigger a deployment:

```bash
vercel --prod
```

## Monitoring and Analytics

Vercel provides built-in analytics and monitoring:

1. Go to your project dashboard
2. Click on "Analytics" to view:
   - Visitors
   - Page views
   - Performance metrics
   - Error rates

## Troubleshooting

1. **Build failures**:
   - Check Vercel build logs
   - Ensure all dependencies are correctly installed
   - Verify environment variables are set correctly

2. **API connection issues**:
   - Check CORS configuration in backend
   - Verify API URL is correct in frontend environment variables
   - Test API endpoints directly to ensure they're working

3. **Authentication problems**:
   - Verify redirect URIs match your Vercel domain
   - Check Azure AD configuration

For additional support, please contact your implementation partner.
