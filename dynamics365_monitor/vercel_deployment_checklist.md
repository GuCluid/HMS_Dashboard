# Vercel Deployment Checklist

Use this checklist to ensure you've completed all steps for deploying the Dynamics 365 Monitor dashboard to Vercel.

## Account Setup
- [ ] Create Vercel account
- [ ] Connect GitHub/GitLab/Bitbucket account
- [ ] Create Heroku account (for backend)
- [ ] Install Heroku CLI

## Repository Preparation
- [ ] Ensure code is in a Git repository
- [ ] Verify project structure (frontend in /src/frontend, backend in /src/backend)
- [ ] Confirm vercel.json is in root directory
- [ ] Create Procfile for Heroku backend

## Frontend Deployment (Vercel)
- [ ] Import repository to Vercel
- [ ] Configure build settings:
  - [ ] Root Directory: src/frontend
  - [ ] Build Command: npm install --legacy-peer-deps && npm run build
  - [ ] Output Directory: build
- [ ] Set environment variables:
  - [ ] REACT_APP_API_URL
  - [ ] REACT_APP_AUTH_REDIRECT_URI
  - [ ] REACT_APP_ENVIRONMENT
- [ ] Deploy frontend
- [ ] Verify frontend deployment

## Backend Deployment (Heroku)
- [ ] Create Heroku app
- [ ] Initialize Git repository in backend directory
- [ ] Connect to Heroku remote
- [ ] Deploy backend to Heroku
- [ ] Set environment variables:
  - [ ] NODE_ENV
  - [ ] SESSION_SECRET
  - [ ] AZURE_AD_CLIENT_ID
  - [ ] AZURE_AD_CLIENT_SECRET
  - [ ] AZURE_AD_TENANT_ID
  - [ ] REDIRECT_URI
- [ ] Configure CORS for Vercel domain

## Integration
- [ ] Update frontend API URL to point to Heroku backend
- [ ] Update authentication redirect URI
- [ ] Redeploy frontend with updated variables
- [ ] Test complete application flow

## Optional Configuration
- [ ] Set up custom domain
- [ ] Configure SSL
- [ ] Set up monitoring and alerts
- [ ] Configure continuous deployment

## Testing
- [ ] Test authentication
- [ ] Test error monitoring module
- [ ] Test database monitoring module
- [ ] Test integration monitoring module
- [ ] Test activity monitoring module
- [ ] Test environment switching (Prod/Preprod/UAT)
