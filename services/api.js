import axios from 'axios';

const API_BASE = 'https://backendtesting-production-dcfc.up.railway.app';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check for token in multiple possible storage keys
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('user')?.token;
    
    // Check if this is a mock user (local authentication)
    const userData = localStorage.getItem('user_data');
    let isMockUser = false;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        isMockUser = user.isMockUser || user.token?.startsWith('mock_token_');
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // For cart operations with mock users, we should not make API calls
    if (isMockUser && config.url && config.url.includes('/api/cart/')) {
      console.log('Mock user detected for cart operation - this should be handled by the cart API functions');
      // We'll let the cart API functions handle this
    }
    
    if (token && !isMockUser) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', token.substring(0, 20) + '...');
    } else if (isMockUser) {
      console.log('Mock user detected - skipping API call for:', config.url);
      // For mock users, we'll handle this in the response interceptor
    } else {
      console.log('No auth token found for request');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a mock user
    const userData = localStorage.getItem('user_data');
    let isMockUser = false;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        isMockUser = user.isMockUser || user.token?.startsWith('mock_token_');
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // For mock users, handle API calls locally
    if (isMockUser && error.response?.status === 401) {
      console.log('Mock user detected - handling API call locally');
      
      // Handle different API endpoints for mock users
      const url = originalRequest.url;
      
      if (url.includes('/api/auth/profile/update/')) {
        // Mock profile update response
        const mockResponse = {
          data: {
            user: JSON.parse(localStorage.getItem('user_data')),
            message: 'Profile updated successfully'
          },
          status: 200,
          statusText: 'OK'
        };
        return Promise.resolve(mockResponse);
      }
      
      if (url.includes('/api/cart/')) {
        // Mock cart response
        const cartData = localStorage.getItem('cart') || '{"items": []}';
        const mockResponse = {
          data: JSON.parse(cartData),
          status: 200,
          statusText: 'OK'
        };
        return Promise.resolve(mockResponse);
      }
      
      // For other endpoints, return empty success response
      return Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK'
      });
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('401 error, attempting token refresh...');

      try {
        // Check for refresh token in multiple possible storage keys
        const refreshToken = localStorage.getItem('refresh_token') || 
                           localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          console.log('Token refreshed successfully');
          return api(originalRequest);
        } else {
          console.log('No refresh token found');
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        // Refresh token failed, clear tokens but don't redirect immediately
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      // The backend expects 'email' field, not 'username'
      const loginData = {
        email: credentials.username || credentials.email, // Handle both username and email fields
        password: credentials.password
      };
      
      return await api.post('/api/auth/login/', loginData);
    } catch (error) {
      console.error('Login API error:', error);
      // Instead of throwing, indicate backend is unavailable
      throw new Error('BACKEND_UNAVAILABLE');
    }
  },
  register: async (userData) => {
    try {
      // The backend uses 'registration' endpoint, not 'signup'
      return await api.post('/api/auth/registration/', userData);
    } catch (error) {
      console.error('Register API error:', error);
      // Instead of throwing, indicate backend is unavailable
      throw new Error('BACKEND_UNAVAILABLE');
    }
  },
  refreshToken: (refresh) => api.post('/api/auth/token/refresh/', { refresh }),
  getProfile: () => {
    // Check if user is mock user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isMockUser || user.token?.startsWith('mock_token_')) {
          // Return mock profile data
          return Promise.resolve({ data: user });
        }
      } catch (e) {
        // Continue with API call if parsing fails
      }
    }
    return api.get('/api/auth/profile/');
  },
  updateProfile: (profileData) => {
    // Check if user is mock user
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isMockUser || user.token?.startsWith('mock_token_')) {
          // Return mock success response
          return Promise.resolve({ 
            data: { 
              user: { ...user, ...profileData },
              message: 'Profile updated successfully' 
            } 
          });
        }
      } catch (e) {
        // Continue with API call if parsing fails
      }
    }
    return api.post('/api/auth/profile/update/', profileData);
  },
};

// Meals API
export const mealsAPI = {
  getAll: (search = '') => api.get(`/api/meals/${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/api/meals/${id}/`),
};

// Delivery API
export const deliveryAPI = {
  getTypes: () => api.get('/api/delivery-types/'),
  getLocations: () => api.get('/api/locations/'),
};

// Cart API
export const cartAPI = {
  get: async () => {
    try {
      // Check if user is mock user first
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isMockUser || user.token?.startsWith('mock_token_')) {
            console.log('Mock user detected - returning local cart data');
            const cartData = localStorage.getItem('localCart') || '{"items": [], "total_amount": 0}';
            return Promise.resolve({ data: JSON.parse(cartData) });
          }
        } catch (e) {
          // Continue with API call if parsing fails
        }
      }
      
      return await api.get('/api/cart/');
    } catch (error) {
      console.error('Cart get API error:', error);
      // Return mock cart data if API fails
      const cartData = localStorage.getItem('localCart') || '{"items": [], "total_amount": 0}';
      return Promise.resolve({ data: JSON.parse(cartData) });
    }
  },
  add: async (item) => {
    try {
      // Check if user is mock user first
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isMockUser || user.token?.startsWith('mock_token_')) {
            console.log('Mock user detected - skipping cart API call');
            throw new Error('BACKEND_UNAVAILABLE');
          }
        } catch (e) {
          // Continue with API call if parsing fails
        }
      }
      
      return await api.post('/api/cart/', item);
    } catch (error) {
      console.error('Cart add API error:', error);
      // Indicate backend is unavailable for cart operations
      throw new Error('BACKEND_UNAVAILABLE');
    }
  },
  update: async (itemId, item) => {
    try {
      // Check if user is mock user first
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isMockUser || user.token?.startsWith('mock_token_')) {
            console.log('Mock user detected - skipping cart API call');
            throw new Error('BACKEND_UNAVAILABLE');
          }
        } catch (e) {
          // Continue with API call if parsing fails
        }
      }
      
      return await api.put(`/api/cart/${itemId}/`, item);
    } catch (error) {
      console.error('Cart update API error:', error);
      // Indicate backend is unavailable for cart operations
      throw new Error('BACKEND_UNAVAILABLE');
    }
  },
  remove: async (itemId) => {
    try {
      // Check if user is mock user first
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isMockUser || user.token?.startsWith('mock_token_')) {
            console.log('Mock user detected - skipping cart API call');
            throw new Error('BACKEND_UNAVAILABLE');
          }
        } catch (e) {
          // Continue with API call if parsing fails
        }
      }
      
      return await api.delete(`/api/cart/${itemId}/`);
    } catch (error) {
      console.error('Cart remove API error:', error);
      // Indicate backend is unavailable for cart operations
      throw new Error('BACKEND_UNAVAILABLE');
    }
  },
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/api/orders/'),
  getById: (id) => api.get(`/api/orders/${id}/`),
  create: (order) => api.post('/api/orders/', order),
};

// Dynamic Data Management
export const dynamicDataAPI = {
  // Update sample meals dynamically (for when backend is not available)
  updateSampleMeals: (meals) => {
    localStorage.setItem('sampleMeals', JSON.stringify(meals));
  },
  
  // Get sample meals from localStorage
  getSampleMeals: () => {
    const stored = localStorage.getItem('sampleMeals');
    return stored ? JSON.parse(stored) : null;
  },
  
  // Update delivery locations dynamically
  updateDeliveryLocations: (locations) => {
    localStorage.setItem('deliveryLocations', JSON.stringify(locations));
  },
  
  // Get delivery locations from localStorage
  getDeliveryLocations: () => {
    const stored = localStorage.getItem('deliveryLocations');
    return stored ? JSON.parse(stored) : null;
  },
  
  // Update fees dynamically
  updateFees: (fees) => {
    localStorage.setItem('deliveryFees', JSON.stringify(fees));
  },
  
  // Get fees from localStorage
  getFees: () => {
    const stored = localStorage.getItem('deliveryFees');
    return stored ? JSON.parse(stored) : null;
  }
};

export default api; 