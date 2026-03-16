import React, { useState, useEffect } from 'react';
import { Search, Edit2 } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const addToast = useToast();

  const loadData = () => {
    // TODO: Fetch payments from backend API
    // setPayments(fetchedPayments);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.payment_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.order_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || payment.payment_mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const getStatusBadgeClass = (hasDate) => {
    return `badge ${hasDate ? 'completed' : 'pending'}`;
  };

  const handleUpdateStatus = (payment, isPaid) => {
    const updates = {
      payment_date: isPaid ? new Date().toISOString().split('T')[0] : null
    };
    
    // TODO: Call API to update payment status
    // updatePayment(payment.payment_id, updates);
    addToast(`Payment marked as ${isPaid ? 'Paid' : 'Pending'} (Placeholder)`, 'success');
    // loadData();
    if (selectedPayment && selectedPayment.payment_id === payment.payment_id) {
      setSelectedPayment({ ...selectedPayment, ...updates });
    }
  };

  const totalRevenue = payments
    .filter((p) => p.payment_date !== null)
    .reduce((sum, p) => sum + (p.payment_amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.payment_date === null)
    .reduce((sum, p) => sum + (p.payment_amount || 0), 0);

  const getPaymentModes = () => {
    return [...new Set(payments.map((p) => p.payment_mode))];
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
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Payment Date</th>
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
                    <td className="amount">₹{(payment.payment_amount || 0).toFixed(2)}</td>
                    <td>{(payment.payment_mode || '').replace('_', ' ')}</td>
                    <td>{payment.payment_date || '—'}</td>
                    <td>
                      <span className={getStatusBadgeClass(payment.payment_date)}>
                        {payment.payment_date ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn icon-only"
                          onClick={() => setSelectedPayment(payment)}
                          title="Manage Payment"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Management Modal */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Payment</h2>
              <button className="close-modal" onClick={() => setSelectedPayment(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Payment ID</label>
                  <p style={{ fontWeight: 600 }}>{selectedPayment.payment_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order ID</label>
                  <p style={{ fontWeight: 600 }}>{selectedPayment.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className="amount-highlight" style={{ fontSize: '1.2rem' }}>₹{(selectedPayment.payment_amount || 0).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Mode</label>
                  <p>{(selectedPayment.payment_mode || '').replace('_', ' ')}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p>{selectedPayment.payment_date || 'Pending'}</p>
                </div>
                <div className="detail-item">
                  <label htmlFor="payment-status-select">Status</label>
                  <select 
                    id="payment-status-select" 
                    className="form-select"
                    value={selectedPayment.payment_date ? 'paid' : 'pending'}
                    onChange={(e) => handleUpdateStatus(selectedPayment, e.target.value === 'paid')}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={() => setSelectedPayment(null)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
