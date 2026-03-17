import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageSkeleton } from './components/Skeleton';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import VendorLayout from './layouts/VendorLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages
const CustomerHome = lazy(() => import('./pages/customer/Home'));
const Services = lazy(() => import('./pages/customer/Services'));
const ServiceDetail = lazy(() => import('./pages/customer/ServiceDetail'));
const ApplyForm = lazy(() => import('./pages/customer/ApplyForm'));
const TrackApplication = lazy(() => import('./pages/customer/TrackApplication'));
const Login = lazy(() => import('./pages/Login'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const CustomerDetailPage = lazy(() => import('./pages/admin/CustomerDetail'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const ApplicationDetail = lazy(() => import('./pages/admin/ApplicationDetail'));
const ServiceManager = lazy(() => import('./pages/admin/ServiceManager'));
const Payments = lazy(() => import('./pages/admin/Payments'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Vendors = lazy(() => import('./pages/admin/Vendors'));
const VendorWallet = lazy(() => import('./pages/admin/VendorWallet'));
const Notifications = lazy(() => import('./pages/admin/Notifications'));

// Vendor pages
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'));
const VendorApplications = lazy(() => import('./pages/vendor/Applications'));
const VendorWalletPage = lazy(() => import('./pages/vendor/Wallet'));
const VendorServices = lazy(() => import('./pages/vendor/Services'));
const VendorProfile = lazy(() => import('./pages/vendor/Profile'));

function SuspenseWrapper({ children }) {
  return (
    <Suspense fallback={<div className="p-6"><PageSkeleton /></div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><CustomerHome /></SuspenseWrapper> },
      { path: 'services', element: <SuspenseWrapper><Services /></SuspenseWrapper> },
      { path: 'services/:id', element: <SuspenseWrapper><ServiceDetail /></SuspenseWrapper> },
      { path: 'apply/:serviceId', element: <SuspenseWrapper><ApplyForm /></SuspenseWrapper> },
      { path: 'track', element: <SuspenseWrapper><TrackApplication /></SuspenseWrapper> },
    ],
  },
  {
    path: '/login',
    element: <SuspenseWrapper><Login /></SuspenseWrapper>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'customers', element: <SuspenseWrapper><Customers /></SuspenseWrapper> },
      { path: 'customers/:id', element: <SuspenseWrapper><CustomerDetailPage /></SuspenseWrapper> },
      { path: 'applications', element: <SuspenseWrapper><Applications /></SuspenseWrapper> },
      { path: 'applications/:id', element: <SuspenseWrapper><ApplicationDetail /></SuspenseWrapper> },
      { path: 'services', element: <SuspenseWrapper><ServiceManager /></SuspenseWrapper> },
      { path: 'payments', element: <SuspenseWrapper><Payments /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
      { path: 'vendors', element: <SuspenseWrapper><Vendors /></SuspenseWrapper> },
      { path: 'vendor-wallet', element: <SuspenseWrapper><VendorWallet /></SuspenseWrapper> },
      { path: 'notifications', element: <SuspenseWrapper><Notifications /></SuspenseWrapper> },
    ],
  },
  {
    path: '/vendor',
    element: <ProtectedRoute allowedRole="vendor"><VendorLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/vendor/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><VendorDashboard /></SuspenseWrapper> },
      { path: 'applications', element: <SuspenseWrapper><VendorApplications /></SuspenseWrapper> },
      { path: 'services', element: <SuspenseWrapper><VendorServices /></SuspenseWrapper> },
      { path: 'wallet', element: <SuspenseWrapper><VendorWalletPage /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><VendorProfile /></SuspenseWrapper> },
    ],
  },
]);
