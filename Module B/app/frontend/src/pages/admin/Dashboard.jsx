import React from 'react';
import { ShoppingBag, Clock, CheckCircle, Activity } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import { mockOrders, mockPayments } from '../../utils/mockData';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter((o) => o.order_status === 'pending').length;
  const completedOrders = mockOrders.filter((o) => o.order_status === 'completed').length;
  const processingOrders = mockOrders.filter((o) => o.order_status === 'processing').length;
  const totalRevenue = mockPayments.filter((p) => p.payment_date !== null).reduce((sum, p) => sum + p.payment_amount, 0);

  const stats = [
    { title: 'Total Orders', value: totalOrders.toString(), icon: <ShoppingBag size={24} />, trend: 5, color: '#1e40af' },
    { title: 'Pending Orders', value: pendingOrders.toString(), icon: <Clock size={24} />, trend: -2, color: '#f59e0b' },
    { title: 'Completed Orders', value: completedOrders.toString(), icon: <CheckCircle size={24} />, trend: 8, color: '#10b981' },
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <Activity size={24} />, trend: 12, color: '#14b8a6' },
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
                  <th>Member ID</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 3).map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.member_id}</td>
                    <td>{order.order_date}</td>
                    <td><span className={`badge ${order.order_status}`}>{order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}</span></td>
                    <td>${order.total_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
