import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applications } from '../../data/applications';
import { wallets, walletTransactions } from '../../data/wallets';
import { vendors } from '../../data/vendors';
import { services } from '../../data/services';
import StatCard from '../../components/StatCard';
import StatusPill from '../../components/StatusPill';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { FileText, IndianRupee, Wallet, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function VendorDashboard() {
  const loading = useLoadingDelay();
  const { user } = useAuth();
  const vendorId = user?.id;

  const vendor = useMemo(() => vendors.find(v => v.id === vendorId), [vendorId]);
  const vendorApps = useMemo(() => applications.filter(a => a.vendor_id === vendorId), [vendorId]);
  const wallet = useMemo(() => wallets.find(w => w.vendor_id === vendorId), [vendorId]);
  const recentTxns = useMemo(() =>
    walletTransactions.filter(t => t.vendor_id === vendorId).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [vendorId]
  );

  const stats = useMemo(() => {
    const completed = vendorApps.filter(a => a.status === 'Completed').length;
    const pending = vendorApps.filter(a => a.status === 'Pending').length;
    const processing = vendorApps.filter(a => a.status === 'Processing').length;
    const totalRevenue = vendorApps.reduce((sum, a) => sum + a.amount, 0);
    return { completed, pending, processing, totalRevenue, total: vendorApps.length };
  }, [vendorApps]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg p-6 text-white">
        <h1 className="text-xl font-bold">Welcome, {vendor?.name || 'Vendor'}!</h1>
        <p className="text-primary-200 text-sm mt-1">{vendor?.city} &bull; Commission Rate: {vendor?.commission_rate}%</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats.total} icon={FileText} trend={12} />
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={IndianRupee} trend={8} />
        <StatCard label="Commission Earned" value={`₹${vendor?.commission_earned?.toLocaleString() || 0}`} icon={TrendingUp} trend={5} />
        <StatCard label="Wallet Balance" value={`₹${wallet?.balance?.toLocaleString() || 0}`} icon={Wallet} />
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Clock className="w-8 h-8 text-amber-500" />
          <div>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-blue-700">{stats.processing}</p>
            <p className="text-xs text-blue-600">Processing</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            <p className="text-xs text-green-600">Completed</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Applications</h3>
            <Link to="/vendor/applications" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {vendorApps.slice(0, 5).map(app => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{app.service_name}</p>
                  <p className="text-xs text-gray-500">{app.customer_name} &bull; {app.id}</p>
                </div>
                <div className="text-right">
                  <StatusPill status={app.status} />
                  <p className="text-xs text-gray-400 mt-1">₹{app.amount}</p>
                </div>
              </div>
            ))}
            {vendorApps.length === 0 && (
              <p className="p-4 text-sm text-gray-400 text-center">No applications yet</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <Link to="/vendor/wallet" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTxns.map(txn => (
              <div key={txn.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{txn.description}</p>
                  <p className="text-xs text-gray-500">{txn.date} &bull; {txn.reference}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === 'Credit' ? 'text-green-600' : txn.type === 'Withdrawal' ? 'text-red-600' : 'text-gray-600'}`}>
                    {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </p>
                  <StatusPill status={txn.status} />
                </div>
              </div>
            ))}
            {recentTxns.length === 0 && (
              <p className="p-4 text-sm text-gray-400 text-center">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/vendor/applications" className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg text-primary-700 hover:bg-primary-100 transition-colors text-sm font-medium">
            <FileText className="w-4 h-4" /> View Applications
          </Link>
          <Link to="/vendor/services" className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium">
            <TrendingUp className="w-4 h-4" /> My Services
          </Link>
          <Link to="/vendor/wallet" className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-sm font-medium">
            <Wallet className="w-4 h-4" /> Wallet
          </Link>
          <Link to="/vendor/profile" className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium">
            <XCircle className="w-4 h-4" /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
