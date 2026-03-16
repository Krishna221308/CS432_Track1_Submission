import React from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import '../styles/dashboard.css';

const EmployeeDashboard = () => {
  const stats = [
    { title: 'My Active Orders', value: '12', icon: <ShoppingBag size={24} />, trend: 2, color: '#1e40af' },
    { title: 'Pickups Today', value: '4', icon: <Truck size={24} />, trend: 0, color: '#f59e0b' },
    { title: 'Completed Today', value: '8', icon: <CheckCircle size={24} />, trend: 25, color: '#10b981' },
    { title: 'Avg. Turnaround', value: '2.4 hrs', icon: <Clock size={24} />, trend: -10, color: '#14b8a6' },
  ];

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Managed assigned orders and schedules.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card large">
          <div className="card-header">
            <h2>Upcoming Pickups</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>14:30 PM</td>
                  <td>Alice Johnson</td>
                  <td>123 Main St, Apt 4B</td>
                  <td><span className="badge pending">Scheduled</span></td>
                  <td><button className="table-action">Navigate</button></td>
                </tr>
                <tr>
                  <td>15:45 PM</td>
                  <td>Mark Wilson</td>
                  <td>456 Oak Lane</td>
                  <td><span className="badge processing">On the way</span></td>
                  <td><button className="table-action">Complete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
