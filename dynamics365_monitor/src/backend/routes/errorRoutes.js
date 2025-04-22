const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Get all errors for a specific environment
router.get('/:environment/errors', async (req, res) => {
  try {
    const { environment } = req.params;
    const { severity, type, timeRange } = req.query;
    
    logger.info(`Fetching errors for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for error monitoring`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockErrors = [
      {
        id: 1,
        timestamp: '2025-04-22T08:15:23Z',
        type: 'API Error',
        message: 'Failed to retrieve entity data',
        source: 'EntityDataService',
        severity: 'High',
        count: 5,
        stackTrace: 'Error: Failed to retrieve entity data\n  at EntityDataService.getEntityData (/app/services/entityService.js:45:23)\n  at async Router.get (/app/routes/entityRoutes.js:12:25)'
      },
      {
        id: 2,
        timestamp: '2025-04-22T07:45:12Z',
        type: 'Database Error',
        message: 'Query timeout exceeded',
        source: 'DatabaseQueryService',
        severity: 'Medium',
        count: 3,
        stackTrace: 'Error: Query timeout exceeded\n  at DatabaseQueryService.executeQuery (/app/services/databaseService.js:78:12)\n  at async Router.get (/app/routes/dataRoutes.js:34:18)'
      },
      {
        id: 3,
        timestamp: '2025-04-22T06:30:45Z',
        type: 'Integration Error',
        message: 'DocuSign API connection failed',
        source: 'DocuSignIntegration',
        severity: 'High',
        count: 2,
        stackTrace: 'Error: DocuSign API connection failed\n  at DocuSignService.connect (/app/integrations/docusign.js:112:9)\n  at async Router.post (/app/routes/documentRoutes.js:56:22)'
      },
      {
        id: 4,
        timestamp: '2025-04-21T22:12:33Z',
        type: 'Authentication Error',
        message: 'Token validation failed',
        source: 'AuthService',
        severity: 'Medium',
        count: 1,
        stackTrace: 'Error: Token validation failed\n  at AuthService.validateToken (/app/services/authService.js:201:15)\n  at middleware (/app/middleware/auth.js:23:19)'
      },
      {
        id: 5,
        timestamp: '2025-04-21T18:05:19Z',
        type: 'Validation Error',
        message: 'Required field missing',
        source: 'FormValidation',
        severity: 'Low',
        count: 8,
        stackTrace: 'Error: Required field missing\n  at validateForm (/app/utils/validation.js:45:11)\n  at Router.post (/app/routes/formRoutes.js:28:14)'
      }
    ];
    
    // Apply filters if provided
    let filteredErrors = [...mockErrors];
    
    if (severity && severity !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.severity === severity);
    }
    
    if (type && type !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.type === type);
    }
    
    if (timeRange) {
      const now = new Date();
      let cutoffDate;
      
      switch (timeRange) {
        case '1h':
          cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to 24h
      }
      
      filteredErrors = filteredErrors.filter(error => new Date(error.timestamp) >= cutoffDate);
    }
    
    logger.info(`Returning ${filteredErrors.length} errors for environment: ${environment}`);
    res.json(filteredErrors);
  } catch (error) {
    logger.error(`Error fetching errors: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch errors',
      details: error.message
    });
  }
});

// Get error details by ID
router.get('/:environment/errors/:id', async (req, res) => {
  try {
    const { environment, id } = req.params;
    
    logger.info(`Fetching error details for ID: ${id} in environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for error details`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockErrors = [
      {
        id: 1,
        timestamp: '2025-04-22T08:15:23Z',
        type: 'API Error',
        message: 'Failed to retrieve entity data',
        source: 'EntityDataService',
        severity: 'High',
        count: 5,
        stackTrace: 'Error: Failed to retrieve entity data\n  at EntityDataService.getEntityData (/app/services/entityService.js:45:23)\n  at async Router.get (/app/routes/entityRoutes.js:12:25)',
        affectedUsers: ['user1@example.com', 'user2@example.com'],
        affectedComponents: ['Entity Service', 'Data Retrieval'],
        resolution: null,
        status: 'Active'
      },
      {
        id: 2,
        timestamp: '2025-04-22T07:45:12Z',
        type: 'Database Error',
        message: 'Query timeout exceeded',
        source: 'DatabaseQueryService',
        severity: 'Medium',
        count: 3,
        stackTrace: 'Error: Query timeout exceeded\n  at DatabaseQueryService.executeQuery (/app/services/databaseService.js:78:12)\n  at async Router.get (/app/routes/dataRoutes.js:34:18)',
        affectedUsers: ['admin@example.com'],
        affectedComponents: ['Database Service', 'Query Engine'],
        resolution: null,
        status: 'Active'
      },
      {
        id: 3,
        timestamp: '2025-04-22T06:30:45Z',
        type: 'Integration Error',
        message: 'DocuSign API connection failed',
        source: 'DocuSignIntegration',
        severity: 'High',
        count: 2,
        stackTrace: 'Error: DocuSign API connection failed\n  at DocuSignService.connect (/app/integrations/docusign.js:112:9)\n  at async Router.post (/app/routes/documentRoutes.js:56:22)',
        affectedUsers: ['user3@example.com', 'user4@example.com'],
        affectedComponents: ['DocuSign Integration', 'Document Service'],
        resolution: null,
        status: 'Active'
      },
      {
        id: 4,
        timestamp: '2025-04-21T22:12:33Z',
        type: 'Authentication Error',
        message: 'Token validation failed',
        source: 'AuthService',
        severity: 'Medium',
        count: 1,
        stackTrace: 'Error: Token validation failed\n  at AuthService.validateToken (/app/services/authService.js:201:15)\n  at middleware (/app/middleware/auth.js:23:19)',
        affectedUsers: ['user5@example.com'],
        affectedComponents: ['Authentication Service', 'Token Validation'],
        resolution: 'Token validation logic updated to handle expired tokens correctly',
        status: 'Resolved'
      },
      {
        id: 5,
        timestamp: '2025-04-21T18:05:19Z',
        type: 'Validation Error',
        message: 'Required field missing',
        source: 'FormValidation',
        severity: 'Low',
        count: 8,
        stackTrace: 'Error: Required field missing\n  at validateForm (/app/utils/validation.js:45:11)\n  at Router.post (/app/routes/formRoutes.js:28:14)',
        affectedUsers: ['user6@example.com', 'user7@example.com', 'user8@example.com'],
        affectedComponents: ['Form Validation', 'UI Components'],
        resolution: 'Form validation updated to provide clearer error messages',
        status: 'Resolved'
      }
    ];
    
    const error = mockErrors.find(e => e.id === parseInt(id));
    
    if (!error) {
      logger.warn(`Error with ID ${id} not found in environment: ${environment}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Error not found'
      });
    }
    
    logger.info(`Returning error details for ID: ${id} in environment: ${environment}`);
    res.json(error);
  } catch (error) {
    logger.error(`Error fetching error details: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch error details',
      details: error.message
    });
  }
});

// Get error statistics
router.get('/:environment/error-stats', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange } = req.query;
    
    logger.info(`Fetching error statistics for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for error statistics`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockStats = {
      totalErrors: 19,
      activeErrors: 11,
      resolvedErrors: 8,
      errorsByType: {
        'API Error': 5,
        'Database Error': 3,
        'Integration Error': 4,
        'Authentication Error': 2,
        'Validation Error': 5
      },
      errorsBySeverity: {
        'High': 7,
        'Medium': 6,
        'Low': 6
      },
      errorTrend: [
        { date: '2025-04-16', count: 2 },
        { date: '2025-04-17', count: 1 },
        { date: '2025-04-18', count: 3 },
        { date: '2025-04-19', count: 2 },
        { date: '2025-04-20', count: 4 },
        { date: '2025-04-21', count: 3 },
        { date: '2025-04-22', count: 4 }
      ]
    };
    
    logger.info(`Returning error statistics for environment: ${environment}`);
    res.json(mockStats);
  } catch (error) {
    logger.error(`Error fetching error statistics: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch error statistics',
      details: error.message
    });
  }
});

module.exports = router;
