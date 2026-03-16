/**
 * Mock authentication utility for FreshWash template.
 * Stores role in localStorage for persistence during demonstration.
 */

export const login = (username, password, selectedRole = null) => {
  // Simulate login logic - accepted roles: 'admin', 'employee', 'user'
  let role = selectedRole || 'user';
  
  // Override role based on username if not explicitly selected
  if (username === 'admin') role = 'admin';
  if (username === 'employee') role = 'employee';
  
  localStorage.setItem('freshwash_role', role);
  localStorage.setItem('freshwash_user', username);
  
  // Store memberid/employeeid in user object for role-based data filtering
  const userObj = {
    username: username,
    role: role,
  };
  
  if (role === 'employee') {
    userObj.employeeId = 'EMP-001'; // Default employee
  } else if (role === 'user') {
    userObj.memberId = 'MEM-001'; // Default member
  }
  
  localStorage.setItem('user', JSON.stringify(userObj));
  
  return role;
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
