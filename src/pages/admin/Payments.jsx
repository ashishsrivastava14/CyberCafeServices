import { useState } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { TableSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';
import StatusPill from '../../components/StatusPill';
import SearchBar from '../../components/SearchBar';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import { payments as initialPayments } from '../../data/payments';
import { IndianRupee, Banknote, Smartphone, Globe, FileText } from 'lucide-react';

const methods = ['All', 'Cash', 'UPI', 'Online'];

export default function Payments() {
  const loading = useLoadingDelay();
  const [data] = useState(initialPayments);
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [invoiceModal, setInvoiceModal] = useState(null);

  const filtered = data.filter(p => {
    const matchMethod = methodFilter === 'All' || p.method === methodFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchMethod && matchStatus;
  });

  const paidPayments = data.filter(p => p.status === 'Paid');
  const totalCollected = paidPayments.reduce((s, p) => s + p.amount, 0);
  const cashTotal = paidPayments.filter(p => p.method === 'Cash').reduce((s, p) => s + p.amount, 0);
  const upiTotal = paidPayments.filter(p => p.method === 'UPI').reduce((s, p) => s + p.amount, 0);
  const onlineTotal = paidPayments.filter(p => p.method === 'Online').reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: 'invoice_no', label: 'Invoice' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'service_name', label: 'Service' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
    { key: 'method', label: 'Method', render: (r) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
        r.method === 'Cash' ? 'bg-green-50 text-green-700' :
        r.method === 'UPI' ? 'bg-purple-50 text-purple-700' :
        'bg-blue-50 text-blue-700'
      }`}>{r.method}</span>
    )},
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'actions', label: '', sortable: false, render: (r) => (
      <button onClick={() => setInvoiceModal(r)} className="p-1.5 rounded hover:bg-gray-100" title="Generate Invoice">
        <FileText className="w-4 h-4 text-gray-500" />
      </button>
    )},
  ];

  if (loading) return <TableSkeleton cols={7} />;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Collected" value={`₹${totalCollected.toLocaleString()}`} icon={IndianRupee} />
        <StatCard label="Cash" value={`₹${cashTotal.toLocaleString()}`} icon={Banknote} />
        <StatCard label="UPI" value={`₹${upiTotal.toLocaleString()}`} icon={Smartphone} />
        <StatCard label="Online" value={`₹${onlineTotal.toLocaleString()}`} icon={Globe} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1">
          {methods.map(m => (
            <button key={m} onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 text-sm rounded-sm ${methodFilter === m ? 'bg-primary-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {m}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm">
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Refunded</option>
        </select>
      </div>

      <DataTable columns={columns} rows={filtered} />

      {/* Invoice Modal */}
      {invoiceModal && (
        <Modal title="Invoice" onClose={() => setInvoiceModal(null)} size="md">
          <div className="space-y-4 print:p-0">
            <div className="text-center border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-primary-800">SuvidhaHub</h2>
              <p className="text-sm text-gray-500">Tax Invoice</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invoice No</p>
                <p className="font-semibold">{invoiceModal.invoice_no}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{invoiceModal.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-semibold">{invoiceModal.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Application ID</p>
                <p className="font-semibold">{invoiceModal.application_id}</p>
              </div>
            </div>
            <table className="w-full text-sm border border-gray-200 mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2">{invoiceModal.service_name}</td>
                  <td className="px-4 py-2 text-right">₹{invoiceModal.amount}</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2 text-right">₹{invoiceModal.amount}</td>
                </tr>
              </tfoot>
            </table>
            <div className="text-sm text-gray-500">
              <p>Payment Method: {invoiceModal.method}</p>
              <p>Status: {invoiceModal.status}</p>
            </div>
            <button onClick={() => window.print()} className="w-full bg-primary-800 text-white py-2 rounded-sm text-sm font-medium hover:bg-primary-900">
              Print Invoice
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
