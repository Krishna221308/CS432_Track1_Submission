import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { mockOrders, getAssignedEmployeeForOrder } from '../../utils/mockData';
import '../../styles/admin.css';

const AdminOrders = () => {
  const [orders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.member_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.order_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    return `badge ${status}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      completed: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Orders Management</h1>
        <p>Track and manage all customer laundry orders</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({orders.filter((o) => o.order_status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('processing')}
          >
            Processing ({orders.filter((o) => o.order_status === 'processing').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({orders.filter((o) => o.order_status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Member ID</th>
                <th>Order Date</th>
                <th>Pickup Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Assigned Employee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="order-id">{order.order_id}</td>
                    <td>{order.member_id}</td>
                    <td>{order.order_date}</td>
                    <td>{order.pickup_time}</td>
                    <td className="amount">${order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.order_status)}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="employee-badge">
                        {getAssignedEmployeeForOrder(order.order_id)?.employee_name || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Order ID</label>
                  <p>{selectedOrder.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Member ID</label>
                  <p>{selectedOrder.member_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order Date</label>
                  <p>{selectedOrder.order_date}</p>
                </div>
                <div className="detail-item">
                  <label>Pickup Time</label>
                  <p>{selectedOrder.pickup_time}</p>
                </div>
                <div className="detail-item">
                  <label>Total Amount</label>
                  <p className="amount-highlight">${selectedOrder.total_amount.toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span
                      className={getStatusBadgeClass(selectedOrder.order_status)}
                      style={{ display: 'inline-block' }}
                    >
                      {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="detail-item">
                  <label>Assigned Employee</label>
                  <p>
                    <span className="employee-badge">
                      {getAssignedEmployeeForOrder(selectedOrder.order_id)?.employee_name || 'Unassigned'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .employee-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
