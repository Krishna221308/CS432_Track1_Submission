import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { getUser, getRole, logout } from '../utils/auth';
import { useToast } from './Toast';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleSidebar }) => {
  const username = getUser();
  const role = getRole();
  const addToast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    addToast('Logged out successfully', 'info');
    setTimeout(() => logout(), 500);
  };

  const handleProfileClick = () => {
    navigate(`/${role}/profile`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="navbar-brand">FreshWash</span>
      </div>
      
      <div className="navbar-right">
        <ThemeToggle />
        <div className="user-profile">
          <div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }} title="View Profile">
            <div className="user-avatar-sm">
              <UserIcon size={16} />
            </div>
            <span className="username">{username || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
