import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mypet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user && user.token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            const updatedUser = { ...user, ...res.data.data };
            setUser(updatedUser);
            localStorage.setItem('mypet_user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('[AuthContext] Profile refresh error:', error);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem('mypet_user', JSON.stringify(res.data.data));
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem('mypet_user', JSON.stringify(res.data.data));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mypet_user');
  };

  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('mypet_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
