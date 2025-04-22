const express = require('express');
const passport = require('passport');
const router = express.Router();
const logger = require('../utils/logger');
const tokenManager = require('../utils/tokenManager');

// Login route
router.get('/login', passport.authenticate('azuread-openidconnect', {
  response: 'code',
  prompt: 'login',
  failureRedirect: '/'
}));

// Authentication callback route
router.post('/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    logger.info('Authentication callback successful');
    // Successful authentication, redirect to dashboard
    res.redirect(process.env.CLIENT_URL + '/dashboard' || 'http://localhost:3000/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  logger.info(`User logged out: ${req.user?.profile?.displayName || 'Unknown user'}`);
  req.logout(function(err) {
    if (err) { 
      logger.error(`Logout error: ${err}`);
      return next(err); 
    }
    res.redirect('/');
  });
});

// Route to check if user is authenticated
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    logger.debug(`Auth check: User is authenticated - ${req.user.profile.displayName}`);
    res.json({ 
      authenticated: true, 
      user: {
        displayName: req.user.profile.displayName,
        email: req.user.profile.emails?.[0] || '',
        id: req.user.profile.oid
      }
    });
  } else {
    logger.debug('Auth check: User is not authenticated');
    res.json({ authenticated: false });
  }
});

// Route to refresh token
router.get('/refresh-token', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const refreshToken = req.user.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token available' });
    }

    const isExpired = tokenManager.isTokenExpired(req.user.accessToken);
    if (isExpired) {
      logger.info(`Refreshing token for user: ${req.user.profile.displayName}`);
      const tokens = await tokenManager.refreshAccessToken(refreshToken);
      
      // Update user session with new tokens
      req.user.accessToken = tokens.accessToken;
      req.user.refreshToken = tokens.refreshToken;
      
      return res.json({ success: true, message: 'Token refreshed successfully' });
    }
    
    return res.json({ success: true, message: 'Token is still valid' });
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;
