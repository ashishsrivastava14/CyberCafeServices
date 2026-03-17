import { useState } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { notifications as initialNotifications } from '../../data/vendors';
import { CheckCheck, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const filterTabs = ['All', 'Unread', 'Applications', 'Payments', 'System'];
const typeMap = { Applications: 'application', Payments: 'payment', System: 'system' };

export default function Notifications() {
  const loading = useLoadingDelay();
  const [data, setData] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const filtered = data.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.type === typeMap[activeTab];
  });

  const markAllRead = () => {
    setData(data.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const toggleRead = (id) => {
    setData(data.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const unreadCount = data.filter(n => !n.read).length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {filterTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-sm whitespace-nowrap ${activeTab === tab ? 'bg-primary-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {tab}
              {tab === 'Unread' && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-primary-800 hover:underline">
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-md p-12 text-center border border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
          </div>
        ) : (
          filtered.map(n => (
            <button
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`w-full text-left bg-white rounded-md p-4 shadow-sm border transition-colors ${
                n.read ? 'border-gray-100' : 'border-primary-200 bg-primary-50/30'
              } hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 bg-primary-800 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
