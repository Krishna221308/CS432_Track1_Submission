/**
 * Mock authentication utility for FreshWash template.
 * Stores role in localStorage for persistence during demonstration.
 */

export const login = (username, password, selectedRole = null) => {
  // TODO: Replace with real API call to backend
  // This currently just sets the role provided or defaults to 'user' for dev transition
  let role = selectedRole || 'user';
  
  localStorage.setItem('freshwash_role', role);
  localStorage.setItem('freshwash_user', username);
  
  const userObj = {
    username: username,
    role: role,
    name: username.charAt(0).toUpperCase() + username.slice(1)
  };
  
  localStorage.setItem('user', JSON.stringify(userObj));
  
  return role;
};

export const signup = (profileData) => {
  // TODO: Replace with real API call to backend
  // For now, it just logs in the user with the provided data
  return login(profileData.username, null, profileData.role);
};

export const logout = () => {
  localStorage.removeItem('freshwash_role');
  localStorage.removeItem('freshwash_user');
  localStorage.removeItem('user');
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
