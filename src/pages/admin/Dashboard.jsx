import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatCard from '../../components/StatCard';
import StatusPill from '../../components/StatusPill';
import { applications } from '../../data/applications';
import { payments } from '../../data/payments';
import { customers } from '../../data/customers';
import {
  IndianRupee, FileText, Clock, Users, Plus, UserPlus, Grid3X3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 2400 },
  { day: 'Tue', revenue: 1800 },
  { day: 'Wed', revenue: 3200 },
  { day: 'Thu', revenue: 2800 },
  { day: 'Fri', revenue: 3600 },
  { day: 'Sat', revenue: 4100 },
  { day: 'Sun', revenue: 2200 },
];

const COLORS = ['#1a3a6b', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#ec4899'];

export default function Dashboard() {
  const loading = useLoadingDelay();

  if (loading) return <PageSkeleton />;

  const todayRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const recentApps = applications.slice(-5).reverse();

  const serviceDistribution = applications.reduce((acc, app) => {
    const cat = app.service_name.split(' ')[0];
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(serviceDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={`₹${todayRevenue.toLocaleString()}`} change={12} direction="up" icon={IndianRupee} />
        <StatCard label="Total Applications" value={applications.length} change={8} direction="up" icon={FileText} />
        <StatCard label="Pending" value={pendingApps} change={3} direction="down" icon={Clock} />
        <StatCard label="Active Customers" value={activeCustomers} change={5} direction="up" icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Bar dataKey="revenue" fill="#1a3a6b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Applications</h3>
          <Link to="/admin/applications" className="text-sm text-primary-800 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">App ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary-800">{app.id}</td>
                  <td className="px-4 py-3">{app.customer_name}</td>
                  <td className="px-4 py-3">{app.service_name}</td>
                  <td className="px-4 py-3 text-gray-500">{app.submitted_date}</td>
                  <td className="px-4 py-3"><StatusPill status={app.status} /></td>
                  <td className="px-4 py-3 font-medium">₹{app.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/applications" className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900 transition-colors">
          <Plus className="w-4 h-4" /> New Application
        </Link>
        <Link to="/admin/customers" className="flex items-center gap-2 bg-accent-500 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-accent-600 transition-colors">
          <UserPlus className="w-4 h-4" /> Add Customer
        </Link>
        <Link to="/admin/services" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-green-700 transition-colors">
          <Grid3X3 className="w-4 h-4" /> Add Service
        </Link>
      </div>
    </div>
  );
}
