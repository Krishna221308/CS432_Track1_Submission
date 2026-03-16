import React, { useMemo } from 'react';
import { ShoppingBag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import {
  getOrdersAssignedToEmployee,
  getPaymentsForAssignedOrders,
  getLostItemsForAssignedOrders,
} from '../../utils/mockData';
import '../../styles/dashboard.css';

const EmployeeDashboard = () => {
  // Get current employee from auth (stored in localStorage)
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId || 'EMP-001'; // Default to EMP-001 for demo
  }, []);

  const assignedOrders = useMemo(() => getOrdersAssignedToEmployee(currentEmployee), [currentEmployee]);
  const assignedPayments = useMemo(() => getPaymentsForAssignedOrders(currentEmployee), [currentEmployee]);
  const assignedLostItems = useMemo(() => getLostItemsForAssignedOrders(currentEmployee), [currentEmployee]);

  const pendingOrders = assignedOrders.filter((o) => o.order_status === 'pending').length;
  const processingOrders = assignedOrders.filter((o) => o.order_status === 'processing').length;
  const completedOrders = assignedOrders.filter((o) => o.order_status === 'completed').length;
  const pendingPayments = assignedPayments.filter((p) => p.payment_date === null).length;

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

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card large">
          <div className="card-header">
            <h2>Your Assigned Orders</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="table-container">
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
                  assignedOrders.slice(0, 5).map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{order.member_id}</td>
                      <td>{order.order_date}</td>
                      <td>{order.pickup_time}</td>
                      <td>
                        <span className={`badge ${order.order_status}`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </td>
                      <td>${order.total_amount.toFixed(2)}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
