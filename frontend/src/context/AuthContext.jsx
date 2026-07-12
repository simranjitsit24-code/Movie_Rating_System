import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch user on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log('👤 Fetching user...');
      const response = await axios.get('/api/auth/me');
      console.log('✅ User fetched:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('❌ Fetch user error:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Registering user:', { name, email });
      
      const response = await axios.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });

      console.log('✅ Registration response:', response.data);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        return { 
          success: false, 
          error: error.response.data?.error || 'Registration failed'
        };
      } else if (error.request) {
        console.error('No response received');
        return { 
          success: false, 
          error: 'No response from server. Please try again.'
        };
      } else {
        console.error('Error:', error.message);
        return { 
          success: false, 
          error: 'An error occurred during registration.'
        };
      }
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Logging in:', { email });
      
      const response = await axios.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password
      });

      console.log('✅ Login response:', response.data);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        return { 
          success: false, 
          error: error.response.data?.error || 'Login failed'
        };
      } else if (error.request) {
        console.error('No response received');
        return { 
          success: false, 
          error: 'No response from server. Please try again.'
        };
      } else {
        console.error('Error:', error.message);
        return { 
          success: false, 
          error: 'An error occurred during login.'
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    console.log('👋 Logged out');
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put('/api/auth/profile', data);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Update failed'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};