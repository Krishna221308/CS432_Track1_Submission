import React, { useMemo, useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import {
  getAssignedOrders,
  getAssignedPayments,
  getAssignedLostItems,
} from '../../utils/employeeApi';
import '../../styles/dashboard.css';

const EmployeeDashboard = () => {
  // Get current employee's numeric ID from localStorage (set during login)
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId;          // numeric ID from DB, e.g. 1
  }, []);

  const [assignedOrders, setAssignedOrders] = useState([]);
  const [assignedPayments, setAssignedPayments] = useState([]);
  const [assignedLostItems, setAssignedLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when we have a valid numeric employee ID
    if (!currentEmployee) {
      setError('No employee ID found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fire all three requests in parallel
        const [orders, payments, lostItems] = await Promise.all([
          getAssignedOrders(currentEmployee),
          getAssignedPayments(currentEmployee),
          getAssignedLostItems(currentEmployee),
        ]);
        setAssignedOrders(orders);
        setAssignedPayments(payments);
        setAssignedLostItems(lostItems);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentEmployee]);

  // Derived counts — order_status comes back lowercase from the API
  const pendingOrders = assignedOrders.filter((o) => o.order_status === 'pending').length;
  const completedOrders = assignedOrders.filter((o) => o.order_status === 'completed').length;

  const stats = [
    { title: 'Assigned Orders', value: assignedOrders.length.toString(), icon: <ShoppingBag size={24} />, trend: 2, color: '#1e40af' },
    { title: 'Pending Orders', value: pendingOrders.toString(), icon: <Clock size={24} />, trend: -1, color: '#f59e0b' },
    { title: 'Completed Orders', value: completedOrders.toString(), icon: <CheckCircle size={24} />, trend: 3, color: '#10b981' },
    { title: 'Issues to Handle', value: assignedLostItems.length.toString(), icon: <AlertCircle size={24} />, trend: 0, color: '#ef4444' },
  ];

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>View your assigned orders and tasks.</p>
      </header>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* ── Recent assigned orders preview table ── */}
      <div className="dashboard-grid">
        <div className="content-card large">
          <div className="card-header">
            <h2>Your Assigned Orders</h2>
            <button className="view-all">View All</button>
          </div>

          <div className="table-container">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Loading orders…
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Member ID</th>
                    <th>Order Date</th>
                    <th>Pickup Time</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedOrders.length > 0 ? (
                    // Show only the 5 most recent
                    assignedOrders.slice(0, 5).map((order) => (
                      <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.member_id}</td>
                        <td>{order.order_date}</td>
                        <td>{order.pickup_time}</td>
                        <td>
                          {/* Badge class matches lowercase status: 'pending', 'processing', 'completed' */}
                          <span className={`badge ${order.order_status}`}>
                            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                          </span>
                        </td>
                        <td>₹{order.total_amount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        No assigned orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
