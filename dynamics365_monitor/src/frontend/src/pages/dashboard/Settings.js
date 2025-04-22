import React from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    minWidth: 120,
    width: '100%',
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  saveButton: {
    marginTop: theme.spacing(2),
  }
}));

const Settings = ({ environment }) => {
  const classes = useStyles();
  
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
  
  // Handle save settings
  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };
  
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Settings
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Configure monitoring settings for {environmentDetails.name} ({environmentDetails.url})
      </Typography>
      
      <Paper className={classes.paper}>
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            General Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Dashboard Refresh Interval (seconds)"
                  type="number"
                  defaultValue={30}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="default-environment-label">Default Environment</InputLabel>
                <Select
                  labelId="default-environment-label"
                  id="default-environment"
                  value={environment}
                  label="Default Environment"
                >
                  <MenuItem value="prod">Production</MenuItem>
                  <MenuItem value="preprod">Preprod</MenuItem>
                  <MenuItem value="uat">UAT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Enable Real-time Updates"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Show Notifications"
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        <Divider className={classes.divider} />
        
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Error Monitoring Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="error-severity-label">Minimum Error Severity to Display</InputLabel>
                <Select
                  labelId="error-severity-label"
                  id="error-severity"
                  defaultValue="info"
                  label="Minimum Error Severity to Display"
                >
                  <MenuItem value="critical">Critical Only</MenuItem>
                  <MenuItem value="warning">Warning and Above</MenuItem>
                  <MenuItem value="info">All Errors</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Error Retention Period (days)"
                  type="number"
                  defaultValue={30}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Email Notifications for Critical Errors"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Notification Email"
                  type="email"
                  defaultValue="admin@example.com"
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        <Divider className={classes.divider} />
        
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Database Monitoring Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Slow Query Threshold (ms)"
                  type="number"
                  defaultValue={500}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Database Metrics Retention (days)"
                  type="number"
                  defaultValue={90}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Monitor Deadlocks"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Monitor Query Performance"
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        <Divider className={classes.divider} />
        
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Integration Monitoring Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="docusign-refresh-label">DocuSign Status Refresh Interval</InputLabel>
                <Select
                  labelId="docusign-refresh-label"
                  id="docusign-refresh"
                  defaultValue={15}
                  label="DocuSign Status Refresh Interval"
                >
                  <MenuItem value={5}>Every 5 minutes</MenuItem>
                  <MenuItem value={15}>Every 15 minutes</MenuItem>
                  <MenuItem value={30}>Every 30 minutes</MenuItem>
                  <MenuItem value={60}>Every hour</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="API Call Throttling Threshold"
                  type="number"
                  defaultValue={1000}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Monitor DocuSign Integration"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Alert on Integration Failures"
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        <Divider className={classes.divider} />
        
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Activity Monitoring Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="User Activity Retention (days)"
                  type="number"
                  defaultValue={60}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="activity-detail-label">Activity Detail Level</InputLabel>
                <Select
                  labelId="activity-detail-label"
                  id="activity-detail"
                  defaultValue="medium"
                  label="Activity Detail Level"
                >
                  <MenuItem value="low">Basic (User logins only)</MenuItem>
                  <MenuItem value="medium">Standard (Logins and major operations)</MenuItem>
                  <MenuItem value="high">Detailed (All user activities)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Track Business Process Flows"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={<Switch color="primary" defaultChecked />}
                  label="Track Entity Operations"
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            className={classes.saveButton}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default Settings;
