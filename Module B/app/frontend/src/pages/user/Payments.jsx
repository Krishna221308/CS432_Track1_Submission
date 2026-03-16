import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import '../../styles/admin.css';
import { getMemberId } from '../../utils/auth';

const UserPayments = () => {
  const currentMember = getMemberId();

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!currentMember) return;

    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/payments/${currentMember}`);
        const data = await response.json();
        if (response.ok) setPayments(data);
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, [currentMember]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.order_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMode =
        filterMode === 'all' ||
        (filterMode === 'paid' && payment.payment_date !== null) ||
        (filterMode === 'pending' && payment.payment_date === null);
      return matchesSearch && matchesMode;
    });
  }, [payments, searchTerm, filterMode]);

  const stats = useMemo(() => {
    const paidAmount = payments
      .filter((p) => p.payment_date !== null)
      .reduce((sum, p) => sum + p.payment_amount, 0);
    const pendingAmount = payments
      .filter((p) => p.payment_date === null)
      .reduce((sum, p) => sum + p.payment_amount, 0);
    return { paidAmount, pendingAmount };
  }, [payments]);

  const getModeLabel = (mode) => {
    const labels = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      cash: 'Cash',
      upi: 'UPI',
    };
    return labels[mode] || mode;
  };

  const getStatusClass = (paymentDate) => {
    return paymentDate ? 'paid' : 'pending';
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>My Payments</h1>
        <p>Track payment status for your orders</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Paid</h3>
          <p className="stat-value" style={{ color: '#10b981' }}>₹{stats.paidAmount.toFixed(2)}</p>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payment</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>₹{stats.pendingAmount.toFixed(2)}</p>
          <span className="stat-label">Action Needed</span>
        </div>
        <div className="stat-box">
          <h3>Total Amount</h3>
          <p className="stat-value">₹{(stats.paidAmount + stats.pendingAmount).toFixed(2)}</p>
          <span className="stat-label">All Orders</span>
        </div>
        <div className="stat-box">
          <h3>Transactions</h3>
          <p className="stat-value">{payments.length}</p>
          <span className="stat-label">Total</span>
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
          <button
            className={`filter-btn ${filterMode === 'paid' ? 'active' : ''}`}
            onClick={() => setFilterMode('paid')}
          >
            Paid ({payments.filter((p) => p.payment_date !== null).length})
          </button>
          <button
            className={`filter-btn ${filterMode === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterMode('pending')}
          >
            Pending ({payments.filter((p) => p.payment_date === null).length})
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Payment Mode</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td className="order-id">{payment.payment_id}</td>
                    <td>{payment.order_id}</td>
                    <td>{getModeLabel(payment.payment_mode)}</td>
                    <td className="amount">₹{payment.payment_amount.toFixed(2)}</td>
                    <td>{payment.payment_date || 'Pending'}</td>
                    <td>
                      <span className={`badge ${getStatusClass(payment.payment_date)}`}>
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
                  <label>Payment Mode</label>
                  <p>{getModeLabel(selectedPayment.payment_mode)}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className="amount-highlight">₹{selectedPayment.payment_amount.toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p>{selectedPayment.payment_date || 'Not yet paid'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span
                      className={`badge ${getStatusClass(selectedPayment.payment_date)}`}
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

export default UserPayments;
