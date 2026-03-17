import { useState } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { TableSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import Modal from '../../components/Modal';
import { services as initialServices, categories } from '../../data/services';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServiceManager() {
  const loading = useLoadingDelay();
  const [data, setData] = useState(initialServices.map(s => ({ ...s, active: true })));
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Aadhaar', icon: '📄', price: '', description: '' });

  const openAdd = () => {
    setForm({ name: '', category: 'Aadhaar', icon: '📄', price: '', description: '' });
    setModal('add');
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, icon: item.icon, price: item.price, description: item.description });
    setModal('edit');
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error('Name and Price are required');
      return;
    }
    if (modal === 'add') {
      const newItem = {
        ...form,
        id: Math.max(...data.map(d => d.id)) + 1,
        price: Number(form.price),
        documents: [],
        turnaround: '7-15 days',
        badge: 'New',
        active: true,
      };
      setData([...data, newItem]);
      toast.success('Service added');
    } else {
      setData(data.map(d => d.id === editItem.id ? { ...d, ...form, price: Number(form.price) } : d));
      toast.success('Service updated');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      setData(data.filter(d => d.id !== id));
      toast.success('Service deleted');
    }
  };

  const toggleActive = (id) => {
    setData(data.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  if (loading) return <TableSkeleton cols={6} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{data.length} services</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.image ? (
                        <img src={s.image} alt={s.name} className="w-10 h-10 rounded-sm object-cover bg-gray-50" />
                      ) : (
                        <span className="text-xl">{s.icon}</span>
                      )}
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.category}</td>
                  <td className="px-4 py-3 font-medium">{s.price === 0 ? 'Free' : `₹${s.price}`}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(s.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${s.active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${s.active ? 'translate-x-4.5' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-blue-500" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Service' : 'Edit Service'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm">
                  {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
