import { useParams, Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import DataTable from '../../components/DataTable';
import { customers } from '../../data/customers';
import { applications } from '../../data/applications';
import { ArrowLeft, Phone, Mail, MapPin, Calendar } from 'lucide-react';

export default function CustomerDetail() {
  const { id } = useParams();
  const loading = useLoadingDelay();
  const customer = customers.find(c => c.id === Number(id));
  const customerApps = applications.filter(a => a.customer_id === Number(id));

  if (loading) return <PageSkeleton />;
  if (!customer) return <div className="text-center py-12 text-gray-500">Customer not found</div>;

  const initials = customer.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const columns = [
    { key: 'id', label: 'App ID' },
    { key: 'service_name', label: 'Service' },
    { key: 'submitted_date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
  ];

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="flex items-center gap-1 text-sm text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 bg-primary-800 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <StatusPill status={customer.status} />
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {customer.city}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {customer.joined}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-primary-800">{customer.total_applications}</p>
          <p className="text-sm text-gray-500">Total Applications</p>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-primary-800">₹{customer.total_spent}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-primary-800">{customer.joined}</p>
          <p className="text-sm text-gray-500">Joined Date</p>
        </div>
      </div>

      {/* Applications */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Application History</h3>
        <DataTable columns={columns} rows={customerApps} />
      </div>
    </div>
  );
}
