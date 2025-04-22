const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Get database performance metrics for a specific environment
router.get('/:environment/database/performance', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange } = req.query;
    
    logger.info(`Fetching database performance metrics for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for database performance metrics`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockPerformanceData = {
      overallPerformance: 87,
      responseTime: {
        average: 245, // in milliseconds
        min: 120,
        max: 890,
        trend: [
          { timestamp: '2025-04-16T00:00:00Z', value: 230 },
          { timestamp: '2025-04-17T00:00:00Z', value: 245 },
          { timestamp: '2025-04-18T00:00:00Z', value: 260 },
          { timestamp: '2025-04-19T00:00:00Z', value: 280 },
          { timestamp: '2025-04-20T00:00:00Z', value: 270 },
          { timestamp: '2025-04-21T00:00:00Z', value: 250 },
          { timestamp: '2025-04-22T00:00:00Z', value: 245 }
        ]
      },
      cpuUsage: {
        current: 42, // percentage
        average: 38,
        peak: 78,
        trend: [
          { timestamp: '2025-04-16T00:00:00Z', value: 35 },
          { timestamp: '2025-04-17T00:00:00Z', value: 38 },
          { timestamp: '2025-04-18T00:00:00Z', value: 42 },
          { timestamp: '2025-04-19T00:00:00Z', value: 78 },
          { timestamp: '2025-04-20T00:00:00Z', value: 45 },
          { timestamp: '2025-04-21T00:00:00Z', value: 40 },
          { timestamp: '2025-04-22T00:00:00Z', value: 42 }
        ]
      },
      memoryUsage: {
        current: 65, // percentage
        average: 62,
        peak: 85,
        trend: [
          { timestamp: '2025-04-16T00:00:00Z', value: 60 },
          { timestamp: '2025-04-17T00:00:00Z', value: 62 },
          { timestamp: '2025-04-18T00:00:00Z', value: 65 },
          { timestamp: '2025-04-19T00:00:00Z', value: 85 },
          { timestamp: '2025-04-20T00:00:00Z', value: 70 },
          { timestamp: '2025-04-21T00:00:00Z', value: 65 },
          { timestamp: '2025-04-22T00:00:00Z', value: 65 }
        ]
      },
      diskIO: {
        readRate: 12.5, // MB/s
        writeRate: 8.2, // MB/s
        trend: [
          { timestamp: '2025-04-16T00:00:00Z', read: 10.2, write: 7.5 },
          { timestamp: '2025-04-17T00:00:00Z', read: 11.5, write: 7.8 },
          { timestamp: '2025-04-18T00:00:00Z', read: 12.0, write: 8.0 },
          { timestamp: '2025-04-19T00:00:00Z', read: 14.5, write: 9.2 },
          { timestamp: '2025-04-20T00:00:00Z', read: 13.2, write: 8.5 },
          { timestamp: '2025-04-21T00:00:00Z', read: 12.8, write: 8.3 },
          { timestamp: '2025-04-22T00:00:00Z', read: 12.5, write: 8.2 }
        ]
      },
      connectionCount: {
        current: 125,
        average: 118,
        peak: 210,
        trend: [
          { timestamp: '2025-04-16T00:00:00Z', value: 110 },
          { timestamp: '2025-04-17T00:00:00Z', value: 115 },
          { timestamp: '2025-04-18T00:00:00Z', value: 120 },
          { timestamp: '2025-04-19T00:00:00Z', value: 210 },
          { timestamp: '2025-04-20T00:00:00Z', value: 140 },
          { timestamp: '2025-04-21T00:00:00Z', value: 130 },
          { timestamp: '2025-04-22T00:00:00Z', value: 125 }
        ]
      }
    };
    
    logger.info(`Returning database performance metrics for environment: ${environment}`);
    res.json(mockPerformanceData);
  } catch (error) {
    logger.error(`Error fetching database performance metrics: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch database performance metrics',
      details: error.message
    });
  }
});

// Get slow queries for a specific environment
router.get('/:environment/database/slow-queries', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange, threshold } = req.query;
    
    logger.info(`Fetching slow queries for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for slow queries`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockSlowQueries = [
      {
        id: 1,
        timestamp: '2025-04-22T07:15:23Z',
        query: 'SELECT * FROM Account WHERE CreatedOn > @date AND StatusCode = @status',
        duration: 4250, // milliseconds
        table: 'Account',
        user: 'admin@example.com',
        parameters: 'date=2024-01-01, status=1'
      },
      {
        id: 2,
        timestamp: '2025-04-22T06:45:12Z',
        query: 'SELECT Contact.*, Account.Name FROM Contact INNER JOIN Account ON Contact.AccountId = Account.AccountId WHERE Contact.EmailAddress LIKE @email',
        duration: 3850, // milliseconds
        table: 'Contact, Account',
        user: 'user1@example.com',
        parameters: 'email=%example.com%'
      },
      {
        id: 3,
        timestamp: '2025-04-21T22:30:45Z',
        query: 'SELECT * FROM Opportunity WHERE EstimatedCloseDate BETWEEN @startDate AND @endDate ORDER BY EstimatedValue DESC',
        duration: 5120, // milliseconds
        table: 'Opportunity',
        user: 'user2@example.com',
        parameters: 'startDate=2025-01-01, endDate=2025-12-31'
      },
      {
        id: 4,
        timestamp: '2025-04-21T18:12:33Z',
        query: 'SELECT COUNT(*) FROM ActivityPointer WHERE RegardingObjectId = @id AND ActivityTypeCode IN @types',
        duration: 3250, // milliseconds
        table: 'ActivityPointer',
        user: 'user3@example.com',
        parameters: 'id=12345, types=(4,5,10)'
      },
      {
        id: 5,
        timestamp: '2025-04-20T15:05:19Z',
        query: 'SELECT * FROM SystemUser su INNER JOIN TeamMembership tm ON su.SystemUserId = tm.SystemUserId WHERE tm.TeamId = @teamId',
        duration: 2950, // milliseconds
        table: 'SystemUser, TeamMembership',
        user: 'admin@example.com',
        parameters: 'teamId=67890'
      }
    ];
    
    logger.info(`Returning ${mockSlowQueries.length} slow queries for environment: ${environment}`);
    res.json(mockSlowQueries);
  } catch (error) {
    logger.error(`Error fetching slow queries: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch slow queries',
      details: error.message
    });
  }
});

// Get database deadlocks for a specific environment
router.get('/:environment/database/deadlocks', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange } = req.query;
    
    logger.info(`Fetching database deadlocks for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for database deadlocks`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockDeadlocks = [
      {
        id: 1,
        timestamp: '2025-04-22T05:15:23Z',
        processId: 'Process_123',
        victimProcessId: 'Process_456',
        resource: 'Account',
        duration: 450, // milliseconds
        lockType: 'Update',
        victimLockType: 'Shared',
        user: 'user1@example.com',
        victimUser: 'user2@example.com'
      },
      {
        id: 2,
        timestamp: '2025-04-21T14:45:12Z',
        processId: 'Process_789',
        victimProcessId: 'Process_101',
        resource: 'Contact',
        duration: 380, // milliseconds
        lockType: 'Exclusive',
        victimLockType: 'Update',
        user: 'admin@example.com',
        victimUser: 'user3@example.com'
      },
      {
        id: 3,
        timestamp: '2025-04-20T09:30:45Z',
        processId: 'Process_112',
        victimProcessId: 'Process_131',
        resource: 'Opportunity',
        duration: 520, // milliseconds
        lockType: 'Update',
        victimLockType: 'Update',
        user: 'user4@example.com',
        victimUser: 'user5@example.com'
      }
    ];
    
    logger.info(`Returning ${mockDeadlocks.length} deadlocks for environment: ${environment}`);
    res.json(mockDeadlocks);
  } catch (error) {
    logger.error(`Error fetching database deadlocks: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch database deadlocks',
      details: error.message
    });
  }
});

// Get database storage usage for a specific environment
router.get('/:environment/database/storage', async (req, res) => {
  try {
    const { environment } = req.params;
    
    logger.info(`Fetching database storage usage for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for database storage usage`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockStorageData = {
      totalStorage: 1024, // GB
      usedStorage: 768, // GB
      availableStorage: 256, // GB
      usagePercentage: 75,
      storageByEntity: [
        { entity: 'Account', size: 120, percentage: 15.6 },
        { entity: 'Contact', size: 95, percentage: 12.4 },
        { entity: 'Opportunity', size: 85, percentage: 11.1 },
        { entity: 'Email', size: 180, percentage: 23.4 },
        { entity: 'Attachment', size: 210, percentage: 27.3 },
        { entity: 'Other', size: 78, percentage: 10.2 }
      ],
      growthTrend: [
        { month: '2024-11', size: 650 },
        { month: '2024-12', size: 680 },
        { month: '2025-01', size: 705 },
        { month: '2025-02', size: 725 },
        { month: '2025-03', size: 745 },
        { month: '2025-04', size: 768 }
      ]
    };
    
    logger.info(`Returning database storage usage for environment: ${environment}`);
    res.json(mockStorageData);
  } catch (error) {
    logger.error(`Error fetching database storage usage: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch database storage usage',
      details: error.message
    });
  }
});

module.exports = router;
