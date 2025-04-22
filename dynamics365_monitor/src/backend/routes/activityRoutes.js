const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Get user activity for a specific environment
router.get('/:environment/activities/users', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange, userId } = req.query;
    
    logger.info(`Fetching user activity for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for user activity`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockUserActivity = {
      activeUsers: {
        total: 125,
        trend: [
          { date: '2025-04-16', count: 98 },
          { date: '2025-04-17', count: 105 },
          { date: '2025-04-18', count: 112 },
          { date: '2025-04-19', count: 85 },
          { date: '2025-04-20', count: 78 },
          { date: '2025-04-21', count: 118 },
          { date: '2025-04-22', count: 125 }
        ]
      },
      userSessions: {
        total: 450,
        averageDuration: 42, // minutes
        trend: [
          { date: '2025-04-16', count: 320, avgDuration: 38 },
          { date: '2025-04-17', count: 345, avgDuration: 40 },
          { date: '2025-04-18', count: 380, avgDuration: 41 },
          { date: '2025-04-19', count: 290, avgDuration: 35 },
          { date: '2025-04-20', count: 275, avgDuration: 36 },
          { date: '2025-04-21', count: 410, avgDuration: 43 },
          { date: '2025-04-22', count: 450, avgDuration: 42 }
        ]
      },
      topUsers: [
        { userId: 'user1@example.com', name: 'John Smith', sessions: 28, actions: 345, avgSessionDuration: 55 },
        { userId: 'user2@example.com', name: 'Jane Doe', sessions: 25, actions: 310, avgSessionDuration: 48 },
        { userId: 'user3@example.com', name: 'Robert Johnson', sessions: 22, actions: 290, avgSessionDuration: 52 },
        { userId: 'user4@example.com', name: 'Emily Davis', sessions: 20, actions: 275, avgSessionDuration: 45 },
        { userId: 'user5@example.com', name: 'Michael Wilson', sessions: 18, actions: 260, avgSessionDuration: 50 }
      ],
      usersByRole: {
        'Sales': 45,
        'Customer Service': 35,
        'Marketing': 20,
        'Finance': 15,
        'System Administrator': 10
      },
      usersByLocation: {
        'North America': 65,
        'Europe': 35,
        'Asia Pacific': 20,
        'Latin America': 5
      }
    };
    
    logger.info(`Returning user activity for environment: ${environment}`);
    res.json(mockUserActivity);
  } catch (error) {
    logger.error(`Error fetching user activity: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user activity',
      details: error.message
    });
  }
});

// Get business process activity for a specific environment
router.get('/:environment/activities/business-processes', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange, processType } = req.query;
    
    logger.info(`Fetching business process activity for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for business process activity`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockBusinessProcessActivity = {
      processExecutions: {
        total: 1250,
        completed: 1180,
        failed: 70,
        trend: [
          { date: '2025-04-16', completed: 160, failed: 8 },
          { date: '2025-04-17', completed: 165, failed: 10 },
          { date: '2025-04-18', completed: 170, failed: 12 },
          { date: '2025-04-19', completed: 155, failed: 9 },
          { date: '2025-04-20', completed: 150, failed: 8 },
          { date: '2025-04-21', completed: 175, failed: 11 },
          { date: '2025-04-22', completed: 180, failed: 12 }
        ]
      },
      processByType: {
        'Lead to Opportunity': 320,
        'Opportunity to Quote': 280,
        'Quote to Order': 240,
        'Order to Invoice': 210,
        'Case Management': 200
      },
      averageCompletionTime: {
        'Lead to Opportunity': 2.5, // days
        'Opportunity to Quote': 1.8, // days
        'Quote to Order': 3.2, // days
        'Order to Invoice': 1.5, // days
        'Case Management': 4.2 // days
      },
      topProcesses: [
        { 
          name: 'Lead to Opportunity', 
          executions: 320, 
          avgCompletionTime: 2.5,
          successRate: 96.2
        },
        { 
          name: 'Opportunity to Quote', 
          executions: 280, 
          avgCompletionTime: 1.8,
          successRate: 94.8
        },
        { 
          name: 'Quote to Order', 
          executions: 240, 
          avgCompletionTime: 3.2,
          successRate: 93.5
        },
        { 
          name: 'Order to Invoice', 
          executions: 210, 
          avgCompletionTime: 1.5,
          successRate: 97.1
        },
        { 
          name: 'Case Management', 
          executions: 200, 
          avgCompletionTime: 4.2,
          successRate: 92.4
        }
      ],
      bottlenecks: [
        {
          process: 'Lead to Opportunity',
          stage: 'Qualification',
          avgTimeInStage: 1.2, // days
          percentOfTotalTime: 48
        },
        {
          process: 'Quote to Order',
          stage: 'Negotiation',
          avgTimeInStage: 1.8, // days
          percentOfTotalTime: 56
        },
        {
          process: 'Case Management',
          stage: 'Research',
          avgTimeInStage: 2.5, // days
          percentOfTotalTime: 59
        }
      ]
    };
    
    logger.info(`Returning business process activity for environment: ${environment}`);
    res.json(mockBusinessProcessActivity);
  } catch (error) {
    logger.error(`Error fetching business process activity: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch business process activity',
      details: error.message
    });
  }
});

// Get entity activity for a specific environment
router.get('/:environment/activities/entities', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange, entityType } = req.query;
    
    logger.info(`Fetching entity activity for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for entity activity`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockEntityActivity = {
      recordOperations: {
        created: 850,
        updated: 2450,
        deleted: 120,
        trend: [
          { date: '2025-04-16', created: 110, updated: 320, deleted: 15 },
          { date: '2025-04-17', created: 115, updated: 335, deleted: 18 },
          { date: '2025-04-18', created: 120, updated: 350, deleted: 16 },
          { date: '2025-04-19', created: 105, updated: 310, deleted: 14 },
          { date: '2025-04-20', created: 100, updated: 300, deleted: 12 },
          { date: '2025-04-21', created: 125, updated: 360, deleted: 20 },
          { date: '2025-04-22', created: 130, updated: 375, deleted: 25 }
        ]
      },
      operationsByEntity: {
        'Account': 720,
        'Contact': 680,
        'Opportunity': 580,
        'Lead': 540,
        'Case': 480,
        'Quote': 420
      },
      topEntities: [
        { 
          name: 'Account', 
          created: 180, 
          updated: 520,
          deleted: 20,
          totalRecords: 12500
        },
        { 
          name: 'Contact', 
          created: 210, 
          updated: 450,
          deleted: 20,
          totalRecords: 28500
        },
        { 
          name: 'Opportunity', 
          created: 150, 
          updated: 420,
          deleted: 10,
          totalRecords: 8200
        },
        { 
          name: 'Lead', 
          created: 180, 
          updated: 350,
          deleted: 10,
          totalRecords: 9800
        },
        { 
          name: 'Case', 
          created: 130, 
          updated: 340,
          deleted: 10,
          totalRecords: 15600
        }
      ],
      recordGrowth: {
        'Account': [
          { month: '2024-11', count: 11200 },
          { month: '2024-12', count: 11500 },
          { month: '2025-01', count: 11800 },
          { month: '2025-02', count: 12100 },
          { month: '2025-03', count: 12300 },
          { month: '2025-04', count: 12500 }
        ],
        'Contact': [
          { month: '2024-11', count: 25800 },
          { month: '2024-12', count: 26400 },
          { month: '2025-01', count: 27000 },
          { month: '2025-02', count: 27500 },
          { month: '2025-03', count: 28000 },
          { month: '2025-04', count: 28500 }
        ],
        'Opportunity': [
          { month: '2024-11', count: 7200 },
          { month: '2024-12', count: 7400 },
          { month: '2025-01', count: 7600 },
          { month: '2025-02', count: 7800 },
          { month: '2025-03', count: 8000 },
          { month: '2025-04', count: 8200 }
        ]
      }
    };
    
    logger.info(`Returning entity activity for environment: ${environment}`);
    res.json(mockEntityActivity);
  } catch (error) {
    logger.error(`Error fetching entity activity: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch entity activity',
      details: error.message
    });
  }
});

// Get system usage for a specific environment
router.get('/:environment/activities/system-usage', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange } = req.query;
    
    logger.info(`Fetching system usage for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for system usage`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockSystemUsage = {
      pageViews: {
        total: 12500,
        trend: [
          { date: '2025-04-16', count: 1650 },
          { date: '2025-04-17', count: 1720 },
          { date: '2025-04-18', count: 1780 },
          { date: '2025-04-19', count: 1450 },
          { date: '2025-04-20', count: 1380 },
          { date: '2025-04-21', count: 1820 },
          { date: '2025-04-22', count: 1850 }
        ]
      },
      apiCalls: {
        total: 45800,
        trend: [
          { date: '2025-04-16', count: 6200 },
          { date: '2025-04-17', count: 6350 },
          { date: '2025-04-18', count: 6500 },
          { date: '2025-04-19', count: 5800 },
          { date: '2025-04-20', count: 5650 },
          { date: '2025-04-21', count: 6700 },
          { date: '2025-04-22', count: 6850 }
        ]
      },
      topPages: [
        { name: 'Dashboard', views: 2250 },
        { name: 'Accounts List', views: 1850 },
        { name: 'Opportunities List', views: 1650 },
        { name: 'Contacts List', views: 1450 },
        { name: 'Cases List', views: 1250 }
      ],
      deviceUsage: {
        'Desktop': 65,
        'Mobile': 25,
        'Tablet': 10
      },
      browserUsage: {
        'Chrome': 55,
        'Edge': 25,
        'Safari': 15,
        'Firefox': 5
      },
      peakUsageTimes: [
        { hour: 9, usage: 8.5 },
        { hour: 10, usage: 9.2 },
        { hour: 11, usage: 9.8 },
        { hour: 12, usage: 8.2 },
        { hour: 13, usage: 7.5 },
        { hour: 14, usage: 8.8 },
        { hour: 15, usage: 9.5 },
        { hour: 16, usage: 8.9 },
        { hour: 17, usage: 7.2 }
      ],
      featureUsage: [
        { feature: 'Advanced Find', usageCount: 3250 },
        { feature: 'Dashboards', usageCount: 2850 },
        { feature: 'Reports', usageCount: 2450 },
        { feature: 'Workflows', usageCount: 1950 },
        { feature: 'Business Process Flows', usageCount: 1750 }
      ]
    };
    
    logger.info(`Returning system usage for environment: ${environment}`);
    res.json(mockSystemUsage);
  } catch (error) {
    logger.error(`Error fetching system usage: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch system usage',
      details: error.message
    });
  }
});

module.exports = router;
