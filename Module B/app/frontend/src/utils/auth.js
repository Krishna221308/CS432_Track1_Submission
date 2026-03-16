/**
 * Mock authentication utility for FreshWash template.
 * Stores role in localStorage for persistence during demonstration.
 */

export const login = (username, password, selectedRole = null) => {
  // Check for signed up user first
  const storedProfiles = JSON.parse(localStorage.getItem('freshwash_profiles') || '[]');
  const profile = storedProfiles.find(p => p.username === username);

  let role = selectedRole || 'user';
  
  if (profile) {
    role = profile.role;
  } else {
    // Fallback for default test credentials
    if (username === 'admin') role = 'admin';
    if (username === 'employee') role = 'employee';
  }
  
  localStorage.setItem('freshwash_role', role);
  localStorage.setItem('freshwash_user', username);
  
  const userObj = profile ? { ...profile } : {
    username: username,
    role: role,
    memberId: role === 'user' ? 'MEM-001' : undefined,
    employeeId: role === 'employee' ? 'EMP-001' : undefined,
    name: username.charAt(0).toUpperCase() + username.slice(1)
  };
  
  localStorage.setItem('user', JSON.stringify(userObj));
  
  return role;
};

export const signup = (profileData) => {
  const storedProfiles = JSON.parse(localStorage.getItem('freshwash_profiles') || '[]');
  
  // Check if username already exists
  if (storedProfiles.some(p => p.username === profileData.username)) {
    throw new Error('Username already exists');
  }

  const newProfile = {
    ...profileData,
    id: profileData.role === 'employee' ? `EMP-${Date.now()}` : `MEM-${Date.now()}`
  };

  if (profileData.role === 'employee') {
    newProfile.employeeId = newProfile.id;
  } else if (profileData.role === 'user') {
    newProfile.memberId = newProfile.id;
  }

  storedProfiles.push(newProfile);
  localStorage.setItem('freshwash_profiles', JSON.stringify(storedProfiles));
  
  // Automatically log in after signup
  return login(newProfile.username, null, newProfile.role);
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
