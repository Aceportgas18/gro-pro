import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api'; // axios instance with withCredentials:true

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload || null,
      };
    case 'CLEAR_ERRORS':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔹 Load currently logged-in user (via cookie)
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.data });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Authentication failed',
      });
    }
  }, []);

  // 🔹 Register user
  const register = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/register', formData);
      await loadUser(); // loads user from cookie
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed',
      });
      return { success: false, error: err.response?.data?.message };
    }
  };

  // 🔹 Login user
  const login = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/login', formData);
      await loadUser(); // loads user from cookie
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed',
      });
      return { success: false, error: err.response?.data?.message };
    }
  };

  // 🔹 Admin login
  const adminLogin = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/auth/admin-login', formData);
      await loadUser();
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Admin login failed',
      });
      return { success: false, error: err.response?.data?.message };
    }
  };

  // 🔹 Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // clears cookie server-side
    } catch (err) {
      console.warn('Logout failed (still clearing locally):', err.message);
    }
    dispatch({ type: 'LOGOUT' });
  };

  // 🔹 Clear error messages
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // 🔹 Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      dispatch({ type: 'USER_LOADED', payload: res.data.data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Profile update failed' };
    }
  };

  // 🔹 Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        adminLogin,
        logout,
        clearErrors,
        updateProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
