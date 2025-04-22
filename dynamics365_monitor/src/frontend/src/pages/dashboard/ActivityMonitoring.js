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
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import UserActivity from '../../components/UserActivity';

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
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  bottleneckItem: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  bottleneckBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(1),
  }
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`activity-tabpanel-${index}`}
      aria-labelledby={`activity-tab-${index}`}
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

const ActivityMonitoring = ({ environment }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState({
    businessProcesses: true,
    entities: true,
    systemUsage: true
  });
  const [businessProcessData, setBusinessProcessData] = useState(null);
  const [entityData, setEntityData] = useState(null);
  const [systemUsageData, setSystemUsageData] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: '7d',
    processType: 'all',
    entityType: 'all'
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
  
  // Fetch business process data
  useEffect(() => {
    const fetchBusinessProcessData = async () => {
      try {
        setLoading(prev => ({ ...prev, businessProcesses: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        if (filters.processType !== 'all') params.append('processType', filters.processType);
        
        const response = await axios.get(`/api/${environment}/activities/business-processes?${params.toString()}`, {
          withCredentials: true
        });
        
        setBusinessProcessData(response.data);
      } catch (error) {
        console.error('Error fetching business process data:', error);
        setError('Failed to load business process data');
        setAlertMessage(`Failed to load business process data: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, businessProcesses: false }));
      }
    };
    
    fetchBusinessProcessData();
  }, [environment, filters]);
  
  // Fetch entity data
  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        setLoading(prev => ({ ...prev, entities: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        if (filters.entityType !== 'all') params.append('entityType', filters.entityType);
        
        const response = await axios.get(`/api/${environment}/activities/entities?${params.toString()}`, {
          withCredentials: true
        });
        
        setEntityData(response.data);
      } catch (error) {
        console.error('Error fetching entity data:', error);
        setError('Failed to load entity data');
        setAlertMessage(`Failed to load entity data: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, entities: false }));
      }
    };
    
    fetchEntityData();
  }, [environment, filters]);
  
  // Fetch system usage data
  useEffect(() => {
    const fetchSystemUsageData = async () => {
      try {
        setLoading(prev => ({ ...prev, systemUsage: true }));
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        
        const response = await axios.get(`/api/${environment}/activities/system-usage?${params.toString()}`, {
          withCredentials: true
        });
        
        setSystemUsageData(response.data);
      } catch (error) {
        console.error('Error fetching system usage data:', error);
        setError('Failed to load system usage data');
        setAlertMessage(`Failed to load system usage data: ${error.response?.data?.error || error.message}`);
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(prev => ({ ...prev, systemUsage: false }));
      }
    };
    
    fetchSystemUsageData();
  }, [environment, filters]);
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
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

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Activity Monitoring
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
                <MenuItem value="1d">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="entity-filter-label">Entity Type</InputLabel>
              <Select
                labelId="entity-filter-label"
                id="entity-filter"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Entities</MenuItem>
                <MenuItem value="Account">Account</MenuItem>
                <MenuItem value="Contact">Contact</MenuItem>
                <MenuItem value="Opportunity">Opportunity</MenuItem>
                <MenuItem value="Lead">Lead</MenuItem>
                <MenuItem value="Case">Case</MenuItem>
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
          <Tab label="User Activity" />
          <Tab label="Business Processes" />
          <Tab label="Entity Operations" />
          <Tab label="System Usage" />
        </Tabs>
        
        {/* User Activity Tab */}
        <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
          <UserActivity environment={environment} />
        </TabPanel>
        
        {/* Business Processes Tab */}
        <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
          {loading.businessProcesses ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : businessProcessData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Process Executions
                  </Typography>
                  <Box display="flex" justifyContent="space-around" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue}>
                        {businessProcessData.processExecutions.total}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Total Executions
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue} style={{ color: '#4caf50' }}>
                        {businessProcessData.processExecutions.completed}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Completed
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue} style={{ color: '#f44336' }}>
                        {businessProcessData.processExecutions.failed}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Failed
                      </Typography>
                    </Box>
                  </Box>
                  <div className={classes.chartContainer}>
                    <Line 
                      data={{
                        labels: businessProcessData.processExecutions.trend.map(item => item.date),
                        datasets: [
                          {
                            label: 'Completed',
                            data: businessProcessData.processExecutions.trend.map(item => item.completed),
                            fill: false,
                            backgroundColor: 'rgba(76, 175, 80, 0.4)',
                            borderColor: 'rgba(76, 175, 80, 1)',
                            tension: 0.1
                          },
                          {
                            label: 'Failed',
                            data: businessProcessData.processExecutions.trend.map(item => item.failed),
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
                              text: 'Process Executions'
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
                    Process by Type
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Pie 
                      data={{
                        labels: Object.keys(businessProcessData.processByType),
                        datasets: [
                          {
                            data: Object.values(businessProcessData.processByType),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.6)',
                              'rgba(54, 162, 235, 0.6)',
                              'rgba(255, 206, 86, 0.6)',
                              'rgba(75, 192, 192, 0.6)',
                              'rgba(153, 102, 255, 0.6)'
                            ],
                            hoverBackgroundColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)'
                            ]
                          }
                        ]
                      }}
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
              
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Top Business Processes
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Process Name</TableCell>
                          <TableCell>Executions</TableCell>
                          <TableCell>Avg Completion Time (days)</TableCell>
                          <TableCell>Success Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {businessProcessData.topProcesses.map((process, index) => (
                          <TableRow key={index}>
                            <TableCell>{process.name}</TableCell>
                            <TableCell>{process.executions}</TableCell>
                            <TableCell>{process.avgCompletionTime}</TableCell>
                            <TableCell>{process.successRate}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Process Bottlenecks
                  </Typography>
                  <Grid container spacing={3}>
                    {businessProcessData.bottlenecks.map((bottleneck, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Box className={classes.bottleneckItem}>
                          <Typography variant="subtitle1" gutterBottom>
                            {bottleneck.process}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Stage: {bottleneck.stage}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Avg Time: {bottleneck.avgTimeInStage} days
                          </Typography>
                          <Box mt={1}>
                            <Typography variant="body2">
                              {bottleneck.percentOfTotalTime}% of total process time
                            </Typography>
                            <Box width="100%" bgcolor="grey.200" borderRadius={4} mt={1}>
                              <Box 
                                className={classes.bottleneckBar} 
                                width={`${bottleneck.percentOfTotalTime}%`}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        
        {/* Entity Operations Tab */}
        <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
          {loading.entities ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : entityData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Record Operations
                  </Typography>
                  <Box display="flex" justifyContent="space-around" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue} style={{ color: '#4caf50' }}>
                        {entityData.recordOperations.created}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Created
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue} style={{ color: '#2196f3' }}>
                        {entityData.recordOperations.updated}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Updated
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue} style={{ color: '#f44336' }}>
                        {entityData.recordOperations.deleted}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Deleted
                      </Typography>
                    </Box>
                  </Box>
                  <div className={classes.chartContainer}>
                    <Line 
                      data={{
                        labels: entityData.recordOperations.trend.map(item => item.date),
                        datasets: [
                          {
                            label: 'Created',
                            data: entityData.recordOperations.trend.map(item => item.created),
                            fill: false,
                            backgroundColor: 'rgba(76, 175, 80, 0.4)',
                            borderColor: 'rgba(76, 175, 80, 1)',
                            tension: 0.1
                          },
                          {
                            label: 'Updated',
                            data: entityData.recordOperations.trend.map(item => item.updated),
                            fill: false,
                            backgroundColor: 'rgba(33, 150, 243, 0.4)',
                            borderColor: 'rgba(33, 150, 243, 1)',
                            tension: 0.1
                          },
                          {
                            label: 'Deleted',
                            data: entityData.recordOperations.trend.map(item => item.deleted),
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
                              text: 'Operations'
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
                    Operations by Entity
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Bar 
                      data={{
                        labels: Object.keys(entityData.operationsByEntity),
                        datasets: [
                          {
                            label: 'Operations',
                            data: Object.values(entityData.operationsByEntity),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.6)',
                              'rgba(54, 162, 235, 0.6)',
                              'rgba(255, 206, 86, 0.6)',
                              'rgba(75, 192, 192, 0.6)',
                              'rgba(153, 102, 255, 0.6)',
                              'rgba(255, 159, 64, 0.6)'
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
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
                              text: 'Operations'
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
                    Top Entities
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Entity</TableCell>
                          <TableCell>Created</TableCell>
                          <TableCell>Updated</TableCell>
                          <TableCell>Deleted</TableCell>
                          <TableCell>Total Records</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entityData.topEntities.map((entity, index) => (
                          <TableRow key={index}>
                            <TableCell>{entity.name}</TableCell>
                            <TableCell>{entity.created}</TableCell>
                            <TableCell>{entity.updated}</TableCell>
                            <TableCell>{entity.deleted}</TableCell>
                            <TableCell>{entity.totalRecords.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Record Growth Trend
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Line 
                      data={{
                        labels: entityData.recordGrowth.Account.map(item => item.month),
                        datasets: [
                          {
                            label: 'Account',
                            data: entityData.recordGrowth.Account.map(item => item.count),
                            fill: false,
                            backgroundColor: 'rgba(255, 99, 132, 0.4)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            tension: 0.1
                          },
                          {
                            label: 'Contact',
                            data: entityData.recordGrowth.Contact.map(item => item.count),
                            fill: false,
                            backgroundColor: 'rgba(54, 162, 235, 0.4)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            tension: 0.1
                          },
                          {
                            label: 'Opportunity',
                            data: entityData.recordGrowth.Opportunity.map(item => item.count),
                            fill: false,
                            backgroundColor: 'rgba(255, 206, 86, 0.4)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            tension: 0.1
                          }
                        ]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Record Count'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        
        {/* System Usage Tab */}
        <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
          {loading.systemUsage ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : systemUsageData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Page Views
                  </Typography>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue}>
                        {systemUsageData.pageViews.total.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Total Page Views
                      </Typography>
                    </Box>
                  </Box>
                  <div className={classes.chartContainer}>
                    <Line 
                      data={{
                        labels: systemUsageData.pageViews.trend.map(item => item.date),
                        datasets: [
                          {
                            label: 'Page Views',
                            data: systemUsageData.pageViews.trend.map(item => item.count),
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.4)',
                            borderColor: 'rgba(75, 192, 192, 1)',
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
                              text: 'Views'
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
                    API Calls
                  </Typography>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h4" className={classes.statValue}>
                        {systemUsageData.apiCalls.total.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" className={classes.statLabel}>
                        Total API Calls
                      </Typography>
                    </Box>
                  </Box>
                  <div className={classes.chartContainer}>
                    <Line 
                      data={{
                        labels: systemUsageData.apiCalls.trend.map(item => item.date),
                        datasets: [
                          {
                            label: 'API Calls',
                            data: systemUsageData.apiCalls.trend.map(item => item.count),
                            fill: false,
                            backgroundColor: 'rgba(153, 102, 255, 0.4)',
                            borderColor: 'rgba(153, 102, 255, 1)',
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
                              text: 'Calls'
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
                    Device Usage
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Doughnut 
                      data={{
                        labels: Object.keys(systemUsageData.deviceUsage),
                        datasets: [
                          {
                            data: Object.values(systemUsageData.deviceUsage),
                            backgroundColor: [
                              'rgba(54, 162, 235, 0.6)',
                              'rgba(255, 99, 132, 0.6)',
                              'rgba(255, 206, 86, 0.6)'
                            ],
                            hoverBackgroundColor: [
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 99, 132, 1)',
                              'rgba(255, 206, 86, 1)'
                            ]
                          }
                        ]
                      }}
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
                    Browser Usage
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Doughnut 
                      data={{
                        labels: Object.keys(systemUsageData.browserUsage),
                        datasets: [
                          {
                            data: Object.values(systemUsageData.browserUsage),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.6)',
                              'rgba(54, 162, 235, 0.6)',
                              'rgba(255, 206, 86, 0.6)',
                              'rgba(75, 192, 192, 0.6)'
                            ],
                            hoverBackgroundColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)'
                            ]
                          }
                        ]
                      }}
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
                    Top Pages
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Page</TableCell>
                          <TableCell>Views</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {systemUsageData.topPages.map((page, index) => (
                          <TableRow key={index}>
                            <TableCell>{page.name}</TableCell>
                            <TableCell>{page.views.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom>
                    Peak Usage Times
                  </Typography>
                  <div className={classes.chartContainer}>
                    <Bar 
                      data={{
                        labels: systemUsageData.peakUsageTimes.map(item => `${item.hour}:00`),
                        datasets: [
                          {
                            label: 'Usage',
                            data: systemUsageData.peakUsageTimes.map(item => item.usage),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
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
                              text: 'Usage (Relative)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
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

export default ActivityMonitoring;
