const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Basic API routes for testing authentication
router.get('/user-info', (req, res) => {
  try {
    const userInfo = {
      displayName: req.user.profile.displayName,
      email: req.user.profile.emails?.[0] || '',
      id: req.user.profile.oid,
      roles: req.user.profile._json.roles || []
    };
    
    logger.info(`User info retrieved for: ${userInfo.displayName}`);
    res.json(userInfo);
  } catch (error) {
    logger.error(`Error retrieving user info: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve user information' });
  }
});

// Test connection to Dynamics 365
router.get('/test-dynamics-connection', async (req, res) => {
  try {
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for dynamics connection test`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken);
    
    // Test connection by getting organization info
    const response = await dynamicsClient.get('/api/data/v9.2/organizations');
    
    logger.info('Dynamics 365 connection test successful');
    res.json({ 
      success: true, 
      message: 'Successfully connected to Dynamics 365',
      organizationName: response.data.value[0]?.name || 'Unknown'
    });
  } catch (error) {
    logger.error(`Dynamics 365 connection test failed: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to Dynamics 365',
      details: error.message
    });
  }
});

// Get available environments
router.get('/environments', (req, res) => {
  try {
    // In a real implementation, this would come from configuration or database
    const environments = [
      {
        id: 'prod',
        name: 'Production',
        url: 'https://cluid-prod.crm4.dynamics.com/'
      },
      {
        id: 'preprod',
        name: 'Preprod',
        url: 'https://cluid-preprod.crm4.dynamics.com/'
      },
      {
        id: 'uat',
        name: 'UAT',
        url: 'https://cluid-uat.crm4.dynamics.com/'
      }
    ];
    
    logger.info('Environments list retrieved');
    res.json(environments);
  } catch (error) {
    logger.error(`Error retrieving environments: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve environments' });
  }
});

module.exports = router;
