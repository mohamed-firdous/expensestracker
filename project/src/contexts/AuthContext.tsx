import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { users } from '../data/mockData';

// Define the context shape
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would verify credentials with your backend
      // For this mock, we'll just check if the email exists
      const user = users.find(u => u.email === email);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid email or password',
        });
        return false;
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An error occurred during login',
      });
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Email already in use',
        }));
        return false;
      }
      
      // In a real app, you would create a user in your backend
      // For this mock, we'll just create a new user object
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
      };
      
      // Store the user
      users.push(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An error occurred during registration',
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!state.user) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No user is currently logged in',
        }));
        return false;
      }
      
      // Update user data
      const updatedUser = {
        ...state.user,
        ...userData,
      };
      
      // Update user in users array
      const userIndex = users.findIndex(u => u.id === state.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
      }
      
      // Store updated user
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred while updating user data',
      }));
      return false;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};