import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { vendors } from '../../data/vendors';
import { wallets } from '../../data/wallets';
import { applications } from '../../data/applications';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import { User, MapPin, Phone, Mail, Calendar, Store, IndianRupee, Percent, Building2, CreditCard, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorProfile() {
  const loading = useLoadingDelay();
  const { user } = useAuth();
  const vendorId = user?.id;

  const vendor = useMemo(() => vendors.find(v => v.id === vendorId), [vendorId]);
  const wallet = useMemo(() => wallets.find(w => w.vendor_id === vendorId), [vendorId]);
  const vendorApps = useMemo(() => applications.filter(a => a.vendor_id === vendorId), [vendorId]);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: vendor?.phone || '',
    city: vendor?.city || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  if (loading) return <PageSkeleton />;

  const initials = vendor?.name ? vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'V';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg p-6 text-white flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 bg-accent-400 text-primary-900 rounded-full flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-xl font-bold">{vendor?.name}</h1>
          <p className="text-primary-200 text-sm mt-1">{vendor?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-primary-300">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vendor?.city}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {vendor?.joined}</span>
          </div>
        </div>
        <StatusPill status={vendor?.status || 'Active'} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary-600" /> Business Information
          </h3>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 border border-gray-300 rounded-sm text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-primary-800 text-white rounded-sm text-sm font-semibold hover:bg-primary-900 flex items-center justify-center gap-1">
                  <Save className="w-3 h-3" /> Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{vendor?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{vendor?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium">{vendor?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="font-medium">{vendor?.joined}</p>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="w-full mt-2 py-2 border border-primary-200 text-primary-700 rounded-sm text-sm hover:bg-primary-50 transition-colors">
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-600" /> Financial Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2"><IndianRupee className="w-3 h-3" /> Total Earned</span>
              <span className="font-semibold text-gray-800">₹{vendor?.total_earned?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2"><Percent className="w-3 h-3" /> Commission Rate</span>
              <span className="font-semibold text-gray-800">{vendor?.commission_rate}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2"><IndianRupee className="w-3 h-3" /> Commission Earned</span>
              <span className="font-semibold text-green-600">₹{vendor?.commission_earned?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2"><FileText className="w-3 h-3" /> Total Applications</span>
              <span className="font-semibold text-gray-800">{vendorApps.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2"><Store className="w-3 h-3" /> Services Used</span>
              <span className="font-semibold text-gray-800">{vendor?.services_count}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Bank & Payment Details
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Bank Name</p>
              <p className="font-medium text-gray-800">{wallet?.bank_name}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Account Number</p>
              <p className="font-medium text-gray-800">{wallet?.account_no}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">IFSC Code</p>
              <p className="font-medium text-gray-800">{wallet?.ifsc}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">UPI ID</p>
              <p className="font-medium text-gray-800">{wallet?.upi_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
