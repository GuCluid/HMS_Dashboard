const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const logger = require('./utils/logger');

// Configuration for Azure AD authentication
const config = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.CLIENT_ID,
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: process.env.REDIRECT_URL || 'http://localhost:3001/auth/callback',
  allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production',
  clientSecret: process.env.CLIENT_SECRET,
  validateIssuer: true,
  issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
  passReqToCallback: false,
  scope: ['openid', 'profile', 'email', 'offline_access', 'https://dynamics.microsoft.com/user_impersonation'],
  loggingLevel: 'info',
  nonceLifetime: 3600,
  nonceMaxAmount: 10,
  useCookieInsteadOfSession: false,
  cookieEncryptionKeys: [
    { 
      key: process.env.COOKIE_KEY || '12345678901234567890123456789012', 
      iv: process.env.COOKIE_IV || '123456789012' 
    }
  ],
  clockSkew: 300,
};

// Configure passport with Azure AD strategy
passport.use(new OIDCStrategy(config, (iss, sub, profile, accessToken, refreshToken, done) => {
  logger.info(`User authenticated: ${profile.displayName}`);
  
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
