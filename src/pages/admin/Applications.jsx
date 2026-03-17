import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { TableSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';
import StatusPill from '../../components/StatusPill';
import SearchBar from '../../components/SearchBar';
import { applications as initialApps } from '../../data/applications';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const statusTabs = ['All', 'Pending', 'Processing', 'Completed', 'Rejected'];

export default function Applications() {
  const loading = useLoadingDelay();
  const [data, setData] = useState(initialApps);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filtered = data.filter(a => {
    const matchSearch = a.customer_name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All' || a.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleStatusChange = (appId, newStatus) => {
    setData(data.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    toast.success(`Status updated to ${newStatus}`);
  };

  const columns = [
    { key: 'id', label: 'App ID', render: (r) => <Link to={`/admin/applications/${r.id}`} className="text-primary-800 font-medium hover:underline">{r.id}</Link> },
    { key: 'customer_name', label: 'Customer' },
    { key: 'service_name', label: 'Service' },
    { key: 'submitted_date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => (
      <select
        value={r.status}
        onChange={e => handleStatusChange(r.id, e.target.value)}
        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {statusTabs.slice(1).map(s => <option key={s}>{s}</option>)}
      </select>
    )},
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
    { key: 'agent', label: 'Agent' },
    { key: 'actions', label: '', sortable: false, render: (r) => (
      <Link to={`/admin/applications/${r.id}`} className="p-1.5 rounded hover:bg-gray-100 inline-flex">
        <Eye className="w-4 h-4 text-gray-500" />
      </Link>
    )},
  ];

  if (loading) return <TableSkeleton cols={7} />;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-xs opacity-70">
              ({tab === 'All' ? data.length : data.filter(a => a.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      <SearchBar placeholder="Search by customer name or App ID..." value={search} onChange={setSearch} />
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}
