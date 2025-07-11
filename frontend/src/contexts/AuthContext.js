import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  // Add a mock role for frontend testing
  mockRole: localStorage.getItem('mockRole') || 'owner', // can be 'admin', 'owner', 'backer', 'jobseeker', 'employer'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'USER_LOADED':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['user-id'] = state.user?._id || state.user?.id;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['user-id'];
    }
  };

  // Load user
  const loadUser = async () => {
    if (state.token) {
      setAuthToken(state.token);
      try {
        const res = await axios.get('/api/auth/me');
        dispatch({ type: 'USER_LOADED', payload: res.data.user });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed';
      return { success: false, error };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      return { success: false, error };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['user-id'];
    // Redirect to home page
    window.location.href = '/';
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData);
      dispatch({ type: 'UPDATE_USER', payload: res.data.data });
      await loadUser(); // Refresh user object with latest info
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Profile update failed';
      return { success: false, error };
    }
  };

  // Change password
  const changePassword = async (formData) => {
    try {
      await axios.put('/api/users/password', formData);
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Password change failed';
      return { success: false, error };
    }
  };

  // For frontend-only: allow switching mock role if no user is loaded
  const setMockRole = (role) => {
    localStorage.setItem('mockRole', role);
    window.location.reload();
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    setMockRole, // for switching roles in the UI
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 