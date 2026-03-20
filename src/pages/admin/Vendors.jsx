import { useState } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import { vendors as initialVendors } from '../../data/vendors';
import { Plus, Eye, Edit, Ban, IndianRupee, Clock, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Vendors() {
  const loading = useLoadingDelay();
  const [data, setData] = useState(initialVendors);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ name: '', city: '', phone: '', commission_rate: 10 });

  const totalPaid = data.reduce((s, v) => s + v.commission_earned, 0);
  const pending = data.filter(v => v.status === 'Active').reduce((s, v) => s + (v.total_earned * v.commission_rate / 100 - v.commission_earned), 0);
  const thisMonth = Math.floor(totalPaid * 0.3);

  const openAdd = () => {
    setForm({ name: '', city: '', phone: '', commission_rate: 10 });
    setModal('add');
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, city: item.city, phone: item.phone, commission_rate: item.commission_rate });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.name || !form.city || !form.phone) {
      toast.error('All fields are required');
      return;
    }
    if (modal === 'add') {
      const newVendor = {
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
        joined: new Date().toISOString().split('T')[0],
        services_count: 0,
        total_earned: 0,
        commission_earned: 0,
        commission_rate: Number(form.commission_rate),
        status: 'Active',
      };
      setData([...data, newVendor]);
      toast.success('Retailer added');
    } else {
      setData(data.map(d => d.id === editItem.id ? { ...d, ...form, commission_rate: Number(form.commission_rate) } : d));
      toast.success('Retailer updated');
    }
    setModal(null);
  };

  const toggleSuspend = (id) => {
    setData(data.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Suspended' : 'Active' } : d));
    toast.success('Retailer status updated');
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Commission Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Commission Paid" value={`₹${totalPaid.toLocaleString()}`} icon={IndianRupee} />
        <StatCard label="Pending Commission" value={`₹${Math.abs(Math.floor(pending)).toLocaleString()}`} icon={Clock} />
        <StatCard label="This Month" value={`₹${thisMonth.toLocaleString()}`} icon={CalendarDays} />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{data.length} retailers</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900">
          <Plus className="w-4 h-4" /> Add Retailer
        </button>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(v => (
          <div key={v.id} className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{v.name}</h3>
                <p className="text-sm text-gray-500">{v.city}</p>
              </div>
              <StatusPill status={v.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div><span className="text-gray-500">Services:</span> <span className="font-medium">{v.services_count}</span></div>
              <div><span className="text-gray-500">Earned:</span> <span className="font-medium">₹{v.total_earned.toLocaleString()}</span></div>
              <div><span className="text-gray-500">Commission:</span> <span className="font-medium">{v.commission_rate}%</span></div>
              <div><span className="text-gray-500">Comm. Earned:</span> <span className="font-medium">₹{v.commission_earned.toLocaleString()}</span></div>
            </div>
            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button onClick={() => setViewItem(v)} className="flex items-center gap-1 text-xs text-primary-800 hover:underline"><Eye className="w-3 h-3" /> View</button>
              <button onClick={() => openEdit(v)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><Edit className="w-3 h-3" /> Edit</button>
              <button onClick={() => toggleSuspend(v.id)} className="flex items-center gap-1 text-xs text-red-600 hover:underline"><Ban className="w-3 h-3" /> {v.status === 'Active' ? 'Suspend' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Retailer' : 'Edit Retailer'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
              <input type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 bg-primary-800 text-white py-2 rounded-sm text-sm font-medium hover:bg-primary-900">Save</button>
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-300 py-2 rounded-sm text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewItem && (
        <Modal title="Retailer Details" onClose={() => setViewItem(null)}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-500">Name:</span> <p className="font-medium">{viewItem.name}</p></div>
              <div><span className="text-gray-500">City:</span> <p className="font-medium">{viewItem.city}</p></div>
              <div><span className="text-gray-500">Phone:</span> <p className="font-medium">{viewItem.phone}</p></div>
              <div><span className="text-gray-500">Joined:</span> <p className="font-medium">{viewItem.joined}</p></div>
              <div><span className="text-gray-500">Services:</span> <p className="font-medium">{viewItem.services_count}</p></div>
              <div><span className="text-gray-500">Total Earned:</span> <p className="font-medium">₹{viewItem.total_earned.toLocaleString()}</p></div>
              <div><span className="text-gray-500">Commission Rate:</span> <p className="font-medium">{viewItem.commission_rate}%</p></div>
              <div><span className="text-gray-500">Commission Earned:</span> <p className="font-medium">₹{viewItem.commission_earned.toLocaleString()}</p></div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-gray-500">Status:</span>
              <StatusPill status={viewItem.status} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
