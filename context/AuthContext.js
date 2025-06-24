import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        
        // Ensure the user is also stored locally for fallback authentication
        const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const existingUserIndex = storedUsers.findIndex(u => u.email === user.email);
        
        if (existingUserIndex === -1) {
          // User not in local storage, add them
          storedUsers.push({
            username: user.username || user.email?.split('@')[0],
            email: user.email,
            password: 'unknown', // We don't have the password, but this is for fallback
            id: user.id || Date.now(),
            isMockUser: false
          });
          localStorage.setItem('mock_users', JSON.stringify(storedUsers));
          console.log('Synced current user to local storage:', user);
          console.log('Updated stored users:', storedUsers);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
      }
    }
    
    // Create a default test user if no users exist
    const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (storedUsers.length === 0) {
      const defaultUser = {
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        id: Date.now(),
        isMockUser: true
      };
      localStorage.setItem('mock_users', JSON.stringify([defaultUser]));
      console.log('Created default test user:', defaultUser);
    }
    
    // Debug: List stored users
    const updatedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (updatedUsers.length > 0) {
      console.log('Stored users on app start:', updatedUsers);
    } else {
      console.log('No stored users found on app start');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try backend first
      const response = await authAPI.login({ username: email, password });
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const userData = { 
        ...user, // Use the user data from backend response
        token: access,
        id: user.id || Date.now()
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      
      // Also store the user locally for fallback authentication
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const existingUserIndex = storedUsers.findIndex(u => u.email === email);
      
      if (existingUserIndex !== -1) {
        // Update existing user
        storedUsers[existingUserIndex] = {
          ...storedUsers[existingUserIndex],
          username: user.username || user.email?.split('@')[0],
          email: user.email,
          password: password // Store the password for local authentication
        };
      } else {
        // Add new user
        storedUsers.push({
          username: user.username || user.email?.split('@')[0],
          email: user.email,
          password: password,
          id: user.id || Date.now(),
          isMockUser: false // This is a real backend user
        });
      }
      
      localStorage.setItem('mock_users', JSON.stringify(storedUsers));
      console.log('User logged in via backend and stored locally:', userData);
      console.log('Updated stored users:', storedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Backend login failed, trying fallback:', error);
      
      // Check if backend is unavailable
      if (error.message === 'BACKEND_UNAVAILABLE') {
        console.log('Backend unavailable, using local authentication');
      }
      
      // Check if this is a valid user in our local storage
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      console.log('Attempting login with:', { email, password });
      console.log('Available stored users:', storedUsers);
      
      const user = storedUsers.find(u => 
        (u.email === email || u.username === email) && 
        u.password === password
      );
      
      if (!user) {
        console.log('Login failed: Invalid credentials for', email);
        console.log('Stored users:', storedUsers);
        
        if (storedUsers.length === 0) {
          throw new Error('No users registered yet. Please register first to create an account.');
        } else {
          // Check if email exists but password is wrong
          const userWithEmail = storedUsers.find(u => u.email === email || u.username === email);
          if (userWithEmail) {
            throw new Error('PASSWORD_INCORRECT');
          } else {
            throw new Error('EMAIL_NOT_FOUND');
          }
        }
      }
      
      console.log('Found matching user:', user);
      
      // Create a mock user for testing
      const userData = { 
        ...user, // Preserve all user data including any updated fields
        token: 'mock_token_' + Date.now(),
        isMockUser: true
      };
      
      localStorage.setItem('access_token', userData.token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    }
  };

  const register = async (userData) => {
    try {
      // Try backend first
      const response = await authAPI.register(userData);
      
      // If backend registration is successful, also log the user in
      if (response.data) {
        const { access, refresh, user } = response.data;
        
        // Store tokens
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        
        // Store user data
        const userDataToStore = { 
          ...user,
          token: access,
          id: user.id || Date.now()
        };
        localStorage.setItem('user_data', JSON.stringify(userDataToStore));
        setUser(userDataToStore);
        
        // Also store the user locally for fallback authentication
        const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const existingUserIndex = storedUsers.findIndex(u => u.email === userData.email);
        
        if (existingUserIndex !== -1) {
          // Update existing user
          storedUsers[existingUserIndex] = {
            ...storedUsers[existingUserIndex],
            username: user.username || userData.username,
            email: user.email,
            password: userData.password // Store the password for local authentication
          };
        } else {
          // Add new user
          storedUsers.push({
            username: user.username || userData.username,
            email: user.email,
            password: userData.password,
            id: user.id || Date.now(),
            isMockUser: false // This is a real backend user
          });
        }
        
        localStorage.setItem('mock_users', JSON.stringify(storedUsers));
        console.log('User registered via backend and stored locally:', userDataToStore);
        console.log('Updated stored users:', storedUsers);
        
        return { success: true };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Backend registration failed, using fallback:', error);
      
      // Check if backend is unavailable
      if (error.message === 'BACKEND_UNAVAILABLE') {
        console.log('Backend unavailable, using local registration');
      }
      
      // Fallback: Store user data locally for testing
      const mockUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password, // Store password for local authentication
        id: Date.now(),
        isMockUser: true
      };
      
      // Store in localStorage for demo purposes
      const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      
      // Check if user already exists
      const existingUser = existingUsers.find(u => 
        u.email === userData.email || u.username === userData.username
      );
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }
      
      existingUsers.push(mockUser);
      localStorage.setItem('mock_users', JSON.stringify(existingUsers));
      
      // Automatically log the user in after successful local registration
      const userDataToStore = { 
        email: mockUser.email,
        username: mockUser.username,
        token: 'mock_token_' + Date.now(),
        id: mockUser.id,
        isMockUser: true
      };
      
      localStorage.setItem('access_token', userDataToStore.token);
      localStorage.setItem('user_data', JSON.stringify(userDataToStore));
      setUser(userDataToStore);
      
      console.log('User registered and logged in locally:', mockUser);
      console.log('All stored users:', existingUsers);
      
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    
    // If this is a mock user, update the stored credentials
    if (userData.isMockUser) {
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const userIndex = storedUsers.findIndex(u => u.id === userData.id);
      
      if (userIndex !== -1) {
        // Update the stored user with all user data (except token and isMockUser)
        const { token, isMockUser, ...credentialsToUpdate } = userData;
        storedUsers[userIndex] = {
          ...storedUsers[userIndex],
          ...credentialsToUpdate
        };
        localStorage.setItem('mock_users', JSON.stringify(storedUsers));
        console.log('Stored credentials updated for user:', userData.id, 'New credentials:', credentialsToUpdate);
      }
    }
  };

  const updateCredentials = (userId, newCredentials) => {
    // Update stored credentials for local authentication
    const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    console.log('updateCredentials called with:', { userId, newCredentials });
    console.log('Current stored users:', storedUsers);
    
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    console.log('Found user at index:', userIndex);
    
    if (userIndex !== -1) {
      const oldUser = storedUsers[userIndex];
      storedUsers[userIndex] = {
        ...storedUsers[userIndex],
        ...newCredentials
      };
      localStorage.setItem('mock_users', JSON.stringify(storedUsers));
      console.log('Credentials updated for user:', userId);
      console.log('Old user data:', oldUser);
      console.log('New user data:', storedUsers[userIndex]);
      console.log('Updated stored users:', storedUsers);
    } else {
      console.log('User not found in stored users for ID:', userId);
    }
  };

  const getStoredCredentials = () => {
    // Helper function to check stored credentials (for debugging)
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  };

  const listStoredUsers = () => {
    // Helper function to list all stored users (for debugging)
    const users = getStoredCredentials();
    console.log('=== STORED USERS ===');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Username: ${user.username}, ID: ${user.id}`);
    });
    console.log('====================');
    return users;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    updateCredentials,
    getStoredCredentials,
    listStoredUsers,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 