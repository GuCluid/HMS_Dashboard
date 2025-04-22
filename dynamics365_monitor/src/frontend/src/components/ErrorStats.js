import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line, Pie } from 'react-chartjs-2';
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

const ErrorStats = ({ environment }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchErrorStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${environment}/error-stats`, {
          withCredentials: true
        });
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch error statistics:', err);
        setError('Failed to load error statistics. Please try again later.');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchErrorStats();
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
            Error Loading Statistics
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

  // Prepare data for error trend chart
  const trendData = {
    labels: stats.errorTrend.map(item => item.date),
    datasets: [
      {
        label: 'Error Count',
        data: stats.errorTrend.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for error by type chart
  const typeData = {
    labels: Object.keys(stats.errorsByType),
    datasets: [
      {
        data: Object.values(stats.errorsByType),
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

  // Prepare data for error by severity chart
  const severityData = {
    labels: Object.keys(stats.errorsBySeverity),
    datasets: [
      {
        data: Object.values(stats.errorsBySeverity),
        backgroundColor: [
          '#FF6384',
          '#FFCE56',
          '#36A2EB'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#FFCE56',
          '#36A2EB'
        ]
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Error Summary
          </Typography>
          <Box mt={2}>
            <Typography variant="h3" color="primary">
              {stats.totalErrors}
            </Typography>
            <Typography variant="body1">
              Total Errors
            </Typography>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" color="error">
                {stats.activeErrors}
              </Typography>
              <Typography variant="body2">
                Active
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" style={{ color: '#4caf50' }}>
                {stats.resolvedErrors}
              </Typography>
              <Typography variant="body2">
                Resolved
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Error Trend (Last 7 Days)
          </Typography>
          <div className={classes.chartContainer}>
            <Line 
              data={trendData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
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
            Errors by Type
          </Typography>
          <div className={classes.chartContainer}>
            <Pie 
              data={typeData} 
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
            Errors by Severity
          </Typography>
          <div className={classes.chartContainer}>
            <Pie 
              data={severityData} 
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
    </Grid>
  );
};

export default ErrorStats;
