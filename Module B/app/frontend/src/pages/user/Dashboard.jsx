import React, { useMemo } from 'react';
import { getOrdersForMember, getPaymentsForMember, getFeedbacksForMember, getLostItemsForMember } from '../../utils/mockData';
import '../../styles/admin.css';

const UserDashboard = () => {
  const currentMember = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.memberId || 'MEM-001';
  }, []);

  const memberOrders = useMemo(() => getOrdersForMember(currentMember), [currentMember]);
  const memberPayments = useMemo(() => getPaymentsForMember(currentMember), [currentMember]);
  const memberFeedbacks = useMemo(() => getFeedbacksForMember(currentMember), [currentMember]);
  const memberLostItems = useMemo(() => getLostItemsForMember(currentMember), [currentMember]);

  const totalSpent = useMemo(() => {
    return memberPayments
      .filter((p) => p.payment_date !== null)
      .reduce((sum, p) => sum + p.payment_amount, 0);
  }, [memberPayments]);

  const pendingAmount = useMemo(() => {
    return memberPayments
      .filter((p) => p.payment_date === null)
      .reduce((sum, p) => sum + p.payment_amount, 0);
  }, [memberPayments]);

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
          <p className="stat-value">${totalSpent.toFixed(2)}</p>
          <span className="stat-label">Paid</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payment</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>${pendingAmount.toFixed(2)}</p>
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
                    <td className="amount">${order.total_amount.toFixed(2)}</td>
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
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #1f2937;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
