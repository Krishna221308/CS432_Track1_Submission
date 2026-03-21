import React, { useMemo, useState, useEffect } from 'react';
import '../../styles/admin.css';
import { getMemberId } from '../../utils/auth';

const UserDashboard = () => {
  const currentMember = getMemberId();

  const [memberOrders, setMemberOrders] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, pendingPayment: 0 });
  const [memberFeedbacks, setMemberFeedbacks] = useState([]);
  const [memberLostItems, setMemberLostItems] = useState([]);

  useEffect(() => {
    if (!currentMember) return;

    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch(`http://127.0.0.1:5001/api/user/stats/${currentMember}`);
        const statsData = await statsRes.json();
        if (statsRes.ok) setStats(statsData);

        // Fetch orders
        const ordersRes = await fetch(`http://127.0.0.1:5001/api/user/orders/${currentMember}`);
        const ordersData = await ordersRes.json();
        if (ordersRes.ok) setMemberOrders(ordersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [currentMember]);

  const averageRating = useMemo(() => {
    if (memberFeedbacks.length === 0) return 0;
    const total = memberFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    return (total / memberFeedbacks.length).toFixed(1);
  }, [memberFeedbacks]);

  const recentOrders = useMemo(() => {
    return memberOrders.slice(0, 5);
  }, [memberOrders]);

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>My Dashboard</h1>
        <p>Welcome back! Here's your order overview</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Orders</h3>
          <p className="stat-value">{memberOrders.length}</p>
          <span className="stat-label">All Time</span>
        </div>
        <div className="stat-box">
          <h3>Total Spent</h3>
          <p className="stat-value">₹{stats.totalSpent.toFixed(2)}</p>
          <span className="stat-label">Paid</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payment</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>₹{stats.pendingPayment.toFixed(2)}</p>
          <span className="stat-label">Action Needed</span>
        </div>
        <div className="stat-box">
          <h3>Issues Reported</h3>
          <p className="stat-value" style={{ color: '#ef4444' }}>{memberLostItems.length}</p>
          <span className="stat-label">Lost/Damaged</span>
        </div>
        <div className="stat-box">
          <h3>Avg Rating</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>{averageRating}</p>
          <span className="stat-label">From {memberFeedbacks.length} reviews</span>
        </div>
      </div>

      <div className="table-card">
        <div className="card-header">
          <h2>Recent Orders</h2>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Pickup Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="order-id">{order.order_id}</td>
                    <td>{order.order_date}</td>
                    <td>{order.pickup_time}</td>
                    <td className="amount">₹{order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${order.order_status}`}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        body.dark-theme .card-header {
          background: rgba(255, 255, 255, 0.05);
          border-bottom-color: var(--glass-border);
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #1f2937;
          font-weight: 600;
        }

        body.dark-theme .card-header h2 {
          color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
