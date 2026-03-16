import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { getOrders, getAssignedEmployeeForOrder, addOrder, updateOrder, deleteOrder, getMembers } from '../../utils/mockData';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrderData, setNewOrderData] = useState({ member_id: '', pickup_time: '', total_amount: '', order_status: 'pending' });
  const addToast = useToast();

  const loadData = () => {
    setOrders(getOrders());
    setMembers(getMembers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.order_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.member_id || '').toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleAddOrder = () => {
    if (!newOrderData.member_id || !newOrderData.pickup_time || !newOrderData.total_amount) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      addOrder({
        member_id: newOrderData.member_id,
        pickup_time: newOrderData.pickup_time,
        total_amount: parseFloat(newOrderData.total_amount),
      });
      addToast('Order added successfully!', 'success');
      setShowAddModal(false);
      setNewOrderData({ member_id: '', pickup_time: '', total_amount: '', order_status: 'pending' });
      loadData();
    } catch (error) {
      addToast('Failed to add order', 'error');
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setNewOrderData({ member_id: order.member_id, pickup_time: order.pickup_time, total_amount: order.total_amount, order_status: order.order_status });
    setShowEditModal(true);
  };

  const handleUpdateOrder = () => {
    if (editingOrder) {
      updateOrder(editingOrder.order_id, { order_status: newOrderData.order_status });
      addToast('Order status updated successfully!', 'success');
      setShowEditModal(false);
      setEditingOrder(null);
      setNewOrderData({ member_id: '', pickup_time: '', total_amount: '', order_status: 'pending' });
      loadData();
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.order_id);
      addToast('Order deleted successfully!', 'success');
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      loadData();
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <h1>Orders Management</h1>
            <p>Track and manage all customer laundry orders</p>
          </div>
          <button
            className="btn-add-order"
            onClick={() => setShowAddModal(true)}
            title="Add new order"
          >
            <Plus size={18} /> Add Order
          </button>
        </div>
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
                <th>Order Status</th>
                <th>Payment Status</th>
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
                    <td className="amount">${(order.total_amount || 0).toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.order_status)}>
                        {(order.order_status || 'pending').charAt(0).toUpperCase() + (order.order_status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(order.payment_status)}>
                        {(order.payment_status || 'pending').charAt(0).toUpperCase() + (order.payment_status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="employee-badge">
                        {getAssignedEmployeeForOrder(order.order_id)?.employee_name || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn icon-only"
                          onClick={() => handleEditClick(order)}
                          title="Manage Order"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(order)}
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Order</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label htmlFor="member-select">Member *</label>
                  <select
                    id="member-select"
                    className="form-select"
                    value={newOrderData.member_id}
                    onChange={(e) => setNewOrderData({ ...newOrderData, member_id: e.target.value })}
                  >
                    <option value="">-- Select Member --</option>
                    {members.map((m) => <option key={m.member_id} value={m.member_id}>{m.member_name}</option>)}
                  </select>
                </div>
                <div className="detail-item">
                  <label htmlFor="pickup-time">Pickup Time *</label>
                  <input id="pickup-time" type="text" className="form-select" placeholder="e.g., 10:00 AM" value={newOrderData.pickup_time} onChange={(e) => setNewOrderData({ ...newOrderData, pickup_time: e.target.value })} />
                </div>
                <div className="detail-item">
                  <label htmlFor="total-amount">Amount (₹) *</label>
                  <input id="total-amount" type="number" className="form-select" placeholder="0.00" value={newOrderData.total_amount} onChange={(e) => setNewOrderData({ ...newOrderData, total_amount: e.target.value })} step="0.01" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddOrder}>Add Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Manage Order Modal */}
      {showEditModal && editingOrder && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Order</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Order ID</label>
                  <p style={{ margin: 0, fontWeight: 600 }}>{editingOrder.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Member ID</label>
                  <p style={{ margin: 0, fontWeight: 600 }}>{editingOrder.member_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order Date</label>
                  <p style={{ margin: 0, fontWeight: 600 }}>{editingOrder.order_date}</p>
                </div>
                <div className="detail-item">
                  <label>Pickup Time</label>
                  <p style={{ margin: 0, fontWeight: 600 }}>{editingOrder.pickup_time}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p style={{ margin: 0, fontWeight: 600, color: '#10b981' }}>${(editingOrder.total_amount || 0).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Assigned Employee</label>
                  <p style={{ margin: 0 }}>
                    <span className="employee-badge">
                      {getAssignedEmployeeForOrder(editingOrder.order_id)?.employee_name || 'Unassigned'}
                    </span>
                  </p>
                </div>
                <div className="detail-item">
                  <label htmlFor="status-select">Order Status *</label>
                  <select id="status-select" className="form-select" value={newOrderData.order_status} onChange={(e) => setNewOrderData({ ...newOrderData, order_status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateOrder}>Update Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && orderToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Order</h2>
              <button className="close-modal" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">Are you sure you want to delete <strong>{orderToDelete.order_id}</strong>?</p>
              <p className="delete-info">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 500px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          color: #1f2937;
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 28px;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-modal:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .modal-body {
          padding: 20px;
          color: #374151;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .form-select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          background: white;
          transition: all 0.3s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: #5b7ce0;
          box-shadow: 0 0 0 3px rgba(91, 124, 224, 0.1);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #5b7ce0 0%, #9b9dd4 100%);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #4a69d4 0%, #8a8ec8 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(91, 124, 224, 0.3);
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
          transform: translateY(-2px);
        }

        .btn-danger {
          background-color: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .delete-warning {
          color: #ef4444;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .delete-info {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .action-buttons button {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .view-btn {
          background: #dbeafe;
          color: #1e40af;
        }

        .view-btn:hover {
          background: #bfdbfe;
        }

        .edit-btn {
          background: #fef08a;
          color: #92400e;
        }

        .edit-btn:hover {
          background: #fde047;
        }

        .delete-btn {
          background: #fecaca;
          color: #991b1b;
        }

        .delete-btn:hover {
          background: #fca5a5;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 0 10px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: 1;
          }
        }

        @media (prefers-color-scheme: dark) {
          .modal-content {
            background: #1f2937;
            color: #e5e7eb;
          }

          .modal-header {
            border-bottom-color: #374151;
          }

          .modal-header h2 {
            color: #f3f4f6;
          }

          .close-modal {
            color: #9ca3af;
          }

          .close-modal:hover {
            background: #374151;
            color: #f3f4f6;
          }

          .modal-body {
            color: #d1d5db;
          }

          .detail-item label {
            color: #f3f4f6;
          }

          .form-select {
            background: #374151;
            border-color: #4b5563;
            color: #e5e7eb;
          }

          .form-select:focus {
            border-color: #5b7ce0;
          }

          .modal-footer {
            border-top-color: #374151;
            background: #111827;
          }

          .btn-secondary {
            background: #374151;
            color: #e5e7eb;
          }

          .btn-secondary:hover {
            background: #4b5563;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
