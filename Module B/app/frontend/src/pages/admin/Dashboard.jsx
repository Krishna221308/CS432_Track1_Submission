import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, Activity } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // TODO: Fetch data from backend API
    // setOrders(fetchedOrders);
    // setPayments(fetchedPayments);
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const completedOrders = orders.filter((o) => o.order_status === 'completed').length;
  const processingOrders = orders.filter((o) => o.order_status === 'processing').length;
  const totalRevenue = payments.filter((p) => p.payment_date !== null).reduce((sum, p) => sum + p.payment_amount, 0);

  const stats = [
    { title: 'Total Orders', value: totalOrders.toString(), icon: <ShoppingBag size={24} />, color: '#1e40af' },
    { title: 'Pending Orders', value: pendingOrders.toString(), icon: <Clock size={24} />, color: '#f59e0b' },
    { title: 'Completed Orders', value: completedOrders.toString(), icon: <CheckCircle size={24} />, color: '#10b981' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: <Activity size={24} />, color: '#14b8a6' },
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
                {orders.slice(0, 3).map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.member_id}</td>
                    <td>{order.order_date}</td>
                    <td><span className={`badge ${order.order_status}`}>{order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}</span></td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-row">No recent orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
