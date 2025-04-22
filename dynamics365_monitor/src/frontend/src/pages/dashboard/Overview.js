import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Card, 
  CardContent,
  Button,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ErrorIcon from '@material-ui/icons/Error';
import StorageIcon from '@material-ui/icons/Storage';
import SyncIcon from '@material-ui/icons/Sync';
import TimelineIcon from '@material-ui/icons/Timeline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
      cursor: 'pointer',
    },
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  statusCard: {
    marginBottom: theme.spacing(3),
  },
  statusIcon: {
    fontSize: 24,
    marginRight: theme.spacing(1),
  },
  statusHealthy: {
    color: theme.palette.success.main,
  },
  statusWarning: {
    color: theme.palette.warning.main,
  },
  statusError: {
    color: theme.palette.error.main,
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  environmentUrl: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  viewDetailsButton: {
    marginTop: 'auto',
  }
}));

const Overview = ({ environment }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  
  // Get environment details based on environment ID
  const getEnvironmentDetails = () => {
    const environments = {
      prod: {
        name: 'Production',
        url: 'https://cluid-prod.crm4.dynamics.com/'
      },
      preprod: {
        name: 'Preprod',
        url: 'https://cluid-preprod.crm4.dynamics.com/'
      },
      uat: {
        name: 'UAT',
        url: 'https://cluid-uat.crm4.dynamics.com/'
      }
    };
    
    return environments[environment] || environments.prod;
  };
  
  const environmentDetails = getEnvironmentDetails();
  
  // Simulate fetching overview data
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch data from the backend
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          systemStatus: {
            overall: 'Healthy',
            components: {
              api: 'Healthy',
              database: 'Healthy',
              integrations: 'Warning',
              activity: 'Healthy'
            }
          },
          errorStats: {
            total: 24,
            critical: 3,
            warning: 8,
            info: 13,
            trend: [
              { date: '2025-04-16', count: 32 },
              { date: '2025-04-17', count: 28 },
              { date: '2025-04-18', count: 35 },
              { date: '2025-04-19', count: 22 },
              { date: '2025-04-20', count: 18 },
              { date: '2025-04-21', count: 25 },
              { date: '2025-04-22', count: 24 }
            ]
          },
          databaseStats: {
            queryTime: 145, // ms
            deadlocks: 2,
            slowQueries: 8,
            trend: [
              { date: '2025-04-16', queryTime: 152, deadlocks: 3 },
              { date: '2025-04-17', queryTime: 148, deadlocks: 2 },
              { date: '2025-04-18', queryTime: 155, deadlocks: 4 },
              { date: '2025-04-19', queryTime: 142, deadlocks: 1 },
              { date: '2025-04-20', queryTime: 138, deadlocks: 0 },
              { date: '2025-04-21', queryTime: 142, deadlocks: 2 },
              { date: '2025-04-22', queryTime: 145, deadlocks: 2 }
            ]
          },
          integrationStats: {
            docusignStatus: 'Healthy',
            docusignPendingDocs: 12,
            apiCalls: 4580,
            errorRate: 1.2,
            trend: [
              { date: '2025-04-16', calls: 4250, errors: 55 },
              { date: '2025-04-17', calls: 4320, errors: 48 },
              { date: '2025-04-18', calls: 4480, errors: 62 },
              { date: '2025-04-19', calls: 3950, errors: 42 },
              { date: '2025-04-20', calls: 3820, errors: 38 },
              { date: '2025-04-21', calls: 4650, errors: 58 },
              { date: '2025-04-22', calls: 4580, errors: 55 }
            ]
          },
          activityStats: {
            activeUsers: 125,
            sessions: 450,
            processExecutions: 1250,
            recordOperations: 3420,
            trend: [
              { date: '2025-04-16', users: 98, operations: 3150 },
              { date: '2025-04-17', users: 105, operations: 3280 },
              { date: '2025-04-18', users: 112, operations: 3420 },
              { date: '2025-04-19', users: 85, operations: 2950 },
              { date: '2025-04-20', users: 78, operations: 2820 },
              { date: '2025-04-21', users: 118, operations: 3580 },
              { date: '2025-04-22', users: 125, operations: 3420 }
            ]
          }
        };
        
        setOverviewData(mockData);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOverviewData();
  }, [environment]);
  
  // Navigate to specific monitoring page
  const navigateTo = (path) => {
    navigate(`/dashboard/${path}`);
  };
  
  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircleIcon className={`${classes.statusIcon} ${classes.statusHealthy}`} />;
      case 'Warning':
        return <WarningIcon className={`${classes.statusIcon} ${classes.statusWarning}`} />;
      case 'Error':
        return <ErrorIcon className={`${classes.statusIcon} ${classes.statusError}`} />;
      default:
        return <CheckCircleIcon className={`${classes.statusIcon} ${classes.statusHealthy}`} />;
    }
  };
  
  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Dashboard Overview
      </Typography>
      
      <Typography variant="subtitle1" className={classes.environmentUrl}>
        Environment: {environmentDetails.name} ({environmentDetails.url})
      </Typography>
      
      <Paper className={`${classes.paper} ${classes.statusCard}`}>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
              {getStatusIcon(overviewData.systemStatus.overall)}
              <Typography variant="h6">
                Overall: {overviewData.systemStatus.overall}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" p={1} border={1} borderColor="grey.300" borderRadius={1}>
                  {getStatusIcon(overviewData.systemStatus.components.api)}
                  <Typography variant="body1">
                    API
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" p={1} border={1} borderColor="grey.300" borderRadius={1}>
                  {getStatusIcon(overviewData.systemStatus.components.database)}
                  <Typography variant="body1">
                    Database
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" p={1} border={1} borderColor="grey.300" borderRadius={1}>
                  {getStatusIcon(overviewData.systemStatus.components.integrations)}
                  <Typography variant="body1">
                    Integrations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" p={1} border={1} borderColor="grey.300" borderRadius={1}>
                  {getStatusIcon(overviewData.systemStatus.components.activity)}
                  <Typography variant="body1">
                    Activity
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card className={classes.card} onClick={() => navigateTo('errors')}>
            <CardContent className={classes.cardContent}>
              <ErrorIcon className={classes.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Error Monitoring
              </Typography>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Total
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.errorStats.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Critical
                    </Typography>
                    <Typography variant="h5" className={classes.statValue} style={{ color: '#f44336' }}>
                      {overviewData.errorStats.critical}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Warning
                    </Typography>
                    <Typography variant="h5" className={classes.statValue} style={{ color: '#ff9800' }}>
                      {overviewData.errorStats.warning}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.viewDetailsButton}
                onClick={() => navigateTo('errors')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card className={classes.card} onClick={() => navigateTo('database')}>
            <CardContent className={classes.cardContent}>
              <StorageIcon className={classes.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Database Monitoring
              </Typography>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Query Time
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.databaseStats.queryTime}ms
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Deadlocks
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.databaseStats.deadlocks}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Slow Queries
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.databaseStats.slowQueries}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.viewDetailsButton}
                onClick={() => navigateTo('database')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card className={classes.card} onClick={() => navigateTo('integrations')}>
            <CardContent className={classes.cardContent}>
              <SyncIcon className={classes.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Integration Monitoring
              </Typography>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" className={classes.statLabel}>
                      DocuSign
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {getStatusIcon(overviewData.integrationStats.docusignStatus)}
                      <Typography variant="body1">
                        {overviewData.integrationStats.docusignPendingDocs} pending
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Error Rate
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.integrationStats.errorRate}%
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.viewDetailsButton}
                onClick={() => navigateTo('integrations')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card className={classes.card} onClick={() => navigateTo('activities')}>
            <CardContent className={classes.cardContent}>
              <TimelineIcon className={classes.cardIcon} />
              <Typography variant="h6" gutterBottom>
                Activity Monitoring
              </Typography>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Active Users
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.activityStats.activeUsers}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className={classes.statLabel}>
                      Sessions
                    </Typography>
                    <Typography variant="h5" className={classes.statValue}>
                      {overviewData.activityStats.sessions}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.viewDetailsButton}
                onClick={() => navigateTo('activities')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Error Trend (Last 7 Days)
            </Typography>
            <div className={classes.chartContainer}>
              <Line 
                data={{
                  labels: overviewData.errorStats.trend.map(item => item.date),
                  datasets: [
                    {
                      label: 'Errors',
                      data: overviewData.errorStats.trend.map(item => item.count),
                      fill: false,
                      backgroundColor: 'rgba(244, 67, 54, 0.4)',
                      borderColor: 'rgba(244, 67, 54, 1)',
                      tension: 0.1
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Error Count'
                      }
                    }
                  }
                }}
              />
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Database Performance (Last 7 Days)
            </Typography>
            <div className={classes.chartContainer}>
              <Line 
                data={{
                  labels: overviewData.databaseStats.trend.map(item => item.date),
                  datasets: [
                    {
                      label: 'Query Time (ms)',
                      data: overviewData.databaseStats.trend.map(item => item.queryTime),
                      fill: false,
                      backgroundColor: 'rgba(33, 150, 243, 0.4)',
                      borderColor: 'rgba(33, 150, 243, 1)',
                      tension: 0.1,
                      yAxisID: 'y'
                    },
                    {
                      label: 'Deadlocks',
                      data: overviewData.databaseStats.trend.map(item => item.deadlocks),
                      fill: false,
                      backgroundColor: 'rgba(156, 39, 176, 0.4)',
                      borderColor: 'rgba(156, 39, 176, 1)',
                      tension: 0.1,
                      yAxisID: 'y1'
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Query Time (ms)'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Deadlocks'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Integration Activity (Last 7 Days)
            </Typography>
            <div className={classes.chartContainer}>
              <Line 
                data={{
                  labels: overviewData.integrationStats.trend.map(item => item.date),
                  datasets: [
                    {
                      label: 'API Calls',
                      data: overviewData.integrationStats.trend.map(item => item.calls),
                      fill: false,
                      backgroundColor: 'rgba(76, 175, 80, 0.4)',
                      borderColor: 'rgba(76, 175, 80, 1)',
                      tension: 0.1,
                      yAxisID: 'y'
                    },
                    {
                      label: 'Errors',
                      data: overviewData.integrationStats.trend.map(item => item.errors),
                      fill: false,
                      backgroundColor: 'rgba(244, 67, 54, 0.4)',
                      borderColor: 'rgba(244, 67, 54, 1)',
                      tension: 0.1,
                      yAxisID: 'y1'
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'API Calls'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Errors'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              User Activity (Last 7 Days)
            </Typography>
            <div className={classes.chartContainer}>
              <Line 
                data={{
                  labels: overviewData.activityStats.trend.map(item => item.date),
                  datasets: [
                    {
                      label: 'Active Users',
                      data: overviewData.activityStats.trend.map(item => item.users),
                      fill: false,
                      backgroundColor: 'rgba(255, 152, 0, 0.4)',
                      borderColor: 'rgba(255, 152, 0, 1)',
                      tension: 0.1,
                      yAxisID: 'y'
                    },
                    {
                      label: 'Record Operations',
                      data: overviewData.activityStats.trend.map(item => item.operations),
                      fill: false,
                      backgroundColor: 'rgba(156, 39, 176, 0.4)',
                      borderColor: 'rgba(156, 39, 176, 1)',
                      tension: 0.1,
                      yAxisID: 'y1'
                    }
                  ]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Active Users'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Record Operations'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
