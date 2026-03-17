/**
 * Validation utility functions for user input
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true, message: '' };
};

// Phone number validation (exactly 10 digits)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  if (!phone) return { valid: false, message: 'Phone number is required' };
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
    return { valid: false, message: 'Phone number must be exactly 10 digits' };
  }
  return { valid: true, message: '' };
};

// Age validation (between 18 and 100)
export const validateAge = (age) => {
  const ageNum = parseInt(age);
  if (!age) return { valid: false, message: 'Age is required' };
  if (isNaN(ageNum)) return { valid: false, message: 'Age must be a number' };
  if (ageNum < 18) return { valid: false, message: 'Age must be at least 18 years old' };
  if (ageNum > 100) return { valid: false, message: 'Age must be 100 or less' };
  return { valid: true, message: '' };
};

// Password strength validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) return { valid: false, strength: 0, message: 'Password is required', errors };
  
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least 1 uppercase letter (A-Z)');
  if (!/[a-z]/.test(password)) errors.push('At least 1 lowercase letter (a-z)');
  if (!/\d/.test(password)) errors.push('At least 1 number (0-9)');
  if (!/[@$!%*?&]/.test(password)) errors.push('At least 1 special character (@$!%*?&)');

  // Calculate strength
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[@$!%*?&]/.test(password)) strength += 1;

  if (errors.length === 0) {
    return { valid: true, strength: 5, message: 'Password is strong', errors: [] };
  }

  return {
    valid: false,
    strength,
    message: `Password must have: ${errors.join(', ')}`,
    errors
  };
};

// Username validation (3-20 chars, alphanumeric and underscore)
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username) return { valid: false, message: 'Username is required' };
  if (!usernameRegex.test(username)) {
    return { 
      valid: false, 
      message: 'Username must be 3-20 characters, only letters, numbers, and underscores' 
    };
  }
  return { valid: true, message: '' };
};

// Full name validation
export const validateFullName = (name) => {
  if (!name) return { valid: false, message: 'Full name is required' };
  if (name.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
  if (name.length > 50) return { valid: false, message: 'Name must be less than 50 characters' };
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true, message: '' };
};

// Validation function for entire signup form
export const validateSignupForm = (formData) => {
  const errors = {};

  const usernameVal = validateUsername(formData.username);
  if (!usernameVal.valid) errors.username = usernameVal.message;

  const passwordVal = validatePassword(formData.password);
  if (!passwordVal.valid) errors.password = passwordVal.message;

  const nameVal = validateFullName(formData.name);
  if (!nameVal.valid) errors.name = nameVal.message;

  const phoneVal = validatePhoneNumber(formData.contact);
  if (!phoneVal.valid) errors.contact = phoneVal.message;

  const ageVal = validateAge(formData.age);
  if (!ageVal.valid) errors.age = ageVal.message;

  const emailVal = validateEmail(formData.email);
  if (!emailVal.valid) errors.email = emailVal.message;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordStrength: validatePassword(formData.password).strength
  };
};
