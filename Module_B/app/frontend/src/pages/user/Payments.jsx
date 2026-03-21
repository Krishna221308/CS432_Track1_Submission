import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import '../../styles/admin.css';
import { getMemberId } from '../../utils/auth';

const UserPayments = () => {
  const currentMember = getMemberId();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!currentMember) return;
      try {
        setLoading(true);
        setError(null);
        // Standardized URL matching apis/__init__.py registration
        const response = await fetch(`http://127.0.0.1:5001/api/user/payments/${currentMember}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${response.status}`);
        }
        const data = await response.json();
        // Ensure data is an array
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Connection error. Please try again later.');
      } finally {
        setLoading(false);
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
        String(payment.payment_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(payment.order_id).toLowerCase().includes(searchTerm.toLowerCase());

      const isPaid = payment.status && payment.status.toLowerCase() === 'success';
      const matchesMode =
        filterMode === 'all' ||
        (filterMode === 'paid' && isPaid) ||
        (filterMode === 'pending' && !isPaid);

      return matchesSearch && matchesMode;
    });
  }, [payments, searchTerm, filterMode]);

  const stats = useMemo(() => {
    const paidAmount = payments
      .filter((p) => p.status && p.status.toLowerCase() === 'success')
      .reduce((sum, p) => sum + p.payment_amount, 0);
    const pendingAmount = payments
      .filter((p) => !p.status || p.status.toLowerCase() !== 'success')
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

  const getStatusClass = (status) => {
    return status?.toLowerCase() === 'success' ? 'paid' : 'pending';
  };

  const isPaymentPaid = (status) => status?.toLowerCase() === 'success';

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="action-btn">Retry</button>
        </div>
      </div>
    );
  }

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
          <span className="stat-label">Successful</span>
        </div>
        <div className="stat-box">
          <h3>Pending Payment</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>₹{stats.pendingAmount.toFixed(2)}</p>
          <span className="stat-label">Dues</span>
        </div>
        <div className="stat-box">
          <h3>Total Potential</h3>
          <p className="stat-value">₹{(stats.paidAmount + stats.pendingAmount).toFixed(2)}</p>
          <span className="stat-label">All Orders</span>
        </div>
        <div className="stat-box">
          <h3>Activity</h3>
          <p className="stat-value">{payments.length}</p>
          <span className="stat-label">Transactions</span>
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
            Paid ({payments.filter((p) => isPaymentPaid(p.status)).length})
          </button>
          <button
            className={`filter-btn ${filterMode === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterMode('pending')}
          >
            Pending ({payments.filter((p) => !isPaymentPaid(p.status)).length})
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
                    <td className="payment-id">{payment.payment_id}</td>
                    <td className="order-id">{payment.order_id}</td>
                    <td>{getModeLabel(payment.payment_mode || 'Pending')}</td>
                    <td className="amount">₹{(payment.payment_amount || 0).toFixed(2)}</td>
                    <td>{payment.payment_date || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getStatusClass(payment.status)}`}>
                        {isPaymentPaid(payment.status) ? 'Paid' : 'Pending'}
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
                    {searchTerm || filterMode !== 'all' ? 'No payments match your criteria' : 'No payments found for your account'}
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
                  <p>{getModeLabel(selectedPayment.payment_mode || 'Pending')}</p>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <p className="amount-highlight">₹{(selectedPayment.payment_amount || 0).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p>{selectedPayment.payment_date || 'Not yet paid'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span
                      className={`badge ${getStatusClass(selectedPayment.status)}`}
                      style={{ display: 'inline-block' }}
                    >
                      {isPaymentPaid(selectedPayment.status) ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #ef4444;
          font-weight: 600;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default UserPayments;
