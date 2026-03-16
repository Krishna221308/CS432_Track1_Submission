import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Plus, Edit2 } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const EmployeeOrders = () => {
  // Get current employee from auth
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId || 'EMP-001';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    member_id: '',
    pickup_time: '',
    total_amount: '',
  });
  
  const [manageOrder, setManageOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);
  const addToast = useToast();

  const loadData = () => {
    // TODO: Fetch assigned orders and members from backend API
    // setOrders(fetchedOrders);
    // setAssignedMembers(fetchedMembers);
  };

  useEffect(() => {
    loadData();
  }, [currentEmployee]);

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

  const handleAddOrder = () => {
    if (!newOrderData.member_id || !newOrderData.pickup_time || !newOrderData.total_amount) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    try {
      // TODO: Call API to add order
      // addOrder(newOrderData);
      addToast('Order added (Placeholder)', 'success');
      setShowAddOrderModal(false);
      setNewOrderData({ member_id: '', pickup_time: '', total_amount: '' });
      // loadData();
    } catch (error) {
      addToast('Failed to add order', 'error');
    }
  };

  const handleManageClick = (order) => {
    setManageOrder(order);
    setNewStatus(order.order_status);
    setShowManageModal(true);
  };

  const handleUpdateStatus = () => {
    if (manageOrder && newStatus) {
      // TODO: Call API to update order status
      // updateOrder(manageOrder.order_id, { order_status: newStatus });
      addToast('Order status updated (Placeholder)', 'success');
      setShowManageModal(false);
      setManageOrder(null);
      setNewStatus('');
      // loadData();
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1>Assigned Orders</h1>
            <p>View and manage your assigned orders</p>
          </div>
        </div>
        <button
          className="btn-add-order"
          onClick={() => setShowAddOrderModal(true)}
          title="Add new order for your assigned members"
        >
          <Plus size={18} /> Add Order
        </button>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Assigned</h3>
          <p className="stat-value">{orders.length}</p>
          <span className="stat-label">Orders</span>
        </div>
        <div className="stat-box">
          <h3>Pending</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            {orders.filter((o) => o.order_status === 'pending').length}
          </p>
          <span className="stat-label">Action Needed</span>
        </div>
        <div className="stat-box">
          <h3>Completed</h3>
          <p className="stat-value" style={{ color: '#10b981' }}>
            {orders.filter((o) => o.order_status === 'completed').length}
          </p>
          <span className="stat-label">Done</span>
        </div>
      </div>

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
                <th>Handler</th>
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
                    <td className="amount">₹{order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.order_status)}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="employee-badge">
                        {/* TODO: Fetch handler info if needed */}
                        Unassigned
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn icon-only"
                          onClick={() => handleManageClick(order)}
                          title="Manage Order"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
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

      {/* Manage Order Modal (Detailed View + Edit Status) */}
      {showManageModal && manageOrder && (
        <div className="modal-overlay" onClick={() => setShowManageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Order</h2>
              <button className="close-modal" onClick={() => setShowManageModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Order ID</label>
                  <p>{manageOrder.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Member ID</label>
                  <p>{manageOrder.member_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order Date</label>
                  <p>{manageOrder.order_date}</p>
                </div>
                <div className="detail-item">
                  <label>Pickup Time</label>
                  <p>{manageOrder.pickup_time}</p>
                </div>
                <div className="detail-item">
                  <label>Total Amount</label>
                  <p className="amount-highlight">₹{manageOrder.total_amount.toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Current Status</label>
                  <p>
                    <span className={getStatusBadgeClass(manageOrder.order_status)}>
                      {manageOrder.order_status.charAt(0).toUpperCase() + manageOrder.order_status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="detail-item full-width">
                  <label htmlFor="status-select">Update Status *</label>
                  <select
                    id="status-select"
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowManageModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="modal-overlay" onClick={() => setShowAddOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Order for Member</h2>
              <button className="close-modal" onClick={() => setShowAddOrderModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label htmlFor="member-select">Member *</label>
                  <select
                    id="member-select"
                    className="form-select"
                    value={newOrderData.member_id}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, member_id: e.target.value })
                    }
                  >
                    <option value="">-- Select Member --</option>
                    {assignedMembers.map((member) => (
                      <option key={member.member_id} value={member.member_id}>
                        {member.member_name} ({member.member_id})
                      </option>
                    ))}
                  </select>
                  {assignedMembers.length === 0 && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px' }}>
                      No members assigned to you yet
                    </p>
                  )}
                </div>

                <div className="detail-item">
                  <label htmlFor="pickup-time">Pickup Time *</label>
                  <input
                    id="pickup-time"
                    type="text"
                    className="form-select"
                    placeholder="e.g., 10:00 AM"
                    value={newOrderData.pickup_time}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, pickup_time: e.target.value })
                    }
                  />
                </div>

                <div className="detail-item">
                  <label htmlFor="total-amount">Amount (₹) *</label>
                  <input
                    id="total-amount"
                    type="number"
                    className="form-select"
                    placeholder="0.00"
                    value={newOrderData.total_amount}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, total_amount: e.target.value })
                    }
                    step="0.01"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddOrderModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddOrder}
                  disabled={assignedMembers.length === 0}
                >
                  Add Order
                </button>
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

        .btn-add-order {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-add-order:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);
        }

        .btn-add-order:active {
          transform: translateY(0);
        }

        .form-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background-color: #fff;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .form-select:hover {
          border-color: #d1d5db;
        }

        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
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
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #111827;
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .close-modal:hover {
          color: #111827;
        }

        .modal-body {
          padding: 20px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .edit-btn {
          background: #fef08a;
          color: #92400e;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 500;
        }

        .edit-btn:hover {
          background: #fde047;
          color: #78350f;
          transform: translateY(-1px);
        }

        .edit-btn.icon-only {
          padding: 8px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default EmployeeOrders;
