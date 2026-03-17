import { useState } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import StatusPill from '../../components/StatusPill';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import { applications } from '../../data/applications';
import { Search, FileText, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const timelineSteps = [
  { label: 'Submitted', icon: FileText, desc: 'Application received' },
  { label: 'Under Review', icon: Clock, desc: 'Documents being verified' },
  { label: 'Processing', icon: AlertCircle, desc: 'Application in process' },
  { label: 'Completed', icon: CheckCircle, desc: 'Service delivered' },
];

export default function TrackApplication() {
  const loading = useLoadingDelay();
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-6"><PageSkeleton /></div>;

  const results = searched && search
    ? applications.filter(a =>
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.customer_name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  const statusIndex = { Pending: 0, Processing: 2, Completed: 3, Rejected: 3 };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Application</h1>
        <p className="text-gray-500">Enter your Application ID to check the status</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <SearchBar
            placeholder="Enter Application ID (e.g., APP001)"
            value={search}
            onChange={(v) => { setSearch(v); setSearched(false); }}
          />
        </div>
        <button type="submit" className="bg-primary-800 text-white px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-primary-900">
          Search
        </button>
      </form>

      {searched && search && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-md border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No application found</p>
              <p className="text-sm text-gray-400 mt-1">Check the Application ID and try again</p>
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">App ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(app => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-primary-800">{app.id}</td>
                      <td className="px-4 py-3">{app.service_name}</td>
                      <td className="px-4 py-3 text-gray-500">{app.submitted_date}</td>
                      <td className="px-4 py-3"><StatusPill status={app.status} /></td>
                      <td className="px-4 py-3 font-medium">₹{app.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Timeline Modal */}
      {selectedApp && (
        <Modal title={`Application ${selectedApp.id}`} onClose={() => setSelectedApp(null)} size="md">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Service:</span> <p className="font-medium">{selectedApp.service_name}</p></div>
              <div><span className="text-gray-500">Customer:</span> <p className="font-medium">{selectedApp.customer_name}</p></div>
              <div><span className="text-gray-500">Date:</span> <p className="font-medium">{selectedApp.submitted_date}</p></div>
              <div><span className="text-gray-500">Amount:</span> <p className="font-medium">₹{selectedApp.amount}</p></div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Progress Timeline</h4>
              <div className="space-y-6">
                {timelineSteps.map((step, i) => {
                  const activeStep = statusIndex[selectedApp.status] ?? 0;
                  const isActive = i <= activeStep;
                  const isRejected = selectedApp.status === 'Rejected' && i === 3;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isRejected ? 'bg-red-500 text-white' :
                          isActive ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isRejected ? <XCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${isActive ? 'bg-primary-800' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {isRejected ? 'Rejected' : step.label}
                        </p>
                        <p className="text-xs text-gray-500">{isRejected ? 'Application was rejected' : step.desc}</p>
                      </div>
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
