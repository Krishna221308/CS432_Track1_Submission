import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Lock, User, Eye, EyeOff } from 'lucide-react';
import { login, signup } from '../utils/auth';
import { useToast } from '../components/Toast';
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
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!username || !password) {
        setError('Please fill in all fields');
        addToast('Please fill in all info', 'error');
        return;
      }

      const authenticatedRole = login(username, password);
      addToast('Login successful!', 'success');
      redirectUser(authenticatedRole);
    } else {
      // Validate Signup
      if (!username || !password || !name || !contact) {
        setError('Required fields missing');
        addToast('Required fields missing', 'error');
        return;
      }

      const profileData = { username, password, role: 'user', name, contact, age, email };

      try {
        const signedUpRole = signup(profileData);
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
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-affix">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <div className="input-affix">
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
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
