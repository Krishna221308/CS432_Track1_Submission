import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Lock, User, Eye, EyeOff } from 'lucide-react';
import { login } from '../utils/auth';
import '../styles/login.css';

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    const authenticatedRole = login(username, password);
    if (authenticatedRole === 'admin') navigate('/admin');
    else if (authenticatedRole === 'employee') navigate('/employee');
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

          <div className="form-group">
            <label>Role</label>
            <div className="input-affix">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="user">User / Member</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

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
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create one' : 'Login here'}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p>Test credentials:</p>
          <ul>
            <li><strong>Admin:</strong> username: admin, any password</li>
            <li><strong>Employee:</strong> username: employee, any password</li>
            <li><strong>User:</strong> username: user, any password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
