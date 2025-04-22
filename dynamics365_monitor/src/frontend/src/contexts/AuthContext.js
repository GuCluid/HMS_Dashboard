import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check', { withCredentials: true });
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function - redirects to backend auth route
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
      setError('Failed to logout');
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.get('/auth/refresh-token', { withCredentials: true });
      return response.data.success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setError('Failed to refresh authentication token');
      return false;
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
