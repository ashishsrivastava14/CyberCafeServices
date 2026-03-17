import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { services } from '../../data/services';
import { applications } from '../../data/applications';
import { vendors } from '../../data/vendors';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { Grid3X3, IndianRupee, FileText, TrendingUp } from 'lucide-react';

export default function VendorServices() {
  const loading = useLoadingDelay();
  const { user } = useAuth();
  const vendorId = user?.id;

  const vendor = useMemo(() => vendors.find(v => v.id === vendorId), [vendorId]);
  const vendorApps = useMemo(() => applications.filter(a => a.vendor_id === vendorId), [vendorId]);

  // Get unique service IDs this vendor has processed
  const serviceStats = useMemo(() => {
    const map = {};
    vendorApps.forEach(app => {
      if (!map[app.service_id]) {
        map[app.service_id] = { count: 0, revenue: 0, name: app.service_name };
      }
      map[app.service_id].count++;
      map[app.service_id].revenue += app.amount;
    });
    return Object.entries(map).map(([id, data]) => {
      const svc = services.find(s => s.id === Number(id));
      return {
        id: Number(id),
        name: data.name,
        icon: svc?.icon || '📋',
        category: svc?.category || 'Other',
        price: svc?.price || 0,
        applications: data.count,
        revenue: data.revenue,
        commission: Math.round(data.revenue * (vendor?.commission_rate || 10) / 100),
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [vendorApps, vendor]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{serviceStats.length}</p>
            <p className="text-xs text-gray-500">Services Used</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{vendorApps.length}</p>
            <p className="text-xs text-gray-500">Total Applications</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">₹{vendorApps.reduce((s, a) => s + a.amount, 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{vendor?.commission_rate}%</p>
            <p className="text-xs text-gray-500">Commission Rate</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <h2 className="text-lg font-semibold text-gray-800">Services Performance</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceStats.map(svc => (
          <div key={svc.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{svc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{svc.name}</p>
                <p className="text-xs text-gray-400">{svc.category} &bull; ₹{svc.price}/app</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-primary-700">{svc.applications}</p>
                <p className="text-[10px] text-gray-400">Apps</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">₹{svc.revenue.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">₹{svc.commission.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Commission</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {serviceStats.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          <Grid3X3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No services processed yet</p>
        </div>
      )}

      {/* All Available Services */}
      <h2 className="text-lg font-semibold text-gray-800">All Available Services</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{svc.icon}</span>
                      <span className="font-medium text-gray-700">{svc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{svc.category}</td>
                  <td className="px-4 py-3 text-right text-gray-700">₹{svc.price}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{svc.turnaround}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
