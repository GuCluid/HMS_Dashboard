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
  Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DatabasePerformance from '../../components/DatabasePerformance';

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
  queryText: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.85rem',
    maxHeight: '150px',
    overflow: 'auto',
  },
  highDuration: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  mediumDuration: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  lowDuration: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  }
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`database-tabpanel-${index}`}
      aria-labelledby={`database-tab-${index}`}
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

const DatabaseMonitoring = ({ environment }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState({
    slowQueries: true,
    deadlocks: true,
    storage: true
  });
  const [slowQueries, setSlowQueries] = useState([]);
  const [deadlocks, setDeadlocks] = useState([]);
  const [storageData, setStorageData] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    threshold: 3000 // milliseconds
  });
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  
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
  
  // Fetch slow queries
  useEffect(() => {
    const fetchSlowQueries = async () => {
      try {
        setLoading(prev => ({ ...prev, slowQueries: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        if (filters.threshold) params.append('threshold', filters.threshold);
        
        const response = await axios.get(`/api/${environment}/database/slow-queries?${params.toString()}`, {
          withCredentials: true
        });
        
        setSlowQueries(response.data);
      } catch (error) {
        console.error('Error fetching slow queries:', error);
        setError('Failed to load slow queries data');
        setAlertMessage(`Failed to load slow queries: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, slowQueries: false }));
      }
    };
    
    fetchSlowQueries();
  }, [environment, filters]);
  
  // Fetch deadlocks
  useEffect(() => {
    const fetchDeadlocks = async () => {
      try {
        setLoading(prev => ({ ...prev, deadlocks: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        
        const response = await axios.get(`/api/${environment}/database/deadlocks?${params.toString()}`, {
          withCredentials: true
        });
        
        setDeadlocks(response.data);
      } catch (error) {
        console.error('Error fetching deadlocks:', error);
        setError('Failed to load deadlocks data');
        setAlertMessage(`Failed to load deadlocks: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, deadlocks: false }));
      }
    };
    
    fetchDeadlocks();
  }, [environment, filters]);
  
  // Fetch storage data
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        setLoading(prev => ({ ...prev, storage: true }));
        
        const response = await axios.get(`/api/${environment}/database/storage`, {
          withCredentials: true
        });
        
        setStorageData(response.data);
      } catch (error) {
        console.error('Error fetching storage data:', error);
        setError('Failed to load storage data');
        setAlertMessage(`Failed to load storage data: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, storage: false }));
      }
    };
    
    fetchStorageData();
  }, [environment]);
  
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
  
  // Get duration class
  const getDurationClass = (duration) => {
    if (duration >= 5000) return classes.highDuration;
    if (duration >= 3000) return classes.mediumDuration;
    return classes.lowDuration;
  };
  
  // Format duration
  const formatDuration = (duration) => {
    return `${duration} ms`;
  };
  
  // Handle query details click
  const handleQueryDetailsClick = (query) => {
    setSelectedQuery(query);
    setQueryDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setQueryDialogOpen(false);
    setSelectedQuery(null);
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
  
  // Prepare data for storage by entity chart
  const storageByEntityData = storageData ? {
    labels: storageData.storageByEntity.map(item => item.entity),
    datasets: [
      {
        data: storageData.storageByEntity.map(item => item.size),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  } : null;
  
  // Prepare data for storage growth trend chart
  const storageGrowthData = storageData ? {
    labels: storageData.growthTrend.map(item => item.month),
    datasets: [
      {
        label: 'Storage Size (GB)',
        data: storageData.growthTrend.map(item => item.size),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Database Monitoring
      </Typography>
      
      <Paper className={classes.filterContainer}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="threshold-filter-label">Query Threshold</InputLabel>
              <Select
                labelId="threshold-filter-label"
                id="threshold-filter"
                name="threshold"
                value={filters.threshold}
                onChange={handleFilterChange}
              >
                <MenuItem value={1000}>1000 ms</MenuItem>
                <MenuItem value={2000}>2000 ms</MenuItem>
                <MenuItem value={3000}>3000 ms</MenuItem>
                <MenuItem value={5000}>5000 ms</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} container alignItems="flex-end">
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
          <Tab label="Performance" />
          <Tab label="Slow Queries" />
          <Tab label="Deadlocks" />
          <Tab label="Storage" />
        </Tabs>
        
        {/* Performance Tab */}
        <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
          <DatabasePerformance environment={environment} />
        </TabPanel>
        
        {/* Slow Queries Tab */}
        <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
          {loading.slowQueries ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {slowQueries.length} Slow Queries Found in {environmentDetails.name}
                </Typography>
              </Box>
              
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Table</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slowQueries.map((query) => (
                      <TableRow key={query.id}>
                        <TableCell>{formatTimestamp(query.timestamp)}</TableCell>
                        <TableCell>{query.table}</TableCell>
                        <TableCell>
                          <span className={getDurationClass(query.duration)}>
                            {formatDuration(query.duration)}
                          </span>
                        </TableCell>
                        <TableCell>{query.user}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="primary"
                            onClick={() => handleQueryDetailsClick(query)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </TabPanel>
        
        {/* Deadlocks Tab */}
        <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
          {loading.deadlocks ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {deadlocks.length} Deadlocks Found in {environmentDetails.name}
                </Typography>
              </Box>
              
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>Process ID</TableCell>
                      <TableCell>Victim Process ID</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deadlocks.map((deadlock) => (
                      <TableRow key={deadlock.id}>
                        <TableCell>{formatTimestamp(deadlock.timestamp)}</TableCell>
                        <TableCell>{deadlock.resource}</TableCell>
                        <TableCell>{deadlock.processId}</TableCell>
                        <TableCell>{deadlock.victimProcessId}</TableCell>
                        <TableCell>{formatDuration(deadlock.duration)}</TableCell>
                        <TableCell>{deadlock.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </TabPanel>
        
        {/* Storage Tab */}
        <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
          {loading.storage ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : storageData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom align="center">
                    Storage Usage
                  </Typography>
                  <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h3" color="primary">
                      {storageData.usagePercentage}%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {storageData.usedStorage} GB of {storageData.totalStorage} GB used
                    </Typography>
                    <Box 
                      width="100%" 
                      height={20} 
                      bgcolor="grey.200" 
                      borderRadius={10} 
                      mt={2}
                      position="relative"
                    >
                      <Box 
                        width={`${storageData.usagePercentage}%`} 
                        height={20} 
                        bgcolor={
                          storageData.usagePercentage > 90 ? 'error.main' : 
                          storageData.usagePercentage > 70 ? 'warning.main' : 
                          'success.main'
                        }
                        borderRadius={10}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {storageData.availableStorage} GB available
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Storage Growth Trend
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Bar 
                      data={storageGrowthData} 
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Storage Size (GB)'
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Storage by Entity
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <div className={classes.chartContainer}>
                        <Pie 
                          data={storageByEntityData} 
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
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Entity</TableCell>
                              <TableCell>Size (GB)</TableCell>
                              <TableCell>Percentage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {storageData.storageByEntity.map((entity, index) => (
                              <TableRow key={index}>
                                <TableCell>{entity.entity}</TableCell>
                                <TableCell>{entity.size}</TableCell>
                                <TableCell>{entity.percentage}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Box>
      
      {/* Query Details Dialog */}
      <Dialog
        open={queryDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Slow Query Details</DialogTitle>
        <DialogContent dividers>
          {selectedQuery && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Timestamp:</strong> {formatTimestamp(selectedQuery.timestamp)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Table:</strong> {selectedQuery.table}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Duration:</strong> 
                  <span className={getDurationClass(selectedQuery.duration)} style={{ marginLeft: 8 }}>
                    {formatDuration(selectedQuery.duration)}
                  </span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>User:</strong> {selectedQuery.user}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Parameters:</strong>
                </Typography>
                <Typography variant="body1" paragraph className={classes.queryText}>
                  {selectedQuery.parameters}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Query:</strong>
                </Typography>
                <div className={classes.queryText}>
                  {selectedQuery.query}
                </div>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DatabaseMonitoring;
