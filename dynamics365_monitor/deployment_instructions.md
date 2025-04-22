# Dynamics 365 Monitor - Deployment Instructions

This document provides instructions for deploying the Dynamics 365 Monitoring Dashboard as a permanent website.

## Deployment Options

### Option 1: Deploy using Docker (Recommended)

1. **Prerequisites**:
   - Docker and Docker Compose installed on your server
   - Domain name pointing to your server
   - SSL certificate for your domain

2. **Configuration**:
   - Update the `.env.production` file in the backend directory with your actual values
   - Update the `.env.production` file in the frontend directory with your domain

3. **Deployment Steps**:
   ```bash
   # Clone the repository to your server
   git clone https://your-repository-url/dynamics365-monitor.git
   cd dynamics365-monitor

   # Update environment variables
   cp src/backend/.env.production src/backend/.env
   cp src/frontend/.env.production src/frontend/.env
   
   # Edit the environment files with your actual values
   nano src/backend/.env
   nano src/frontend/.env

   # Build and start the containers
   docker-compose up -d --build
   ```

4. **Accessing the Dashboard**:
   - The dashboard will be available at http://your-server-ip:5000
   - Configure a reverse proxy (Nginx/Apache) to add SSL and serve it from your domain

### Option 2: Deploy to Azure App Service

1. **Prerequisites**:
   - Azure account
   - Azure CLI installed

2. **Configuration**:
   - Update the `.env.production` files with your Azure App Service URL

3. **Deployment Steps**:
   ```bash
   # Build the application
   cd src/frontend
   npm install --legacy-peer-deps
   npm run build
   cd ../backend
   npm install --legacy-peer-deps

   # Create Azure App Service
   az group create --name dynamics365-monitor-rg --location eastus
   az appservice plan create --name dynamics365-monitor-plan --resource-group dynamics365-monitor-rg --sku B1
   az webapp create --name your-app-name --resource-group dynamics365-monitor-rg --plan dynamics365-monitor-plan --runtime "NODE|16-lts"

   # Configure environment variables
   az webapp config appsettings set --resource-group dynamics365-monitor-rg --name your-app-name --settings @.env

   # Deploy the application
   az webapp deployment source config-local-git --name your-app-name --resource-group dynamics365-monitor-rg
   git remote add azure <git-url-from-previous-command>
   git add .
   git commit -m "Initial deployment"
   git push azure master
   ```

### Option 3: Deploy to Vercel or Netlify (Frontend) with Separate Backend

1. **Frontend Deployment (Vercel/Netlify)**:
   - Connect your GitHub repository to Vercel or Netlify
   - Configure build settings:
     - Build command: `cd src/frontend && npm install --legacy-peer-deps && npm run build`
     - Output directory: `src/frontend/build`
   - Set environment variables in the Vercel/Netlify dashboard

2. **Backend Deployment**:
   - Deploy the backend to a separate service like Heroku, DigitalOcean, or AWS
   - Update the frontend environment variables to point to your backend URL

## SSL Configuration

For production use, always configure SSL:

1. **Using Let's Encrypt with Nginx**:
   ```bash
   # Install Nginx and Certbot
   apt-get update
   apt-get install nginx certbot python3-certbot-nginx

   # Configure Nginx
   nano /etc/nginx/sites-available/dynamics365-monitor

   # Add the following configuration
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   # Enable the site
   ln -s /etc/nginx/sites-available/dynamics365-monitor /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx

   # Obtain SSL certificate
   certbot --nginx -d your-domain.com
   ```

## Maintenance and Updates

1. **Updating the Application**:
   ```bash
   # Pull the latest changes
   git pull

   # Rebuild and restart containers
   docker-compose down
   docker-compose up -d --build
   ```

2. **Monitoring Logs**:
   ```bash
   # View logs
   docker-compose logs -f
   ```

3. **Backup**:
   - Regularly backup your environment configuration files
   - If using a database, set up automated backups

## Troubleshooting

1. **Application not starting**:
   - Check logs: `docker-compose logs`
   - Verify environment variables are correctly set
   - Ensure ports are not blocked by firewall

2. **Authentication issues**:
   - Verify Azure AD configuration
   - Check redirect URIs match your domain
   - Ensure proper permissions are granted

3. **Performance issues**:
   - Consider scaling up your hosting resources
   - Optimize database queries
   - Implement caching strategies

For additional support, please contact your implementation partner.
