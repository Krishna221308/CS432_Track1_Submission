import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Landing from './pages/Landing';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminFeedbacks from './pages/admin/Feedbacks';
import AdminMembers from './pages/admin/Members';
import AdminEmployees from './pages/admin/Employees';
import AdminLostItems from './pages/admin/LostItems';
import AdminServices from './pages/admin/Services';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeOrders from './pages/employee/Orders';
import EmployeePayments from './pages/employee/Payments';
import EmployeeFeedback from './pages/employee/Feedback';
import EmployeeLostItems from './pages/employee/LostItems';
import UserDashboard from './pages/user/Dashboard';
import UserOrders from './pages/user/Orders';
import UserPayments from './pages/user/Payments';
import UserReportLostItems from './pages/user/ReportLostItems';
import UserFeedback from './pages/user/Feedback';
import Profile from './pages/common/Profile';
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
    path: '/admin-auth',
    element: <AdminLogin />,
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
      { path: 'members', element: <AdminMembers /> },
      { path: 'employees', element: <AdminEmployees /> },
      { path: 'lost-items', element: <AdminLostItems /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'profile', element: <Profile /> },
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
      { path: 'profile', element: <Profile /> },
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
      { path: 'orders', element: <UserOrders /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'report-lost-items', element: <UserReportLostItems /> },
      { path: 'feedback', element: <UserFeedback /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
];

export default routes;
