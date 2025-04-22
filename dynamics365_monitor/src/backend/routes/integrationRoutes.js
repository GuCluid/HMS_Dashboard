const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Get integration status for a specific environment
router.get('/:environment/integrations/status', async (req, res) => {
  try {
    const { environment } = req.params;
    
    logger.info(`Fetching integration status for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for integration status`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockIntegrationStatus = {
      overallStatus: 'Healthy',
      lastChecked: new Date().toISOString(),
      integrations: [
        {
          name: 'DocuSign',
          status: 'Online',
          lastSync: '2025-04-22T07:30:45Z',
          responseTime: 245, // milliseconds
          errorRate: 0.2, // percentage
          healthScore: 98
        },
        {
          name: 'SharePoint',
          status: 'Online',
          lastSync: '2025-04-22T08:15:12Z',
          responseTime: 180, // milliseconds
          errorRate: 0.0, // percentage
          healthScore: 100
        },
        {
          name: 'Exchange',
          status: 'Degraded',
          lastSync: '2025-04-22T06:45:33Z',
          responseTime: 850, // milliseconds
          errorRate: 4.5, // percentage
          healthScore: 75
        },
        {
          name: 'Power BI',
          status: 'Online',
          lastSync: '2025-04-22T08:05:22Z',
          responseTime: 320, // milliseconds
          errorRate: 0.5, // percentage
          healthScore: 95
        },
        {
          name: 'Azure Logic Apps',
          status: 'Online',
          lastSync: '2025-04-22T07:55:18Z',
          responseTime: 290, // milliseconds
          errorRate: 1.2, // percentage
          healthScore: 92
        }
      ]
    };
    
    logger.info(`Returning integration status for environment: ${environment}`);
    res.json(mockIntegrationStatus);
  } catch (error) {
    logger.error(`Error fetching integration status: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integration status',
      details: error.message
    });
  }
});

// Get DocuSign integration details for a specific environment
router.get('/:environment/integrations/docusign', async (req, res) => {
  try {
    const { environment } = req.params;
    
    logger.info(`Fetching DocuSign integration details for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for DocuSign integration details`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockDocuSignDetails = {
      connectionStatus: 'Connected',
      accountId: 'docusign-account-123456',
      integrationUser: 'integration@example.com',
      lastSyncTime: '2025-04-22T07:30:45Z',
      apiVersion: '2.1',
      documentStats: {
        sent: 245,
        completed: 198,
        declined: 12,
        expired: 8,
        pending: 27,
        failed: 3
      },
      performanceMetrics: {
        averageCompletionTime: 18.5, // hours
        averageResponseTime: 245, // milliseconds
        successRate: 98.8, // percentage
      },
      recentActivity: [
        {
          id: 1,
          documentName: 'Sales Contract - ABC Corp',
          status: 'Completed',
          sentTime: '2025-04-22T06:15:23Z',
          completedTime: '2025-04-22T07:45:12Z',
          recipients: ['client@example.com', 'manager@example.com'],
          sender: 'sales@example.com'
        },
        {
          id: 2,
          documentName: 'Service Agreement - XYZ Inc',
          status: 'Pending',
          sentTime: '2025-04-22T07:30:45Z',
          completedTime: null,
          recipients: ['customer@example.com'],
          sender: 'support@example.com'
        },
        {
          id: 3,
          documentName: 'NDA - New Vendor',
          status: 'Completed',
          sentTime: '2025-04-21T15:20:33Z',
          completedTime: '2025-04-21T16:45:22Z',
          recipients: ['vendor@example.com', 'legal@example.com'],
          sender: 'procurement@example.com'
        },
        {
          id: 4,
          documentName: 'Employment Contract - New Hire',
          status: 'Declined',
          sentTime: '2025-04-21T14:10:18Z',
          completedTime: '2025-04-21T18:30:55Z',
          recipients: ['candidate@example.com'],
          sender: 'hr@example.com'
        },
        {
          id: 5,
          documentName: 'Project Proposal - Client Project',
          status: 'Pending',
          sentTime: '2025-04-22T08:05:42Z',
          completedTime: null,
          recipients: ['client-director@example.com', 'client-manager@example.com'],
          sender: 'projects@example.com'
        }
      ],
      errorLogs: [
        {
          id: 1,
          timestamp: '2025-04-21T12:15:23Z',
          errorCode: 'AUTH_FAILED',
          message: 'Authentication failed with DocuSign API',
          documentId: null,
          resolution: 'Token refreshed automatically'
        },
        {
          id: 2,
          timestamp: '2025-04-20T09:45:12Z',
          errorCode: 'RECIPIENT_INVALID',
          message: 'Invalid recipient email address',
          documentId: 'doc-987654',
          resolution: 'Email address corrected and document resent'
        },
        {
          id: 3,
          timestamp: '2025-04-19T16:30:45Z',
          errorCode: 'TEMPLATE_NOT_FOUND',
          message: 'Template ID not found in DocuSign account',
          documentId: 'doc-876543',
          resolution: 'Template recreated and document resent'
        }
      ]
    };
    
    logger.info(`Returning DocuSign integration details for environment: ${environment}`);
    res.json(mockDocuSignDetails);
  } catch (error) {
    logger.error(`Error fetching DocuSign integration details: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch DocuSign integration details',
      details: error.message
    });
  }
});

// Get integration metrics for a specific environment
router.get('/:environment/integrations/metrics', async (req, res) => {
  try {
    const { environment } = req.params;
    const { timeRange } = req.query;
    
    logger.info(`Fetching integration metrics for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for integration metrics`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockIntegrationMetrics = {
      apiCalls: {
        total: 12450,
        successful: 12320,
        failed: 130,
        throttled: 45,
        byIntegration: {
          'DocuSign': 3250,
          'SharePoint': 4120,
          'Exchange': 2850,
          'Power BI': 1230,
          'Azure Logic Apps': 1000
        },
        trend: [
          { date: '2025-04-16', calls: 1720, errors: 18 },
          { date: '2025-04-17', calls: 1680, errors: 15 },
          { date: '2025-04-18', calls: 1750, errors: 20 },
          { date: '2025-04-19', calls: 1820, errors: 22 },
          { date: '2025-04-20', calls: 1650, errors: 16 },
          { date: '2025-04-21', calls: 1880, errors: 19 },
          { date: '2025-04-22', calls: 1950, errors: 20 }
        ]
      },
      responseTime: {
        average: 285, // milliseconds
        byIntegration: {
          'DocuSign': 245,
          'SharePoint': 180,
          'Exchange': 850,
          'Power BI': 320,
          'Azure Logic Apps': 290
        },
        trend: [
          { date: '2025-04-16', value: 275 },
          { date: '2025-04-17', value: 280 },
          { date: '2025-04-18', value: 290 },
          { date: '2025-04-19', value: 310 },
          { date: '2025-04-20', value: 300 },
          { date: '2025-04-21', value: 290 },
          { date: '2025-04-22', value: 285 }
        ]
      },
      dataVolume: {
        total: 1250, // MB
        byIntegration: {
          'DocuSign': 320,
          'SharePoint': 580,
          'Exchange': 180,
          'Power BI': 90,
          'Azure Logic Apps': 80
        },
        trend: [
          { date: '2025-04-16', value: 165 },
          { date: '2025-04-17', value: 170 },
          { date: '2025-04-18', value: 175 },
          { date: '2025-04-19', value: 190 },
          { date: '2025-04-20', value: 180 },
          { date: '2025-04-21', value: 185 },
          { date: '2025-04-22', value: 185 }
        ]
      }
    };
    
    logger.info(`Returning integration metrics for environment: ${environment}`);
    res.json(mockIntegrationMetrics);
  } catch (error) {
    logger.error(`Error fetching integration metrics: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integration metrics',
      details: error.message
    });
  }
});

// Get integration logs for a specific environment
router.get('/:environment/integrations/logs', async (req, res) => {
  try {
    const { environment } = req.params;
    const { integration, status, timeRange } = req.query;
    
    logger.info(`Fetching integration logs for environment: ${environment}`);
    
    // Check if token is expired and refresh if needed
    if (tokenManager.isTokenExpired(req.user.accessToken)) {
      logger.info(`Refreshing token for integration logs`);
      const tokens = await tokenManager.refreshAccessToken(req.user.refreshToken);
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
    }
    
    // Create Dynamics client with the access token
    const dynamicsClient = tokenManager.getDynamicsClient(req.user.accessToken, environment);
    
    // In a real implementation, this would fetch data from Dynamics 365
    // For now, we'll return mock data
    const mockIntegrationLogs = [
      {
        id: 1,
        timestamp: '2025-04-22T08:15:23Z',
        integration: 'DocuSign',
        operation: 'Send Document',
        status: 'Success',
        duration: 245, // milliseconds
        details: 'Document sent successfully to recipients',
        user: 'sales@example.com'
      },
      {
        id: 2,
        timestamp: '2025-04-22T08:10:12Z',
        integration: 'SharePoint',
        operation: 'Upload Document',
        status: 'Success',
        duration: 180, // milliseconds
        details: 'Document uploaded to SharePoint library',
        user: 'user1@example.com'
      },
      {
        id: 3,
        timestamp: '2025-04-22T07:55:45Z',
        integration: 'Exchange',
        operation: 'Sync Emails',
        status: 'Partial Success',
        duration: 850, // milliseconds
        details: '45 of 50 emails synced successfully',
        user: 'system'
      },
      {
        id: 4,
        timestamp: '2025-04-22T07:45:33Z',
        integration: 'DocuSign',
        operation: 'Check Status',
        status: 'Success',
        duration: 220, // milliseconds
        details: 'Status updated for 12 documents',
        user: 'system'
      },
      {
        id: 5,
        timestamp: '2025-04-22T07:30:19Z',
        integration: 'Power BI',
        operation: 'Refresh Dataset',
        status: 'Success',
        duration: 320, // milliseconds
        details: 'Dataset refreshed successfully',
        user: 'admin@example.com'
      },
      {
        id: 6,
        timestamp: '2025-04-22T07:15:08Z',
        integration: 'Azure Logic Apps',
        operation: 'Trigger Workflow',
        status: 'Success',
        duration: 290, // milliseconds
        details: 'Workflow triggered for new record',
        user: 'system'
      },
      {
        id: 7,
        timestamp: '2025-04-22T07:05:52Z',
        integration: 'DocuSign',
        operation: 'Send Document',
        status: 'Failed',
        duration: 350, // milliseconds
        details: 'Invalid recipient email address',
        user: 'hr@example.com'
      },
      {
        id: 8,
        timestamp: '2025-04-22T06:55:41Z',
        integration: 'SharePoint',
        operation: 'Download Document',
        status: 'Failed',
        duration: 420, // milliseconds
        details: 'Document not found in SharePoint library',
        user: 'user2@example.com'
      },
      {
        id: 9,
        timestamp: '2025-04-22T06:45:33Z',
        integration: 'Exchange',
        operation: 'Send Email',
        status: 'Success',
        duration: 260, // milliseconds
        details: 'Email sent successfully',
        user: 'marketing@example.com'
      },
      {
        id: 10,
        timestamp: '2025-04-22T06:30:22Z',
        integration: 'DocuSign',
        operation: 'Create Envelope',
        status: 'Success',
        duration: 280, // milliseconds
        details: 'Envelope created with 3 documents',
        user: 'legal@example.com'
      }
    ];
    
    // Apply filters if provided
    let filteredLogs = [...mockIntegrationLogs];
    
    if (integration && integration !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.integration === integration);
    }
    
    if (status && status !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === status);
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
      
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= cutoffDate);
    }
    
    logger.info(`Returning ${filteredLogs.length} integration logs for environment: ${environment}`);
    res.json(filteredLogs);
  } catch (error) {
    logger.error(`Error fetching integration logs: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integration logs',
      details: error.message
    });
  }
});

module.exports = router;
