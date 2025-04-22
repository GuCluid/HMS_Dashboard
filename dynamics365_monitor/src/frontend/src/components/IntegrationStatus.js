import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

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
  chartContainer: {
    marginTop: theme.spacing(3),
    height: 300,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  integrationCard: {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
  statusOnline: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  statusDegraded: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  statusOffline: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  }
}));

const IntegrationStatus = ({ environment }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        setLoading(true);
        const statusResponse = await axios.get(`/api/${environment}/integrations/status`, {
          withCredentials: true
        });
        setIntegrationStatus(statusResponse.data);
        
        const metricsResponse = await axios.get(`/api/${environment}/integrations/metrics`, {
          withCredentials: true
        });
        setMetrics(metricsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch integration status data:', err);
        setError('Failed to load integration status data. Please try again later.');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationStatus();
  }, [environment]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Paper className={classes.paper}>
          <Typography variant="h6" color="error">
            Error Loading Integration Status
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </Paper>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Get status chip class
  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Online':
        return classes.statusOnline;
      case 'Degraded':
        return classes.statusDegraded;
      case 'Offline':
        return classes.statusOffline;
      default:
        return '';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Prepare data for API calls chart
  const apiCallsData = {
    labels: metrics.apiCalls.trend.map(item => item.date),
    datasets: [
      {
        label: 'API Calls',
        data: metrics.apiCalls.trend.map(item => item.calls),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Errors',
        data: metrics.apiCalls.trend.map(item => item.errors),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  // Prepare data for response time chart
  const responseTimeData = {
    labels: metrics.responseTime.trend.map(item => item.date),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: metrics.responseTime.trend.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for API calls by integration chart
  const apiCallsByIntegrationData = {
    labels: Object.keys(metrics.apiCalls.byIntegration),
    datasets: [
      {
        data: Object.values(metrics.apiCalls.byIntegration),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Integration Status
            </Typography>
            <Typography variant="body2">
              Last Updated: {formatTimestamp(integrationStatus.lastChecked)}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="h5" gutterBottom>
              Overall Status: 
              <Chip 
                label={integrationStatus.overallStatus} 
                className={`${classes.statusChip} ${getStatusChipClass(integrationStatus.overallStatus === 'Healthy' ? 'Online' : 'Degraded')}`}
              />
            </Typography>
          </Box>
          <Grid container spacing={2} mt={2}>
            {integrationStatus.integrations.map((integration, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={classes.integrationCard}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {integration.name}
                      </Typography>
                      <Chip 
                        label={integration.status} 
                        className={`${classes.statusChip} ${getStatusChipClass(integration.status)}`}
                        size="small"
                      />
                    </Box>
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary">
                        Last Sync: {formatTimestamp(integration.lastSync)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Response Time: {integration.responseTime} ms
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Error Rate: {integration.errorRate}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Health Score: {integration.healthScore}/100
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            API Calls and Errors (Last 7 Days)
          </Typography>
          <div className={classes.chartContainer}>
            <Line 
              data={apiCallsData} 
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
      
      <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            API Calls by Integration
          </Typography>
          <div className={classes.chartContainer}>
            <Pie 
              data={apiCallsByIntegrationData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
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
            Response Time Trend (Last 7 Days)
          </Typography>
          <div className={classes.chartContainer}>
            <Line 
              data={responseTimeData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Response Time (ms)'
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
            Integration Statistics
          </Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Total API Calls
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {metrics.apiCalls.total.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Success Rate
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {((metrics.apiCalls.successful / metrics.apiCalls.total) * 100).toFixed(2)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Failed Calls
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {metrics.apiCalls.failed.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Throttled Calls
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {metrics.apiCalls.throttled.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Avg Response Time
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {metrics.responseTime.average} ms
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body2" className={classes.statLabel}>
                  Data Volume
                </Typography>
                <Typography variant="h5" className={classes.statValue}>
                  {metrics.dataVolume.total} MB
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default IntegrationStatus;
