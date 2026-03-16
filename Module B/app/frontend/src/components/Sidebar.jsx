import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Truck, 
  Layers, 
  BarChart3,
  User,
  Tag,
  X 
} from 'lucide-react';
import { getRole } from '../utils/auth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const role = getRole();

  const adminMenu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Members', path: '/admin/members', icon: <Users size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <BarChart3 size={20} /> },
    { name: 'Employees', path: '/admin/employees', icon: <Users size={20} /> },
    { name: 'Feedbacks', path: '/admin/feedbacks', icon: <Layers size={20} /> },
    { name: 'Lost Items', path: '/admin/lost-items', icon: <Truck size={20} /> },
    { name: 'Services & Pricing', path: '/admin/services', icon: <Tag size={20} /> },
  ];

  const employeeMenu = [
    { name: 'Dashboard', path: '/employee', icon: <LayoutDashboard size={20} /> },
    { name: 'Assigned Orders', path: '/employee/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Payments', path: '/employee/payments', icon: <BarChart3 size={20} /> },
    { name: 'Feedbacks', path: '/employee/feedbacks', icon: <Layers size={20} /> },
    { name: 'Lost/Damaged Items', path: '/employee/lost-items', icon: <Truck size={20} /> },
  ];

  const userMenu = [
    { name: 'Dashboard', path: '/user', icon: <LayoutDashboard size={20} /> },
    { name: 'My Orders', path: '/user/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Payments', path: '/user/payments', icon: <BarChart3 size={20} /> },
    { name: 'Report Lost Items', path: '/user/report-lost-items', icon: <Truck size={20} /> },
    { name: 'Feedback', path: '/user/feedback', icon: <Layers size={20} /> },
  ];

  const menuItems = role === 'admin' ? adminMenu : role === 'employee' ? employeeMenu : userMenu;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="logo-text">FreshWash</span>
        <button className="close-btn" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin' || item.path === '/employee' || item.path === '/user'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
