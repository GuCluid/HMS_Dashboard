# Dynamics 365 Monitor - Deployment to Netlify

This document provides instructions for deploying the Dynamics 365 Monitoring Dashboard to Netlify for permanent hosting.

## Prerequisites

- Netlify account
- GitHub account (optional, for continuous deployment)

## Deployment Steps

### 1. Prepare the Repository for Netlify

1. Create a `netlify.toml` file in the root directory:

```toml
[build]
  base = "src/frontend"
  publish = "build"
  command = "npm install --legacy-peer-deps && npm run build"

[build.environment]
  NODE_VERSION = "16"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Create a simplified backend for demo purposes (if needed)

### 2. Deploy to Netlify

#### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git" or "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - Build command: `cd src/frontend && npm install --legacy-peer-deps && npm run build`
   - Publish directory: `src/frontend/build`
6. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```

4. Deploy the site:
   ```bash
   netlify deploy --prod
   ```

### 3. Configure Environment Variables

In the Netlify UI:

1. Go to Site settings > Build & deploy > Environment
2. Add the following environment variables:
   - `REACT_APP_API_URL`: URL of your backend API
   - `REACT_APP_AUTH_REDIRECT_URI`: Authentication redirect URI
   - `REACT_APP_ENVIRONMENT`: Set to "production"

### 4. Set Up Custom Domain (Optional)

1. In the Netlify UI, go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter your domain name and follow the instructions
4. Netlify will automatically provision an SSL certificate

## Backend Deployment Options

Since Netlify only hosts static sites, you'll need to deploy the backend separately:

### Option 1: Deploy Backend to Heroku

1. Create a Heroku account
2. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

3. Login to Heroku:
   ```bash
   heroku login
   ```

4. Create a new Heroku app:
   ```bash
   heroku create dynamics365-monitor-api
   ```

5. Add a Procfile to the backend directory:
   ```
   web: node server.js
   ```

6. Deploy the backend:
   ```bash
   cd src/backend
   git init
   heroku git:remote -a dynamics365-monitor-api
   git add .
   git commit -m "Initial backend deployment"
   git push heroku master
   ```

7. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your_session_secret
   # Add other environment variables as needed
   ```

### Option 2: Deploy Backend to DigitalOcean App Platform

1. Create a DigitalOcean account
2. Create a new App
3. Connect your repository
4. Configure as a Web Service
5. Set the run command to `node src/backend/server.js`
6. Add environment variables
7. Deploy the app

## Connecting Frontend to Backend

After deploying both frontend and backend:

1. Update the frontend environment variables in Netlify to point to your backend URL
2. Update the CORS configuration in the backend to allow requests from your Netlify domain

## Maintenance and Updates

### Continuous Deployment

Netlify automatically rebuilds and deploys your site when you push changes to your connected repository.

### Manual Deployment

To manually trigger a deployment:

```bash
netlify deploy --prod
```

## Troubleshooting

1. **Build failures**:
   - Check Netlify build logs
   - Ensure all dependencies are correctly installed
   - Verify environment variables are set correctly

2. **API connection issues**:
   - Check CORS configuration in backend
   - Verify API URL is correct in frontend environment variables
   - Test API endpoints directly to ensure they're working

3. **Authentication problems**:
   - Verify redirect URIs match your Netlify domain
   - Check Azure AD configuration

For additional support, please contact your implementation partner.
