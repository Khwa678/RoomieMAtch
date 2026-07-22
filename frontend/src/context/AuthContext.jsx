import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('rm_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authAPI.getMe();
      setUser(userData);
      await fetchUserProfile();
    } catch (error) {
      console.warn('[AuthContext] Session expired or invalid:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await profileAPI.getMeProfile();
      setUserProfile(profile);
      return profile;
    } catch (err) {
      setUserProfile(null);
      return null;
    }
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    localStorage.setItem('rm_token', res.token);
    setUser({ _id: res._id, name: res.name, email: res.email, profilePhotoUrl: res.profilePhotoUrl });
    await fetchUserProfile();
    return res;
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('rm_token', res.token);
    setUser({ _id: res._id, name: res.name, email: res.email, profilePhotoUrl: res.profilePhotoUrl });
    await fetchUserProfile();
    return res;
  };

  const googleLogin = async (idToken, googleUserFallback) => {
    const res = await authAPI.googleAuth({ idToken, googleUser: googleUserFallback });
    localStorage.setItem('rm_token', res.token);
    setUser({ _id: res._id, name: res.name, email: res.email, profilePhotoUrl: res.profilePhotoUrl });
    await fetchUserProfile();
    return res;
  };

  const logout = () => {
    localStorage.removeItem('rm_token');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signup,
        login,
        googleLogin,
        logout,
        fetchUserProfile,
      }}
    >
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
