import React, { useState, useMemo, useEffect } from 'react';
import { Search, Edit2 } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { getAssignedPayments, updatePaymentStatus } from '../../utils/employeeApi';
import '../../styles/admin.css';

const EmployeePayments = () => {
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId;
  }, []);

  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const loadData = async () => {
    if (!currentEmployee) return;
    setLoading(true);
    try {
      const data = await getAssignedPayments(currentEmployee);
      setPayments(data);
    } catch (err) {
      addToast(err.message || 'Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [currentEmployee]);

  // ── Search ───────────────────────────────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      String(p.payment_id || '').toLowerCase().includes(q) ||
      String(p.order_id || '').toLowerCase().includes(q)
    );
  });

  // ── Status badge helper ──────────────────────────────────────────────────
  // Schema: payment_status.status_name ∈ { 'Success', 'Pending', 'Failed' }
  const getBadgeClass = (status) => {
    if (status === 'Success') return 'badge completed';
    if (status === 'Failed') return 'badge cancelled';
    return 'badge pending';
  };

  // ── Update payment status ────────────────────────────────────────────────
  const handleUpdateStatus = async (payment, newStatus) => {
    try {
      await updatePaymentStatus(payment.payment_id, newStatus);
      addToast(`Payment marked as ${newStatus}`, 'success');
      // Optimistic local state update
      const updated = { ...payment, payment_status: newStatus };
      setPayments((prev) =>
        prev.map((p) => (p.payment_id === payment.payment_id ? updated : p))
      );
      if (selectedPayment?.payment_id === payment.payment_id) {
        setSelectedPayment(updated);
      }
    } catch (err) {
      addToast(err.message || 'Failed to update payment', 'error');
    }
  };

  // ── Summary stats ────────────────────────────────────────────────────────
  const totalRevenue = payments.filter((p) => p.payment_status === 'Success')
    .reduce((s, p) => s + (p.payment_amount || 0), 0);
  const pendingAmount = payments.filter((p) => p.payment_status !== 'Success')
    .reduce((s, p) => s + (p.payment_amount || 0), 0);

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Assigned Orders — Payments</h1>
        <p>Manage payment statuses for your assigned laundry orders</p>
      </header>

      {/* ── Stats ── */}
      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
          <span className="stat-label">Successful Payments</span>
        </div>
        <div className="stat-box">
          <h3>Pending / Failed</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>₹{pendingAmount.toFixed(2)}</p>
          <span className="stat-label">Awaiting / Failed</span>
        </div>
        <div className="stat-box">
          <h3>Total Transactions</h3>
          <p className="stat-value" style={{ color: '#3b82f6' }}>{payments.length}</p>
          <span className="stat-label">All Payments</span>
        </div>
      </div>

      {/* ── Search ── */}
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
      </div>

      {/* ── Table ── */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading payments…
            </p>
          ) : (
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
                      <td>{payment.payment_date ? payment.payment_date.split('T')[0] : '—'}</td>
                      <td>
                        <span className={getBadgeClass(payment.payment_status)}>
                          {payment.payment_status || 'Pending'}
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
                    <td colSpan="7" className="no-data">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Payment Management Modal ── */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Payment</h2>
              <button className="close-modal" onClick={() => setSelectedPayment(null)}>×</button>
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
                  <p className="amount-highlight" style={{ fontSize: '1.2rem' }}>
                    ₹{(selectedPayment.payment_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Payment Mode</label>
                  <p>{(selectedPayment.payment_mode || '').replace('_', ' ')}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date</label>
                  <p>
                    {selectedPayment.payment_date
                      ? selectedPayment.payment_date.split('T')[0]
                      : '—'}
                  </p>
                </div>
                <div className="detail-item">
                  <label htmlFor="payment-status-select">Status</label>
                  {/* Allowed values: Success | Pending | Failed */}
                  <select
                    id="payment-status-select"
                    className="form-select"
                    value={selectedPayment.payment_status || 'Pending'}
                    onChange={(e) =>
                      handleUpdateStatus(selectedPayment, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Success">Success (Paid)</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={() => setSelectedPayment(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePayments;
