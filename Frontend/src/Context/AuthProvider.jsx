import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Check if 'Users' exists in localStorage before attempting to parse it
  const initialUser = (() => {
    const storedUser = localStorage.getItem('Users');
    if (storedUser) {
      try {
        return JSON.parse(storedUser); // Only parse if storedUser is not null or undefined
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        return null;
      }
    }
    return null;
  })();

  const [currentUser, setCurrentUser] = useState(initialUser);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('Users', JSON.stringify(user)); // Save user to localStorage
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('Users'); // Remove user data from localStorage
  };

  const updateProfile = (updatedUser) => {
    setCurrentUser((prevUser) => {
      if (JSON.stringify(prevUser) === JSON.stringify(updatedUser)) {
        return prevUser; // Prevent unnecessary updates
      }
      localStorage.setItem("Users", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    updateProfile,
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

