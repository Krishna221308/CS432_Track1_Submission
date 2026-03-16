import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminFeedbacks from './pages/admin/Feedbacks';
import AdminEmployees from './pages/admin/Employees';
import AdminLostItems from './pages/admin/LostItems';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeOrders from './pages/employee/Orders';
import EmployeePayments from './pages/employee/Payments';
import EmployeeFeedback from './pages/employee/Feedback';
import EmployeeLostItems from './pages/employee/LostItems';
import UserDashboard from './pages/UserDashboard';
import { isAuthenticated } from './utils/auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const routes = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'feedbacks', element: <AdminFeedbacks /> },
      { path: 'employees', element: <AdminEmployees /> },
      { path: 'lost-items', element: <AdminLostItems /> },
    ],
  },
  {
    path: '/employee',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <EmployeeDashboard /> },
      { path: 'orders', element: <EmployeeOrders /> },
      { path: 'payments', element: <EmployeePayments /> },
      { path: 'feedbacks', element: <EmployeeFeedback /> },
      { path: 'lost-items', element: <EmployeeLostItems /> },
    ],
  },
  {
    path: '/user',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <UserDashboard /> },
    ],
  },
];

export default routes;
