import React from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';

const LoadingScreen = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
