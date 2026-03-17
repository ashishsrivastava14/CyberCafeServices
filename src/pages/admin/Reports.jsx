import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatCard from '../../components/StatCard';
import { IndianRupee, FileText, Users, ShoppingCart, Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#1a3a6b', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#ec4899'];

const monthlyRevenue = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(Math.random() * 3000) + 1000,
}));

const serviceRevenue = [
  { name: 'Aadhaar', value: 4200 },
  { name: 'PAN', value: 3800 },
  { name: 'DL', value: 3100 },
  { name: 'RTPS', value: 2500 },
  { name: 'Passport', value: 4500 },
  { name: 'Other', value: 2200 },
];

const dailyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  applications: Math.floor(Math.random() * 10) + 2,
  revenue: Math.floor(Math.random() * 3000) + 500,
}));

const topServices = [
  { name: 'Passport New', applications: 45, revenue: 67500 },
  { name: 'Permanent License', applications: 38, revenue: 19000 },
  { name: 'Aadhaar Card New', applications: 35, revenue: 3500 },
  { name: 'PAN Card New', applications: 30, revenue: 4500 },
  { name: 'Vehicle Registration', applications: 25, revenue: 12500 },
];

export default function Reports() {
  const loading = useLoadingDelay();

  if (loading) return <PageSkeleton />;

  const handleExport = () => {
    console.log('Exporting report...');
    toast.success('Report export started');
  };

  return (
    <div className="space-y-6">
      {/* Date Range */}
      <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        <input type="date" defaultValue="2024-10-01" className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm" />
        <span className="text-sm text-gray-500">to</span>
        <input type="date" defaultValue="2024-10-31" className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm" />
        <button onClick={handleExport} className="flex items-center gap-2 bg-primary-800 text-white px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-primary-900 ml-auto">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue" value="₹20,320" change={15} direction="up" icon={IndianRupee} />
        <StatCard label="Applications" value="20" change={8} direction="up" icon={FileText} />
        <StatCard label="New Customers" value="5" change={12} direction="up" icon={Users} />
        <StatCard label="Avg Order Value" value="₹1,016" change={3} direction="down" icon={ShoppingCart} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar */}
        <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Bar dataKey="revenue" fill="#1a3a6b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Pie */}
        <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue by Service</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={serviceRevenue} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {serviceRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Daily Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" fontSize={10} />
            <YAxis yAxisId="left" fontSize={10} />
            <YAxis yAxisId="right" orientation="right" fontSize={10} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="applications" stroke="#1a3a6b" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Top 5 Services by Revenue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Applications</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((s, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.applications}</td>
                  <td className="px-4 py-3 font-medium text-primary-800">₹{s.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
