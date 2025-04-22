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
import { Line, Bar } from 'react-chartjs-2';
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
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  }
}));

const UserActivity = ({ environment }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${environment}/activities/users`, {
          withCredentials: true
        });
        setActivityData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user activity data:', err);
        setError('Failed to load user activity data. Please try again later.');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
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
            Error Loading User Activity
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

  // Prepare data for active users chart
  const activeUsersData = {
    labels: activityData.activeUsers.trend.map(item => item.date),
    datasets: [
      {
        label: 'Active Users',
        data: activityData.activeUsers.trend.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for user sessions chart
  const userSessionsData = {
    labels: activityData.userSessions.trend.map(item => item.date),
    datasets: [
      {
        label: 'Sessions',
        data: activityData.userSessions.trend.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Avg Duration (min)',
        data: activityData.userSessions.trend.map(item => item.avgDuration),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  // Prepare data for users by role chart
  const usersByRoleData = {
    labels: Object.keys(activityData.usersByRole),
    datasets: [
      {
        label: 'Users by Role',
        data: Object.values(activityData.usersByRole),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare data for users by location chart
  const usersByLocationData = {
    labels: Object.keys(activityData.usersByLocation),
    datasets: [
      {
        label: 'Users by Location',
        data: Object.values(activityData.usersByLocation),
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Active Users (Last 7 Days)
          </Typography>
          <Box display="flex" justifyContent="center" mb={2}>
            <Box textAlign="center" mx={2}>
              <Typography variant="h4" className={classes.statValue}>
                {activityData.activeUsers.total}
              </Typography>
              <Typography variant="body2" className={classes.statLabel}>
                Active Users Today
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line 
              data={activeUsersData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Users'
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
            User Sessions (Last 7 Days)
          </Typography>
          <Box display="flex" justifyContent="space-around" mb={2}>
            <Box textAlign="center">
              <Typography variant="h4" className={classes.statValue}>
                {activityData.userSessions.total}
              </Typography>
              <Typography variant="body2" className={classes.statLabel}>
                Total Sessions
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" className={classes.statValue}>
                {activityData.userSessions.averageDuration} min
              </Typography>
              <Typography variant="body2" className={classes.statLabel}>
                Avg Session Duration
              </Typography>
            </Box>
          </Box>
          <div className={classes.chartContainer}>
            <Line 
              data={userSessionsData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Sessions'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Duration (min)'
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
      
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Top Users
          </Typography>
          <Grid container spacing={2}>
            {activityData.topUsers.map((user, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.userId}</Typography>
                  <Box mt={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body2" className={classes.statLabel}>Sessions</Typography>
                        <Typography variant="body1" fontWeight="bold">{user.sessions}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" className={classes.statLabel}>Actions</Typography>
                        <Typography variant="body1" fontWeight="bold">{user.actions}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" className={classes.statLabel}>Avg Duration</Typography>
                        <Typography variant="body1" fontWeight="bold">{user.avgSessionDuration} min</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Users by Role
          </Typography>
          <div className={classes.chartContainer}>
            <Bar 
              data={usersByRoleData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Users'
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
            Users by Location
          </Typography>
          <div className={classes.chartContainer}>
            <Bar 
              data={usersByLocationData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Users'
                    }
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

export default UserActivity;
