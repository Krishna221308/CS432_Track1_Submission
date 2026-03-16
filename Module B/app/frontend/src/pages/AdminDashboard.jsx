import React from 'react';
import { ShoppingBag, Users, CheckCircle, Clock } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Orders', value: '1,284', icon: <ShoppingBag size={24} />, trend: 12, color: '#1e40af' },
    { title: 'Pending Orders', value: '45', icon: <Clock size={24} />, trend: -5, color: '#f59e0b' },
    { title: 'Completed Orders', value: '1,120', icon: <CheckCircle size={24} />, trend: 8, color: '#10b981' },
    { title: 'Active Customers', value: '892', icon: <Users size={24} />, trend: 15, color: '#14b8a6' },
  ];

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of system performance and operations.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card large">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-7281</td>
                  <td>John Doe</td>
                  <td>Dry Cleaning</td>
                  <td><span className="badge pending">Pending</span></td>
                  <td>$45.00</td>
                </tr>
                <tr>
                  <td>#ORD-7280</td>
                  <td>Jane Smith</td>
                  <td>Wash & Fold</td>
                  <td><span className="badge processing">Processing</span></td>
                  <td>$22.50</td>
                </tr>
                <tr>
                  <td>#ORD-7279</td>
                  <td>Robert Brown</td>
                  <td>Ironing</td>
                  <td><span className="badge completed">Completed</span></td>
                  <td>$15.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
