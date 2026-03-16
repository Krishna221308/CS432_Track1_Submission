import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../utils/auth';
import { useToast } from '../components/Toast';
import '../styles/login.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      addToast('Credentials required', 'error');
      return;
    }

    // Force role to admin for this login page
    const authenticatedRole = login(username, password, 'admin');
    
    if (authenticatedRole === 'admin') {
      addToast('Welcome back, Admin!', 'success');
      navigate('/admin');
    } else {
      setError('Unauthorized access');
      addToast('Invalid admin credentials', 'error');
    }
  };

  return (
    <div className="login-container admin-auth">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle" style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>
            <ShieldCheck size={28} color="white" />
          </div>
          <h1>Admin Portal</h1>
          <p>Authorized access only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Admin Username</label>
            <div className="input-affix">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
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
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" style={{ background: '#1e293b' }}>
            Enter Management Console
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 FreshWash Administrative Security</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
