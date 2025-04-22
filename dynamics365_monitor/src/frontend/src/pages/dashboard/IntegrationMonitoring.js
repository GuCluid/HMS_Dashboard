import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import IntegrationStatus from '../../components/IntegrationStatus';

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
  filterContainer: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(2),
  },
  tabPanel: {
    padding: theme.spacing(2, 0),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
  statusCompleted: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  statusPending: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  statusDeclined: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  statusExpired: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  statusFailed: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  docusignCard: {
    marginBottom: theme.spacing(3),
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  docusignLogo: {
    height: 40,
    marginRight: theme.spacing(2),
  },
  docusignHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
  connectionActive: {
    backgroundColor: theme.palette.success.main,
  }
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={props.className}>
          {children}
        </Box>
      )}
    </div>
  );
}

const IntegrationMonitoring = ({ environment }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState({
    docusign: true,
    logs: true
  });
  const [docusignData, setDocusignData] = useState(null);
  const [integrationLogs, setIntegrationLogs] = useState([]);
  const [filters, setFilters] = useState({
    integration: 'all',
    status: 'all',
    timeRange: '24h'
  });
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  
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
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fetch DocuSign integration details
  useEffect(() => {
    const fetchDocuSignData = async () => {
      try {
        setLoading(prev => ({ ...prev, docusign: true }));
        
        const response = await axios.get(`/api/${environment}/integrations/docusign`, {
          withCredentials: true
        });
        
        setDocusignData(response.data);
      } catch (error) {
        console.error('Error fetching DocuSign data:', error);
        setError('Failed to load DocuSign integration data');
        setAlertMessage(`Failed to load DocuSign data: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, docusign: false }));
      }
    };
    
    fetchDocuSignData();
  }, [environment]);
  
  // Fetch integration logs
  useEffect(() => {
    const fetchIntegrationLogs = async () => {
      try {
        setLoading(prev => ({ ...prev, logs: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.integration !== 'all') params.append('integration', filters.integration);
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        
        const response = await axios.get(`/api/${environment}/integrations/logs?${params.toString()}`, {
          withCredentials: true
        });
        
        setIntegrationLogs(response.data);
      } catch (error) {
        console.error('Error fetching integration logs:', error);
        setError('Failed to load integration logs');
        setAlertMessage(`Failed to load integration logs: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, logs: false }));
      }
    };
    
    fetchIntegrationLogs();
  }, [environment, filters]);
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get status chip class
  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Completed':
        return classes.statusCompleted;
      case 'Pending':
        return classes.statusPending;
      case 'Declined':
        return classes.statusDeclined;
      case 'Expired':
        return classes.statusExpired;
      case 'Failed':
        return classes.statusFailed;
      default:
        return '';
    }
  };
  
  // Handle alert close
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  
  // Handle export report
  const handleExportReport = () => {
    // In a real implementation, this would generate a report
    setAlertSeverity('info');
    setAlertMessage('Export functionality will be implemented in the final version');
    setAlertOpen(true);
  };
  
  // Prepare data for document stats chart
  const documentStatsData = docusignData ? {
    labels: ['Completed', 'Pending', 'Declined', 'Expired', 'Failed'],
    datasets: [
      {
        data: [
          docusignData.documentStats.completed,
          docusignData.documentStats.pending,
          docusignData.documentStats.declined,
          docusignData.documentStats.expired,
          docusignData.documentStats.failed
        ],
        backgroundColor: [
          '#4caf50', // Completed - Green
          '#2196f3', // Pending - Blue
          '#f44336', // Declined - Red
          '#ff9800', // Expired - Orange
          '#9c27b0'  // Failed - Purple
        ],
        hoverBackgroundColor: [
          '#4caf50',
          '#2196f3',
          '#f44336',
          '#ff9800',
          '#9c27b0'
        ]
      }
    ]
  } : null;

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Integration Monitoring
      </Typography>
      
      <Paper className={classes.filterContainer}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="integration-filter-label">Integration</InputLabel>
              <Select
                labelId="integration-filter-label"
                id="integration-filter"
                name="integration"
                value={filters.integration}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Integrations</MenuItem>
                <MenuItem value="DocuSign">DocuSign</MenuItem>
                <MenuItem value="SharePoint">SharePoint</MenuItem>
                <MenuItem value="Exchange">Exchange</MenuItem>
                <MenuItem value="Power BI">Power BI</MenuItem>
                <MenuItem value="Azure Logic Apps">Azure Logic Apps</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Success">Success</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Partial Success">Partial Success</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="time-filter-label">Time Range</InputLabel>
              <Select
                labelId="time-filter-label"
                id="time-filter"
                name="timeRange"
                value={filters.timeRange}
                onChange={handleFilterChange}
              >
                <MenuItem value="1h">Last Hour</MenuItem>
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} container alignItems="flex-end">
            <Button variant="outlined" color="primary" onClick={handleExportReport}>
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Box mt={4}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="DocuSign" />
          <Tab label="Integration Logs" />
        </Tabs>
        
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
          <IntegrationStatus environment={environment} />
        </TabPanel>
        
        {/* DocuSign Tab */}
        <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
          {loading.docusign ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : docusignData && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card className={classes.docusignCard}>
                  <CardContent>
                    <Box className={classes.docusignHeader}>
                      <img 
                        src="https://www.docusign.com/sites/default/files/docusign_logo_0.png" 
                        alt="DocuSign Logo" 
                        className={classes.docusignLogo}
                      />
                      <Typography variant="h5">
                        DocuSign Integration
                      </Typography>
                    </Box>
                    
                    <Box className={classes.connectionStatus}>
                      <div className={`${classes.connectionDot} ${classes.connectionActive}`}></div>
                      <Typography variant="body1">
                        {docusignData.connectionStatus} - Account ID: {docusignData.accountId}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                          <Typography variant="body2" className={classes.statLabel}>
                            Integration User
                          </Typography>
                          <Typography variant="body1">
                            {docusignData.integrationUser}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                          <Typography variant="body2" className={classes.statLabel}>
                            Last Sync Time
                          </Typography>
                          <Typography variant="body1">
                            {formatTimestamp(docusignData.lastSyncTime)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                          <Typography variant="body2" className={classes.statLabel}>
                            API Version
                          </Typography>
                          <Typography variant="body1">
                            {docusignData.apiVersion}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Document Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <div className={classes.chartContainer}>
                        <Doughnut 
                          data={documentStatsData} 
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box mt={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Total Documents Sent:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.sent}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Completed:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.completed} ({Math.round(docusignData.documentStats.completed / docusignData.documentStats.sent * 100)}%)
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Pending:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.pending} ({Math.round(docusignData.documentStats.pending / docusignData.documentStats.sent * 100)}%)
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Declined:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.declined} ({Math.round(docusignData.documentStats.declined / docusignData.documentStats.sent * 100)}%)
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Expired:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.expired} ({Math.round(docusignData.documentStats.expired / docusignData.documentStats.sent * 100)}%)
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Failed:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {docusignData.documentStats.failed} ({Math.round(docusignData.documentStats.failed / docusignData.documentStats.sent * 100)}%)
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="body2" className={classes.statLabel}>
                          Average Completion Time
                        </Typography>
                        <Typography variant="h5" className={classes.statValue}>
                          {docusignData.performanceMetrics.averageCompletionTime} hrs
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="body2" className={classes.statLabel}>
                          Average Response Time
                        </Typography>
                        <Typography variant="h5" className={classes.statValue}>
                          {docusignData.performanceMetrics.averageResponseTime} ms
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="body2" className={classes.statLabel}>
                          Success Rate
                        </Typography>
                        <Typography variant="h5" className={classes.statValue}>
                          {docusignData.performanceMetrics.successRate}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      Error Logs
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Error Code</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Resolution</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {docusignData.errorLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                              <TableCell>{log.errorCode}</TableCell>
                              <TableCell>{log.message}</TableCell>
                              <TableCell>{log.resolution}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Document Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Sent Time</TableCell>
                          <TableCell>Completed Time</TableCell>
                          <TableCell>Sender</TableCell>
                          <TableCell>Recipients</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {docusignData.recentActivity.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>{activity.documentName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={activity.status} 
                                className={getStatusChipClass(activity.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{formatTimestamp(activity.sentTime)}</TableCell>
                            <TableCell>{activity.completedTime ? formatTimestamp(activity.completedTime) : 'N/A'}</TableCell>
                            <TableCell>{activity.sender}</TableCell>
                            <TableCell>{activity.recipients.join(', ')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        
        {/* Integration Logs Tab */}
        <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
          {loading.logs ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {integrationLogs.length} Integration Logs Found in {environmentDetails.name}
                </Typography>
              </Box>
              
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Integration</TableCell>
                      <TableCell>Operation</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {integrationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                        <TableCell>{log.integration}</TableCell>
                        <TableCell>{log.operation}</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.status} 
                            className={log.status.includes('Success') ? classes.statusCompleted : classes.statusFailed}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.duration} ms</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </TabPanel>
      </Box>
      
      {/* Alert Snackbar */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default IntegrationMonitoring;
