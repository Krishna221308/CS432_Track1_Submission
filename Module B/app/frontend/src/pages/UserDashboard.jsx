import React from 'react';
import { ShoppingBag, Truck, CreditCard, User } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import '../styles/dashboard.css';

const UserDashboard = () => {
  const stats = [
    { title: 'My Active Orders', value: '2', icon: <ShoppingBag size={24} />, trend: 0, color: '#1e40af' },
    { title: 'Next Delivery', value: 'Tomorrow', icon: <Truck size={24} />, color: '#f59e0b' },
    { title: 'Loyalty Points', value: '450', icon: <User size={24} />, trend: 20, color: '#10b981' },
    { title: 'Total Spent', value: '$284.50', icon: <CreditCard size={24} />, trend: 5, color: '#14b8a6' },
  ];

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Welcome back, Jane!</h1>
        <p>Track your laundry status and schedule new pickups.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card large">
          <div className="card-header">
            <h2>Current Orders</h2>
            <button className="primary-btn">New Order</button>
          </div>
          <div className="order-progress">
            <div className="order-item">
              <div className="order-meta">
                <span className="order-id">#ORD-7281</span>
                <span className="order-date">Placed on Oct 24</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '65%' }}></div>
              </div>
              <div className="progress-labels">
                <span>Received</span>
                <span>Washing</span>
                <span className="active">Drying</span>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
