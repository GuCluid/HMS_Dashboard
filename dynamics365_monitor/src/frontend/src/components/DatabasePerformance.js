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
  Alert
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
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
  performanceGauge: {
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: '0 auto',
    borderRadius: '50%',
    background: '#f0f0f0',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeValue: {
    position: 'relative',
    zIndex: 2,
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  gaugeFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    transition: 'height 1s ease-in-out',
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

const DatabasePerformance = ({ environment }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${environment}/database/performance`, {
          withCredentials: true
        });
        setPerformanceData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch database performance data:', err);
        setError('Failed to load database performance data. Please try again later.');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
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
            Error Loading Performance Data
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

  // Get gauge color based on performance score
  const getGaugeColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Prepare data for response time chart
  const responseTimeData = {
    labels: performanceData.responseTime.trend.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: performanceData.responseTime.trend.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for CPU usage chart
  const cpuUsageData = {
    labels: performanceData.cpuUsage.trend.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: performanceData.cpuUsage.trend.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for memory usage chart
  const memoryUsageData = {
    labels: performanceData.memoryUsage.trend.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Memory Usage (%)',
        data: performanceData.memoryUsage.trend.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for disk IO chart
  const diskIOData = {
    labels: performanceData.diskIO.trend.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Read Rate (MB/s)',
        data: performanceData.diskIO.trend.map(item => item.read),
        fill: false,
        backgroundColor: 'rgba(255,159,64,0.4)',
        borderColor: 'rgba(255,159,64,1)',
        tension: 0.1
      },
      {
        label: 'Write Rate (MB/s)',
        data: performanceData.diskIO.trend.map(item => item.write),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom align="center">
            Overall Performance
          </Typography>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <div className={classes.performanceGauge}>
              <div 
                className={classes.gaugeFill} 
                style={{ 
                  height: `${performanceData.overallPerformance}%`,
                  backgroundColor: getGaugeColor(performanceData.overallPerformance)
                }}
              />
              <div className={classes.gaugeValue}>
                {performanceData.overallPerformance}%
              </div>
            </div>
            <Typography variant="body1" style={{ marginTop: 16 }}>
              {performanceData.overallPerformance >= 80 ? 'Good' : 
               performanceData.overallPerformance >= 60 ? 'Fair' : 'Poor'}
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Response Time
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Average
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.responseTime.average} ms
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Min
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.responseTime.min} ms
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Max
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.responseTime.max} ms
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line data={responseTimeData} options={chartOptions} />
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            CPU Usage
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Current
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.cpuUsage.current}%
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Average
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.cpuUsage.average}%
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Peak
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.cpuUsage.peak}%
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line data={cpuUsageData} options={chartOptions} />
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Memory Usage
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Current
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.memoryUsage.current}%
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Average
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.memoryUsage.average}%
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Peak
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.memoryUsage.peak}%
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line data={memoryUsageData} options={chartOptions} />
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Disk I/O
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Read Rate
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.diskIO.readRate} MB/s
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Write Rate
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.diskIO.writeRate} MB/s
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line data={diskIOData} options={chartOptions} />
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Connection Count
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Current
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.connectionCount.current}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Average
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.connectionCount.average}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" className={classes.statLabel}>
                Peak
              </Typography>
              <Typography variant="h5" className={classes.statValue}>
                {performanceData.connectionCount.peak}
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line 
              data={{
                labels: performanceData.connectionCount.trend.map(item => {
                  const date = new Date(item.timestamp);
                  return date.toLocaleDateString();
                }),
                datasets: [
                  {
                    label: 'Connection Count',
                    data: performanceData.connectionCount.trend.map(item => item.value),
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1
                  }
                ]
              }} 
              options={chartOptions} 
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DatabasePerformance;
