import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
}

interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

// Check if the token is valid (not expired)
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get the current user from the token
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('token');
  
  if (!token || !isTokenValid(token)) {
    return null;
  }
  
  try {
    // In a real app, we would decode the token and get the user info
    // For now, we'll just return a placeholder user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  } catch (error) {
    return null;
  }
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  
  return !!token && isTokenValid(token);
};

// Check if the user is an admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  
  return !!user && user.is_admin;
};

// Set the user and token in localStorage
export const setAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear the user and token from localStorage
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
