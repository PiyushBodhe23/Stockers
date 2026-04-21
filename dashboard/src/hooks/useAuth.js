import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token or decode user info
          const decoded = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: decoded.id, email: decoded.email, name: decoded.name });
          setToken(storedToken);
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    
    try {
      const decoded = JSON.parse(atob(authToken.split('.')[1]));
      const userData = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0]
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error decoding token:', error);
      setUser({ email: 'user', name: 'User' });
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user || !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;