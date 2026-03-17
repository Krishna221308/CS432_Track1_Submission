import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { login, signup } from '../utils/auth';
import { useToast } from '../components/Toast';
import {
  validateEmail,
  validatePhoneNumber,
  validateAge,
  validatePassword,
  validateUsername,
  validateFullName,
  validateSignupForm,
} from '../utils/validation';
import '../styles/login.css';

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const addToast = useToast();

  // Real-time password strength check
  useMemo(() => {
    if (!isLogin && password) {
      const validation = validatePassword(password);
      setPasswordStrength(validation.strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (isLogin) {
      if (!username || !password || !role) {
        addToast('Please fill in all info', 'error');
        return;
      }

      try {
        // Pass the selected role for role-based login validation
        const authenticatedRole = await login(username, password, role);
        addToast('Login successful!', 'success');
        redirectUser(authenticatedRole);
      } catch (err) {
        setError(err.message);
        addToast(err.message, 'error');
      }
    } else {
      // Validation for signup
      if (!username || !password || !name || !contact || !age || !email) {
        addToast('All fields are required', 'error');
        return;
      }

      // Validate form
      const validation = validateSignupForm({
        username,
        password,
        name,
        contact,
        age,
        email,
      });

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        const errorList = Object.values(validation.errors).join('\n');
        addToast('Please fix validation errors', 'error');
        return;
      }

      const profileData = { username, password, name, contact, age, email, address: 'To be updated' };

      try {
        const signedUpRole = await signup(profileData);
        addToast('Account created successfully!', 'success');
        redirectUser(signedUpRole);
      } catch (err) {
        setError(err.message);
        addToast(err.message, 'error');
      }
    }
  };

  const redirectUser = (r) => {
    if (r === 'admin') navigate('/admin');
    else if (r === 'employee') navigate('/employee');
    else navigate('/user');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            {isLogin ? <LogIn size={28} color="white" /> : <UserPlus size={28} color="white" />}
          </div>
          <h1>FreshWash</h1>
          <p>{isLogin ? 'Login to manage your laundry' : 'Create an account to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-affix">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-affix password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={validationErrors.password ? 'input-error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className={`strength-fill strength-${passwordStrength}`}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={`strength-text strength-${passwordStrength}`}>
                  {passwordStrength === 0 && 'Weak'}
                  {passwordStrength === 1 && 'Very Weak'}
                  {passwordStrength === 2 && 'Fair'}
                  {passwordStrength === 3 && 'Good'}
                  {passwordStrength === 4 && 'Strong'}
                  {passwordStrength === 5 && 'Very Strong'}
                </span>
              </div>
            )}
            {validationErrors.password && (
              <p className="field-error">
                <AlertCircle size={16} />
                {validationErrors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Username</label>
                <div className="input-affix">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="3-20 characters (letters, numbers, underscore)"
                    className={validationErrors.username ? 'input-error' : ''}
                    required
                  />
                </div>
                {validationErrors.username && (
                  <p className="field-error">
                    <AlertCircle size={16} />
                    {validationErrors.username}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-affix">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className={validationErrors.name ? 'input-error' : ''}
                    required
                  />
                </div>
                {validationErrors.name && (
                  <p className="field-error">
                    <AlertCircle size={16} />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <div className="input-affix">
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit phone number"
                    className={validationErrors.contact ? 'input-error' : ''}
                    maxLength="10"
                    required
                  />
                </div>
                {validationErrors.contact && (
                  <p className="field-error">
                    <AlertCircle size={16} />
                    {validationErrors.contact}
                  </p>
                )}
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="10-100"
                    className={validationErrors.age ? 'input-error' : ''}
                    min="10"
                    max="100"
                  />
                  {validationErrors.age && (
                    <p className="field-error">
                      <AlertCircle size={16} />
                      {validationErrors.age}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={validationErrors.email ? 'input-error' : ''}
                  />
                  {validationErrors.email && (
                    <p className="field-error">
                      <AlertCircle size={16} />
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {isLogin && (
            <div className="form-group">
              <label>Role</label>
              <div className="input-affix">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="user">User</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                if (isLogin) setRole('user'); // Default to user on signup mode
              }}
            >
              {isLogin ? 'Create one' : 'Login here'}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p>© 2026 FreshWash Laundry Management</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
