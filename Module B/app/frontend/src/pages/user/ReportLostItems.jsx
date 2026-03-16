import React, { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { getOrdersForMember, getLostItemsForMember, reportLostItem } from '../../utils/mockData';
import '../../styles/admin.css';

const UserReportLostItems = () => {
  const currentMember = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.memberId || 'MEM-001';
  }, []);

  const [memberOrders] = useState(getOrdersForMember(currentMember));
  const [lostItems, setLostItems] = useState(getLostItemsForMember(currentMember));
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReportItem = () => {
    if (!selectedOrder || !itemDescription.trim()) {
      alert('Please select an order and describe the lost item');
      return;
    }

    reportLostItem(currentMember, selectedOrder, itemDescription);
    setLostItems(getLostItemsForMember(currentMember));
    setSelectedOrder('');
    setItemDescription('');
    setShowReportForm(false);
    setSuccessMessage('Lost item reported successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getOrderTotal = (orderId) => {
    const order = memberOrders.find((o) => o.order_id === orderId);
    return order ? order.total_amount : 0;
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Report Lost/Damaged Items</h1>
        <p>Report any lost or damaged items from your orders</p>
      </header>

      {successMessage && (
        <div className="success-message">
          <AlertCircle size={20} style={{ marginRight: '8px' }} />
          {successMessage}
        </div>
      )}

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Orders</h3>
          <p className="stat-value">{memberOrders.length}</p>
        </div>
        <div className="stat-box">
          <h3>Items Reported</h3>
          <p className="stat-value" style={{ color: '#ef4444' }}>{lostItems.length}</p>
          <span className="stat-label">Lost/Damaged</span>
        </div>
        <div className="stat-box">
          <h3>Compensation Requested</h3>
          <p className="stat-value">${lostItems.reduce((sum, i) => sum + i.compensation_amount, 0).toFixed(2)}</p>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="form-card">
        <div className="card-header">
          <h2>Report a Lost/Damaged Item</h2>
          {!showReportForm && (
            <button className="btn btn-primary" onClick={() => setShowReportForm(true)}>
              <Plus size={18} style={{ marginRight: '8px' }} />
              Report Item
            </button>
          )}
        </div>

        {showReportForm && (
          <div className="form-body">
            <div className="form-group">
              <label htmlFor="order-select">Select Order *</label>
              <select
                id="order-select"
                className="form-select"
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
              >
                <option value="">-- Choose an Order --</option>
                {memberOrders.map((order) => (
                  <option key={order.order_id} value={order.order_id}>
                    {order.order_id} - {order.order_date} (${order.total_amount.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="item-desc">Item Description *</label>
              <textarea
                id="item-desc"
                className="form-textarea"
                placeholder="Describe the lost or damaged item (e.g., Blue Cotton Shirt, size M)"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowReportForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleReportItem}>
                Submit Report
              </button>
            </div>
          </div>
        )}
      </div>

      {lostItems.length > 0 && (
        <div className="table-card">
          <div className="card-header">
            <h2>Your Reported Items</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Order ID</th>
                  <th>Item Description</th>
                  <th>Reported Date</th>
                  <th>Compensation</th>
                </tr>
              </thead>
              <tbody>
                {lostItems.map((item) => (
                  <tr key={item.lost_id}>
                    <td className="order-id">{item.lost_id}</td>
                    <td>{item.order_id}</td>
                    <td>{item.item_description}</td>
                    <td>{item.reported_date}</td>
                    <td className="amount">
                      ${item.compensation_amount > 0 ? item.compensation_amount.toFixed(2) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .form-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .form-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background-color: #fff;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .form-select:hover,
        .form-textarea:hover {
          border-color: #d1d5db;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .success-message {
          background: #d1fae5;
          border: 1px solid #6ee7b7;
          color: #047857;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default UserReportLostItems;
