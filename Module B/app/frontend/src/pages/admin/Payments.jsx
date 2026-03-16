import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { mockPayments } from '../../utils/mockData';
import '../../styles/admin.css';

const AdminPayments = () => {
  const [payments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || payment.payment_mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const getStatusBadgeClass = (hasDate) => {
    return `badge ${hasDate ? 'completed' : 'pending'}`;
  };

  const totalRevenue = payments
    .filter((p) => p.payment_date !== null)
    .reduce((sum, p) => sum + p.payment_amount, 0);
  const pendingAmount = payments
    .filter((p) => p.payment_date === null)
    .reduce((sum, p) => sum + p.payment_amount, 0);

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
          <p className="stat-value">${totalRevenue.toFixed(2)}</p>
          <span className="stat-label">Paid Payments</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payments</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            ${pendingAmount.toFixed(2)}
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
              {mode.charAt(0).toUpperCase() + mode.slice(1)} ({payments.filter((p) => p.payment_mode === mode).length})
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
                    <td className="amount">${payment.payment_amount.toFixed(2)}</td>
                    <td>{payment.payment_mode.replace('_', ' ')}</td>
                    <td>{payment.payment_date || '—'}</td>
                    <td>
                      <span className={getStatusBadgeClass(payment.payment_date)}>
                        {payment.payment_date ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => setSelectedPayment(payment)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
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

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button className="close-modal" onClick={() => setSelectedPayment(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Payment ID</label>
                  <p>{selectedPayment.payment_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order ID</label>
                  <p>{selectedPayment.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className="amount-highlight">${selectedPayment.payment_amount.toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Mode</label>
                  <p>{selectedPayment.payment_mode.replace('_', ' ')}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p>{selectedPayment.payment_date || 'Pending'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span
                      className={getStatusBadgeClass(selectedPayment.payment_date)}
                      style={{ display: 'inline-block' }}
                    >
                      {selectedPayment.payment_date ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
