import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import { applications } from '../../data/applications';
import { customers } from '../../data/customers';
import { ArrowLeft, FileText, User, Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const timelineSteps = [
  { label: 'Submitted', icon: FileText },
  { label: 'Under Review', icon: Clock },
  { label: 'Processing', icon: AlertCircle },
  { label: 'Completed', icon: CheckCircle },
];

export default function ApplicationDetail() {
  const { id } = useParams();
  const loading = useLoadingDelay();
  const app = applications.find(a => a.id === id);
  const customer = app ? customers.find(c => c.id === app.customer_id) : null;

  const [status, setStatus] = useState(app?.status || 'Pending');
  const [notes, setNotes] = useState(app?.notes || '');

  if (loading) return <PageSkeleton />;
  if (!app) return <div className="text-center py-12 text-gray-500">Application not found</div>;

  const statusIndex = { Pending: 0, Processing: 2, Completed: 3, Rejected: 3 };
  const activeStep = statusIndex[status] ?? 0;

  const handleSave = () => {
    toast.success('Application updated successfully');
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/applications" className="flex items-center gap-1 text-sm text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Card */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{app.id}</h2>
                <p className="text-gray-500">{app.service_name}</p>
              </div>
              <StatusPill status={status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Date:</span> <span className="font-medium">{app.submitted_date}</span></div>
              <div><span className="text-gray-500">Amount:</span> <span className="font-medium">₹{app.amount}</span></div>
              <div><span className="text-gray-500">Agent:</span> <span className="font-medium">{app.agent}</span></div>
              <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{app.customer_name}</span></div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
            <div className="flex gap-3">
              <select value={status} onChange={e => setStatus(e.target.value)} className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
              <button onClick={handleSave} className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Documents</h3>
            <div className="space-y-2">
              {app.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 flex-1">{doc}</span>
                  <button className="text-xs text-primary-800 hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add notes..."
            />
            <button onClick={() => toast.success('Notes saved')} className="mt-2 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-sm font-medium">
              Save Notes
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Mini Card */}
          {customer && (
            <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">Customer</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium">{customer.name}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{customer.phone}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-medium">{customer.email}</span></p>
                <p><span className="text-gray-500">City:</span> <span className="font-medium">{customer.city}</span></p>
              </div>
              <Link to={`/admin/customers/${customer.id}`} className="block mt-3 text-xs text-primary-800 hover:underline">View Full Profile →</Link>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === activeStep;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-2 ring-accent-400' : ''}`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      {isActive && <p className="text-xs text-gray-500">{app.submitted_date}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
