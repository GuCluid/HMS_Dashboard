# Dynamics 365 Monitoring Dashboard - Deployment Guide

This guide provides instructions for deploying the Dynamics 365 Monitoring Dashboard in your environment.

## Prerequisites

- Node.js 14+ and npm 6+
- Access to Azure Portal for app registration
- Admin access to your Dynamics 365 environments

## Configuration Steps

### 1. Register Application in Azure AD

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Enter a name for your application (e.g., "Dynamics 365 Monitor")
5. Select "Accounts in this organizational directory only"
6. Set the redirect URI to `http://localhost:3000/auth/callback` for development or your production URL
7. Click "Register"
8. Note the Application (client) ID and Directory (tenant) ID
9. Under "Certificates & secrets", create a new client secret and note its value

### 2. Configure API Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Dynamics CRM"
4. Choose "Delegated permissions"
5. Select the following permissions:
   - user_impersonation
   - organization.read
   - organization.write
6. Click "Add permissions"
7. Click "Grant admin consent"

### 3. Configure Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production

# Azure AD Configuration
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
REDIRECT_URI=http://your-domain.com/auth/callback

# Dynamics 365 Environments
DYNAMICS_PROD_URL=https://cluid-prod.crm4.dynamics.com/
DYNAMICS_PREPROD_URL=https://cluid-preprod.crm4.dynamics.com/
DYNAMICS_UAT_URL=https://cluid-uat.crm4.dynamics.com/

# Session Configuration
SESSION_SECRET=your_random_session_secret

# MongoDB Connection (for storing historical data)
MONGODB_URI=mongodb://username:password@your-mongodb-server:27017/dynamics365monitor
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd src/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Build the Frontend

```bash
cd src/frontend
npm run build
```

### 6. Start the Server

```bash
cd src/backend
npm start
```

## Production Deployment Options

### Option 1: Deploy to Azure App Service

1. Create an Azure App Service
2. Configure environment variables in the App Service Configuration
3. Deploy the application using Azure DevOps, GitHub Actions, or the Azure CLI

### Option 2: Deploy to Docker

1. Build the Docker image using the provided Dockerfile
2. Push the image to your container registry
3. Deploy the container to your hosting environment

### Option 3: Deploy to On-Premises Server

1. Install Node.js on your server
2. Copy the application files to the server
3. Configure environment variables
4. Use PM2 or a similar process manager to run the application

## Monitoring and Maintenance

- Check the application logs regularly
- Monitor the MongoDB database size
- Update the application when new versions are released
- Rotate the Azure AD client secret periodically

## Security Considerations

- Ensure all communication uses HTTPS
- Implement IP restrictions if necessary
- Review and update API permissions regularly
- Implement proper backup procedures for the database

## Troubleshooting

If you encounter issues during deployment:

1. Check the application logs
2. Verify environment variables are correctly set
3. Ensure Azure AD permissions are properly configured
4. Confirm network connectivity to Dynamics 365 environments

For additional support, please contact your implementation partner.
