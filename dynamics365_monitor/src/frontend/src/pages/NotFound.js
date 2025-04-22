import React from 'react';
import { Typography, Box, Paper } from '@material-ui/core';

const NotFound = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '500px' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Return to Dashboard
          </button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
