import React from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  makeStyles 
} from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.grey[100]
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 500
  },
  logo: {
    marginBottom: theme.spacing(3),
    width: 80,
    height: 80
  },
  button: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1, 4)
  },
  subtitle: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  }
}));

const Login = () => {
  const classes = useStyles();
  const { login, error, clearError } = useAuth();

  // Clear any authentication errors when component mounts
  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className={classes.container}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dynamics 365 Monitoring
          </Typography>
          
          <Typography variant="subtitle1" className={classes.subtitle}>
            Sign in with your Microsoft account to access the monitoring dashboard
          </Typography>
          
          {error && (
            <Box mt={2} p={2} bgcolor="error.light" color="error.contrastText" borderRadius={4}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={login}
            size="large"
            className={classes.button}
          >
            Sign in with Microsoft Account
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
