import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { TableSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';
import StatusPill from '../../components/StatusPill';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { customers as initialCustomers } from '../../data/customers';
import { Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Customers() {
  const loading = useLoadingDelay();
  const [data, setData] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null); // 'add' | 'edit'
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', aadhaar_last4: '', status: 'Active' });

  const cities = ['All', ...new Set(initialCustomers.map(c => c.city))];

  const filtered = data.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchCity = cityFilter === 'All' || c.city === cityFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchCity && matchStatus;
  });

  const openAdd = () => {
    setForm({ name: '', phone: '', email: '', city: '', aadhaar_last4: '', status: 'Active' });
    setModal('add');
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, phone: item.phone, email: item.email, city: item.city, aadhaar_last4: item.aadhaar_last4, status: item.status });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast.error('Name and Phone are required');
      return;
    }
    if (modal === 'add') {
      const newItem = {
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
        joined: new Date().toISOString().split('T')[0],
        total_applications: 0,
        total_spent: 0,
      };
      setData([...data, newItem]);
      toast.success('Customer added successfully');
    } else {
      setData(data.map(d => d.id === editItem.id ? { ...d, ...form } : d));
      toast.success('Customer updated successfully');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setData(data.filter(d => d.id !== id));
      toast.success('Customer deleted');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (r) => <Link to={`/admin/customers/${r.id}`} className="text-primary-800 font-medium hover:underline">{r.name}</Link> },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'total_applications', label: 'Applications' },
    { key: 'total_spent', label: 'Spent', render: (r) => `₹${r.total_spent}` },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions', label: 'Actions', sortable: false, render: (r) => (
        <div className="flex gap-1">
          <Link to={`/admin/customers/${r.id}`} className="p-1.5 rounded hover:bg-gray-100" title="View"><Eye className="w-4 h-4 text-gray-500" /></Link>
          <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-gray-100" title="Edit"><Edit className="w-4 h-4 text-blue-500" /></button>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-gray-100" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
        </div>
      )
    },
  ];

  if (loading) return <TableSkeleton cols={8} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <SearchBar placeholder="Search by name or phone..." value={search} onChange={setSearch}>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-2 text-sm">
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-2 text-sm">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </SearchBar>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900 whitespace-nowrap">
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <DataTable columns={columns} rows={filtered} />

      {modal && (
        <Modal title={modal === 'add' ? 'Add Customer' : 'Edit Customer'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Last 4</label>
                <input value={form.aadhaar_last4} onChange={e => setForm({ ...form, aadhaar_last4: e.target.value })} maxLength={4} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 bg-primary-800 text-white py-2 rounded-sm text-sm font-medium hover:bg-primary-900">Save</button>
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-300 py-2 rounded-sm text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
