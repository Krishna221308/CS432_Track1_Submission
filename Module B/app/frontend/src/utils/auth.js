/**
 * Mock authentication utility for FreshWash template.
 * Stores role in localStorage for persistence during demonstration.
 */

export const login = (username, password) => {
  // Simulate login logic - accepted roles: 'admin', 'employee', 'user'
  let role = 'user';
  if (username === 'admin') role = 'admin';
  if (username === 'employee') role = 'employee';
  
  localStorage.setItem('freshwash_role', role);
  localStorage.setItem('freshwash_user', username);
  return role;
};

export const logout = () => {
  localStorage.removeItem('freshwash_role');
  localStorage.removeItem('freshwash_user');
  window.location.href = '/';
};

export const getRole = () => {
  return localStorage.getItem('freshwash_role');
};

export const getUser = () => {
  return localStorage.getItem('freshwash_user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('freshwash_role');
};
