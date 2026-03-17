import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applications } from '../../data/applications';
import StatusPill from '../../components/StatusPill';
import SearchBar from '../../components/SearchBar';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { FileText, Eye, Clock } from 'lucide-react';
import Modal from '../../components/Modal';

const statusTabs = ['All', 'Pending', 'Processing', 'Completed', 'Rejected'];

export default function VendorApplications() {
  const loading = useLoadingDelay();
  const { user } = useAuth();
  const vendorId = user?.id;

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const vendorApps = useMemo(() => applications.filter(a => a.vendor_id === vendorId), [vendorId]);

  const filtered = useMemo(() => {
    let list = vendorApps;
    if (activeTab !== 'All') list = list.filter(a => a.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.customer_name.toLowerCase().includes(q) ||
        a.service_name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vendorApps, activeTab, search]);

  const counts = useMemo(() => {
    const c = { All: vendorApps.length };
    statusTabs.slice(1).forEach(s => { c[s] = vendorApps.filter(a => a.status === s).length; });
    return c;
  }, [vendorApps]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab} ({counts[tab] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search by customer, service or App ID..." />

      {/* Applications List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">App ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary-700">{app.id}</td>
                  <td className="px-4 py-3 text-gray-700">{app.customer_name}</td>
                  <td className="px-4 py-3 text-gray-700">{app.service_name}</td>
                  <td className="px-4 py-3 text-gray-500">{app.submitted_date}</td>
                  <td className="px-4 py-3 text-gray-700">₹{app.amount}</td>
                  <td className="px-4 py-3"><StatusPill status={app.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedApp(app)} className="text-primary-600 hover:text-primary-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(app => (
            <div key={app.id} className="p-4" onClick={() => setSelectedApp(app)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-700">{app.id}</span>
                <StatusPill status={app.status} />
              </div>
              <p className="text-sm font-medium text-gray-800">{app.service_name}</p>
              <p className="text-xs text-gray-500 mt-1">{app.customer_name} &bull; {app.submitted_date}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">₹{app.amount}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No applications found</p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal title={`Application ${selectedApp.id}`} onClose={() => setSelectedApp(null)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm font-medium">{selectedApp.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-medium">{selectedApp.service_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium">{selectedApp.submitted_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium">₹{selectedApp.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <StatusPill status={selectedApp.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Agent</p>
                <p className="text-sm font-medium">{selectedApp.agent}</p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Documents</p>
              <div className="flex flex-wrap gap-2">
                {selectedApp.documents.map((doc, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedApp.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">{selectedApp.notes}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <p className="text-xs text-gray-500 mb-3">Progress</p>
              <div className="flex items-center gap-2">
                {['Submitted', 'Under Review', 'Processing', 'Completed'].map((step, i) => {
                  const stepMap = { 'Submitted': 0, 'Under Review': 1, 'Processing': 2, 'Completed': 3 };
                  const statusStep = { Pending: 0, Processing: 2, Completed: 3, Rejected: 1 };
                  const current = statusStep[selectedApp.status] ?? 0;
                  const done = i <= current;
                  return (
                    <div key={step} className="flex items-center gap-2 flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${done ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <span className={`text-[10px] hidden sm:inline ${done ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{step}</span>
                      {i < 3 && <div className={`flex-1 h-0.5 ${done && i < current ? 'bg-primary-800' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
