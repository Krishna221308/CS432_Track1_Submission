import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { getUser, logout } from '../utils/auth';

const Navbar = ({ toggleSidebar }) => {
  const username = getUser();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="navbar-brand">FreshWash</span>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-icon">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="username">{username || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
