# Authentication System Design for Dynamics 365 Monitoring Dashboard

## Overview

The authentication system for the Dynamics 365 Monitoring Dashboard will leverage Microsoft Identity Platform (Azure AD) to provide secure access to the monitoring dashboard. This approach ensures seamless integration with existing Microsoft accounts and provides robust security features.

## Authentication Flow

The system will implement the OAuth 2.0 authorization code flow with PKCE (Proof Key for Code Exchange) for enhanced security. This flow is recommended for web applications and provides the following benefits:

1. Secure token handling
2. Support for refresh tokens
3. Protection against CSRF attacks
4. Compliance with modern security standards

## Implementation Steps

### 1. Register Application in Azure AD

```javascript
// Steps to register the application in Azure AD
// 1. Sign in to the Azure portal
// 2. Navigate to Azure Active Directory
// 3. Select "App registrations" and then "New registration"
// 4. Enter application name: "Dynamics 365 Monitoring Dashboard"
// 5. Set supported account types to "Single tenant"
// 6. Set redirect URI to the application's callback URL
// 7. Register the application and note the Application (client) ID
```

### 2. Configure Authentication in Node.js Backend

```javascript
// auth.js - Authentication configuration
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Configuration for Azure AD authentication
const config = {
  identityMetadata: 'https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid-configuration',
  clientID: '{client-id}',
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: 'http://localhost:3000/auth/callback',
  allowHttpForRedirectUrl: false,
  clientSecret: '{client-secret}',
  validateIssuer: true,
  issuer: 'https://login.microsoftonline.com/{tenant-id}/v2.0',
  passReqToCallback: false,
  scope: ['openid', 'profile', 'email', 'offline_access', 'https://dynamics.microsoft.com/user_impersonation'],
  loggingLevel: 'info',
  nonceLifetime: 3600,
  nonceMaxAmount: 10,
  useCookieInsteadOfSession: false,
  cookieEncryptionKeys: [
    { key: '{encryption-key}', iv: '{initialization-vector}' }
  ],
  clockSkew: 300,
};

// Configure passport with Azure AD strategy
passport.use(new OIDCStrategy(config, (iss, sub, profile, accessToken, refreshToken, done) => {
  // Save user profile, access token, and refresh token
  return done(null, {
    profile,
    accessToken,
    refreshToken
  });
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
```

### 3. Create Authentication Routes

```javascript
// authRoutes.js - Authentication routes
const express = require('express');
const passport = require('passport');
const router = express.Router();

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
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Route to check if user is authenticated
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user.profile });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
```

### 4. Configure Express Server with Authentication Middleware

```javascript
// server.js - Main server file
const express = require('express');
const session = require('express-session');
const passport = require('./auth');
const authRoutes = require('./authRoutes');
const cors = require('cors');
const app = express();

// Configure middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(session({
  secret: '{session-secret}',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use('/auth', authRoutes);

// Protected route middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Protected API routes
app.use('/api', ensureAuthenticated, require('./apiRoutes'));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. Implement Authentication in React Frontend

```javascript
// AuthContext.js - Authentication context for React
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check', { withCredentials: true });
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = () => {
    window.location.href = '/auth/login';
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/auth/logout', { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
```

### 6. Create Login Component

```javascript
// Login.js - Login component
import React from 'react';
import { useAuth } from './AuthContext';
import { Button, Container, Typography, Box, Paper } from '@material-ui/core';

const Login = () => {
  const { login } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box my={4} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={3} style={{ padding: '2rem', width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Dynamics 365 Monitoring Dashboard
          </Typography>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={login}
              size="large"
            >
              Sign in with Microsoft Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
```

### 7. Implement Protected Routes

```javascript
// ProtectedRoute.js - Protected route component
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
```

### 8. Configure App Routes

```javascript
// App.js - Main application component
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Dashboard from './Dashboard';
import NotFound from './NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

## Token Management

The authentication system will handle token management, including:

1. **Token Storage**: Securely store access and refresh tokens
2. **Token Refresh**: Automatically refresh tokens when they expire
3. **Token Validation**: Validate tokens before making API requests

```javascript
// tokenManager.js - Token management utilities
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token', {
      client_id: '{client-id}',
      scope: 'https://dynamics.microsoft.com/user_impersonation',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_secret: '{client-secret}'
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

module.exports = {
  isTokenExpired,
  refreshAccessToken
};
```

## Security Considerations

The authentication system implements several security best practices:

1. **HTTPS Only**: All communication is encrypted using HTTPS
2. **Token Security**: Access tokens are never exposed to the client-side JavaScript
3. **CSRF Protection**: Implemented through the use of state parameters in OAuth flow
4. **Session Management**: Secure session handling with proper timeout and cookie settings
5. **Principle of Least Privilege**: Request only the permissions needed for the application

## Testing Authentication

To ensure the authentication system works correctly, the following tests will be implemented:

1. **Login Flow Test**: Verify the complete login flow works correctly
2. **Token Refresh Test**: Ensure tokens are refreshed properly when expired
3. **Authorization Test**: Verify protected routes are only accessible to authenticated users
4. **Logout Test**: Ensure logout functionality works correctly
5. **Error Handling Test**: Verify proper handling of authentication errors

## Next Steps

After implementing the authentication system, the next steps will be:

1. Implement the error monitoring module
2. Implement the database monitoring module
3. Implement the integration monitoring module
4. Implement the activity monitoring module
5. Deploy and test the complete monitoring solution
