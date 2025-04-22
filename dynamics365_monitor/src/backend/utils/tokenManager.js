const axios = require('axios');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    logger.error(`Token validation error: ${error.message}`);
    return true;
  }
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('scope', 'https://dynamics.microsoft.com/user_impersonation');
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('client_secret', clientSecret);
    
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    logger.info('Token refreshed successfully');
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken
    };
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    throw error;
  }
};

// Get Dynamics 365 API client with authentication
const getDynamicsClient = (accessToken) => {
  return axios.create({
    baseURL: process.env.DYNAMICS_API_URL,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

module.exports = {
  isTokenExpired,
  refreshAccessToken,
  getDynamicsClient
};
