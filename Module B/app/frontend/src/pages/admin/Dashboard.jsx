import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, Activity } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import { getAdminDashboard, getAllOrders } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await getAdminDashboard();
      setDashboardStats(stats);
      
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      addToast('Failed to load dashboard data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = dashboardStats?.totalOrders || 0;
  const pendingOrders = dashboardStats?.pendingOrders || 0;
  const totalRevenue = dashboardStats?.totalRevenue || 0;
  const totalMembers = dashboardStats?.totalMembers || 0;

  const stats = [
    { title: 'Total Orders', value: totalOrders.toString(), icon: <ShoppingBag size={24} />, color: '#1e40af' },
    { title: 'Pending Orders', value: pendingOrders.toString(), icon: <Clock size={24} />, color: '#f59e0b' },
    { title: 'Total Members', value: totalMembers.toString(), icon: <CheckCircle size={24} />, color: '#10b981' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: <Activity size={24} />, color: '#14b8a6' },
  ];

  if (loading) {
    return (
      <div className="dashboard-view">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of system performance and operations.</p>
        </header>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      </div>
    );
  }

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
                  <th>Member Name</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.member_name}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
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
