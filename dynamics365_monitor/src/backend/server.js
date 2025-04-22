// Production build configuration
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const passport = require('./auth');
const session = require('express-session');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const errorRoutes = require('./routes/errorRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// Configure middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dynamics365-monitor-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Not authenticated' });
};

// Auth routes
app.use('/auth', authRoutes);

// Protected API routes
app.use('/api', ensureAuthenticated, apiRoutes);

// Error monitoring routes
app.use('/api', ensureAuthenticated, errorRoutes);

// Database monitoring routes
app.use('/api', ensureAuthenticated, databaseRoutes);

// Integration monitoring routes
app.use('/api', ensureAuthenticated, integrationRoutes);

// Activity monitoring routes
app.use('/api', ensureAuthenticated, activityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../frontend/build');
  
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
        res.sendFile(path.join(staticPath, 'index.html'));
      }
    });
    
    logger.info('Serving static files from: ' + staticPath);
  } else {
    logger.error('Static path does not exist: ' + staticPath);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? undefined : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
