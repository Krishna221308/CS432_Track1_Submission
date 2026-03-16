import React, { useState, useEffect } from 'react';
import { Search, Edit2 } from 'lucide-react';
import { getAllPayments, updatePaymentStatus } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllPayments();
      setPayments(data);
    } catch (error) {
      addToast('Failed to load payments: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.payment_id || '').toString().includes(searchTerm.toLowerCase()) ||
      (payment.order_id || '').toString().includes(searchTerm.toLowerCase()) ||
      (payment.member_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || payment.payment_mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const getStatusBadgeClass = (status) => {
    return `badge ${status ? status.toLowerCase() : 'pending'}`;
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status || 'pending');
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedPayment && newStatus) {
      try {
        await updatePaymentStatus(selectedPayment.payment_id, newStatus);
        addToast('Payment status updated successfully', 'success');
        setShowEditModal(false);
        setSelectedPayment(null);
        loadData();
      } catch (error) {
        addToast('Failed to update payment: ' + error.message, 'error');
      }
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'Success')
    .reduce((sum, p) => sum + (p.payment_amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status !== 'Success')
    .reduce((sum, p) => sum + (p.payment_amount || 0), 0);

  const getPaymentModes = () => {
    return ['all', ...new Set(payments.map((p) => p.payment_mode))];
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Payments Management</h1>
        <p>Monitor payment records and transaction details</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
          <span className="stat-label">Paid Payments</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payments</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            ₹{pendingAmount.toFixed(2)}
          </p>
          <span className="stat-label">Awaiting Payment</span>
        </div>
        <div className="stat-box">
          <h3>Total Transactions</h3>
          <p className="stat-value" style={{ color: '#3b82f6' }}>
            {payments.length}
          </p>
          <span className="stat-label">All Payments</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Payment ID or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All ({payments.length})
          </button>
          {getPaymentModes().map((mode) => (
            <button
              key={mode}
              className={`filter-btn ${filterMode === mode ? 'active' : ''}`}
              onClick={() => setFilterMode(mode)}
            >
              {(mode || '').replace('_', ' ').charAt(0).toUpperCase() + (mode || '').replace('_', ' ').slice(1)} ({payments.filter((p) => p.payment_mode === mode).length})
            </button>
          ))}
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading payments...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Member Name</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td className="payment-id">{payment.payment_id}</td>
                    <td>{payment.order_id}</td>
                    <td>{payment.member_name}</td>
                    <td className="amount">₹{(payment.payment_amount || 0).toFixed(2)}</td>
                    <td>{payment.payment_mode}</td>
                    <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={getStatusBadgeClass(payment.status)}>
                        {payment.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn icon-only"
                          onClick={() => handleEditPayment(payment)}
                          title="Update Payment Status"
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
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Edit Modal */}
      {showEditModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Payment Status</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Payment ID</label>
                  <p style={{ fontWeight: 600, margin: 0 }}>{selectedPayment.payment_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order ID</label>
                  <p style={{ fontWeight: 600, margin: 0 }}>{selectedPayment.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#10b981', margin: 0 }}>₹{(selectedPayment.payment_amount || 0).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Mode</label>
                  <p style={{ margin: 0 }}>{selectedPayment.payment_mode || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p style={{ margin: 0 }}>{selectedPayment.payment_date ? new Date(selectedPayment.payment_date).toLocaleDateString() : 'Pending'}</p>
                </div>
                <div className="detail-item full-width">
                  <label htmlFor="payment-status-select">Update Status *</label>
                  <select 
                    id="payment-status-select"
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateStatus}>Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
