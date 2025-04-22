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
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorStats from '../../components/ErrorStats';

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
  errorHigh: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  errorMedium: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  errorLow: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  errorDetails: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    maxHeight: 300,
    overflow: 'auto',
  }
}));

const ErrorMonitoring = ({ environment }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    timeRange: '24h'
  });
  const [selectedError, setSelectedError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
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
  
  // Fetch errors from API
  useEffect(() => {
    const fetchErrors = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.severity !== 'all') params.append('severity', filters.severity);
        if (filters.type !== 'all') params.append('type', filters.type);
        if (filters.timeRange) params.append('timeRange', filters.timeRange);
        
        const response = await axios.get(`/api/${environment}/errors?${params.toString()}`, {
          withCredentials: true
        });
        
        setErrors(response.data);
        setAlertSeverity('success');
        setAlertMessage(`Successfully loaded ${response.data.length} errors from ${environmentDetails.name}`);
        setAlertOpen(true);
      } catch (error) {
        console.error('Error fetching errors:', error);
        setAlertSeverity('error');
        setAlertMessage(`Failed to load errors: ${error.response?.data?.error || error.message}`);
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchErrors();
  }, [environment, filters, environmentDetails.name]);
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    // Filters are applied in the useEffect hook
  };
  
  // Get severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High':
        return classes.errorHigh;
      case 'Medium':
        return classes.errorMedium;
      case 'Low':
        return classes.errorLow;
      default:
        return '';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Handle error details click
  const handleErrorDetailsClick = async (errorId) => {
    try {
      setDetailsLoading(true);
      setDialogOpen(true);
      
      const response = await axios.get(`/api/${environment}/errors/${errorId}`, {
        withCredentials: true
      });
      
      setErrorDetails(response.data);
    } catch (error) {
      console.error('Error fetching error details:', error);
      setAlertSeverity('error');
      setAlertMessage(`Failed to load error details: ${error.response?.data?.error || error.message}`);
      setAlertOpen(true);
    } finally {
      setDetailsLoading(false);
    }
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setErrorDetails(null);
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
        Error Monitoring
      </Typography>
      
      <Paper className={classes.filterContainer}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="severity-filter-label">Severity</InputLabel>
              <Select
                labelId="severity-filter-label"
                id="severity-filter"
                name="severity"
                value={filters.severity}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Severities</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="type-filter-label">Error Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="API Error">API Error</MenuItem>
                <MenuItem value="Database Error">Database Error</MenuItem>
                <MenuItem value="Integration Error">Integration Error</MenuItem>
                <MenuItem value="Authentication Error">Authentication Error</MenuItem>
                <MenuItem value="Validation Error">Validation Error</MenuItem>
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
            <Button variant="contained" color="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error Statistics */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Error Statistics
        </Typography>
        <ErrorStats environment={environment} />
      </Box>
      
      {/* Error List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Error List
        </Typography>
        
        {loading ? (
          <Box className={classes.loading}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {errors.length} Errors Found in {environmentDetails.name}
              </Typography>
              <Button variant="outlined" color="primary" onClick={handleExportReport}>
                Export Report
              </Button>
            </Box>
            
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>{formatTimestamp(error.timestamp)}</TableCell>
                      <TableCell>{error.type}</TableCell>
                      <TableCell>{error.message}</TableCell>
                      <TableCell>{error.source}</TableCell>
                      <TableCell>
                        <span className={getSeverityClass(error.severity)}>
                          {error.severity}
                        </span>
                      </TableCell>
                      <TableCell>{error.count}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => handleErrorDetailsClick(error.id)}
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
      </Box>
      
      {/* Error Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Error Details</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Box className={classes.loading}>
              <CircularProgress />
            </Box>
          ) : errorDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Error ID:</strong> {errorDetails.id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Timestamp:</strong> {formatTimestamp(errorDetails.timestamp)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Type:</strong> {errorDetails.type}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Source:</strong> {errorDetails.source}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Severity:</strong> 
                  <span className={getSeverityClass(errorDetails.severity)} style={{ marginLeft: 8 }}>
                    {errorDetails.severity}
                  </span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Status:</strong> {errorDetails.status}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Occurrence Count:</strong> {errorDetails.count}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Affected Users:</strong>
                </Typography>
                <ul>
                  {errorDetails.affectedUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                  ))}
                </ul>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Affected Components:</strong>
                </Typography>
                <ul>
                  {errorDetails.affectedComponents.map((component, index) => (
                    <li key={index}>{component}</li>
                  ))}
                </ul>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Resolution:</strong> {errorDetails.resolution || 'Not resolved yet'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Error Message:</strong>
                </Typography>
                <Typography variant="body1" paragraph>
                  {errorDetails.message}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Stack Trace:</strong>
                </Typography>
                <div className={classes.errorDetails}>
                  {errorDetails.stackTrace}
                </div>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1">
              No error details available.
            </Typography>
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

export default ErrorMonitoring;
