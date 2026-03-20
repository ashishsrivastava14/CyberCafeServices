import { useState, useMemo } from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';
import StatusPill from '../../components/StatusPill';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import { wallets, walletTransactions } from '../../data/wallets';
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, Ban, IndianRupee,
  TrendingUp, Search, Eye, Send, Download, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const typeIcons = {
  Credit: <ArrowDownCircle className="w-4 h-4 text-green-600" />,
  Withdrawal: <ArrowUpCircle className="w-4 h-4 text-red-500" />,
  Refund: <ArrowUpCircle className="w-4 h-4 text-orange-500" />,
  Hold: <Ban className="w-4 h-4 text-amber-500" />,
  Adjustment: <TrendingUp className="w-4 h-4 text-blue-500" />,
};

export default function VendorWallet() {
  const loading = useLoadingDelay();
  const [walletData] = useState(wallets);
  const [transactions, setTransactions] = useState(walletTransactions);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [payoutModal, setPayoutModal] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer');
  const [txDetailModal, setTxDetailModal] = useState(null);

  // Aggregate stats
  const totalBalance = walletData.reduce((s, w) => s + w.balance, 0);
  const totalCredited = walletData.reduce((s, w) => s + w.total_credited, 0);
  const totalWithdrawn = walletData.reduce((s, w) => s + w.total_withdrawn, 0);
  const totalHeld = walletData.reduce((s, w) => s + w.hold_amount, 0);

  // Filter transactions
  const filteredTxns = useMemo(() => {
    let txns = selectedVendor
      ? transactions.filter(t => t.vendor_id === selectedVendor)
      : transactions;
    if (typeFilter !== 'All') txns = txns.filter(t => t.type === typeFilter);
    if (statusFilter !== 'All') txns = txns.filter(t => t.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      txns = txns.filter(t =>
        t.reference.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return txns;
  }, [transactions, selectedVendor, typeFilter, statusFilter, search]);

  const selectedWallet = selectedVendor
    ? walletData.find(w => w.vendor_id === selectedVendor)
    : null;

  const handlePayout = () => {
    const amount = Number(payoutAmount);
    if (!selectedWallet) return;
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (amount < selectedWallet.min_withdrawal) {
      toast.error(`Minimum withdrawal is ₹${selectedWallet.min_withdrawal}`);
      return;
    }
    if (amount > selectedWallet.balance) {
      toast.error('Insufficient balance');
      return;
    }
    if (selectedWallet.status === 'Frozen') {
      toast.error('Wallet is frozen');
      return;
    }
    const newTx = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      vendor_id: selectedVendor,
      type: 'Withdrawal',
      amount,
      balance_after: selectedWallet.balance - amount,
      description: `${payoutMethod} payout initiated`,
      reference: `TXN-W-${String(Math.max(...transactions.map(t => t.id)) + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
    };
    setTransactions([...transactions, newTx]);
    toast.success(`Payout of ₹${amount.toLocaleString()} initiated`);
    setPayoutModal(null);
    setPayoutAmount('');
  };

  const txColumns = [
    {
      key: 'type', label: 'Type', render: (r) => (
        <div className="flex items-center gap-2">
          {typeIcons[r.type]}
          <span className={`text-xs font-semibold ${
            r.type === 'Credit' ? 'text-green-700' :
            r.type === 'Refund' ? 'text-orange-700' :
            r.type === 'Hold' ? 'text-amber-700' :
            'text-red-600'
          }`}>{r.type}</span>
        </div>
      )
    },
    { key: 'reference', label: 'Reference' },
    { key: 'description', label: 'Description' },
    {
      key: 'amount', label: 'Amount', render: (r) => (
        <span className={`font-semibold ${r.type === 'Credit' ? 'text-green-700' : 'text-red-600'}`}>
          {r.type === 'Credit' ? '+' : '-'}₹{r.amount.toLocaleString()}
        </span>
      )
    },
    {
      key: 'balance_after', label: 'Balance', render: (r) =>
        `₹${r.balance_after.toLocaleString()}`
    },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions', label: '', sortable: false, render: (r) => (
        <button onClick={() => setTxDetailModal(r)} className="p-1.5 rounded hover:bg-gray-100" title="View Details">
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
      )
    },
  ];

  const walletColumns = [
    { key: 'vendor_name', label: 'Retailer' },
    {
      key: 'balance', label: 'Balance', render: (r) => (
        <span className="font-semibold text-primary-800">₹{r.balance.toLocaleString()}</span>
      )
    },
    {
      key: 'total_credited', label: 'Total Credited', render: (r) =>
        <span className="text-green-700">₹{r.total_credited.toLocaleString()}</span>
    },
    {
      key: 'total_withdrawn', label: 'Total Withdrawn', render: (r) =>
        <span className="text-red-600">₹{r.total_withdrawn.toLocaleString()}</span>
    },
    {
      key: 'hold_amount', label: 'On Hold', render: (r) =>
        r.hold_amount > 0
          ? <span className="text-amber-600 font-medium">₹{r.hold_amount.toLocaleString()}</span>
          : <span className="text-gray-400">—</span>
    },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions', label: 'Actions', sortable: false, render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => { setSelectedVendor(r.vendor_id); setTypeFilter('All'); setStatusFilter('All'); setSearch(''); }}
            className="p-1.5 rounded hover:bg-gray-100" title="View Transactions">
            <Eye className="w-4 h-4 text-primary-800" />
          </button>
          <button onClick={() => { setDetailModal(r); }}
            className="p-1.5 rounded hover:bg-gray-100" title="Wallet Details">
            <Wallet className="w-4 h-4 text-blue-600" />
          </button>
          <button onClick={() => { setSelectedVendor(r.vendor_id); setPayoutModal(r); setPayoutAmount(''); setPayoutMethod('Bank Transfer'); }}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40" title="Initiate Payout" disabled={r.status === 'Frozen'}>
            <Send className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )
    },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Balance" value={`₹${totalBalance.toLocaleString()}`} icon={Wallet} />
        <StatCard label="Total Credited" value={`₹${totalCredited.toLocaleString()}`} icon={ArrowDownCircle} />
        <StatCard label="Total Withdrawn" value={`₹${totalWithdrawn.toLocaleString()}`} icon={ArrowUpCircle} />
        <StatCard label="On Hold" value={`₹${totalHeld.toLocaleString()}`} icon={Ban} />
      </div>

      {/* Vendor Selector or back button */}
      {selectedVendor ? (
        <>
          {/* Selected vendor wallet header */}
          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <button onClick={() => setSelectedVendor(null)} className="text-sm text-primary-800 hover:underline mb-2 inline-block">
                  ← Back to all wallets
                </button>
                <h3 className="text-lg font-bold text-gray-900">{selectedWallet?.vendor_name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <StatusPill status={selectedWallet?.status} />
                  <span className="text-xs text-gray-500">
                    {selectedWallet?.bank_name} • A/c {selectedWallet?.account_no}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-3xl font-bold text-primary-800">₹{selectedWallet?.balance.toLocaleString()}</p>
                {selectedWallet?.hold_amount > 0 && (
                  <p className="text-xs text-amber-600">₹{selectedWallet.hold_amount.toLocaleString()} on hold</p>
                )}
              </div>
            </div>
            {/* Quick actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => { setPayoutModal(selectedWallet); setPayoutAmount(''); setPayoutMethod('Bank Transfer'); }}
                disabled={selectedWallet?.status === 'Frozen'}
                className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary-900 disabled:opacity-40 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" /> Initiate Payout
              </button>
              <button onClick={() => setDetailModal(selectedWallet)}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-50">
                <Wallet className="w-4 h-4" /> Wallet Details
              </button>
            </div>
          </div>

          {/* Transaction Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search reference or description..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-1">
              {['All', 'Credit', 'Withdrawal', 'Refund', 'Hold'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 text-sm rounded-sm ${typeFilter === t ? 'bg-primary-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm">
              <option>All</option>
              <option>Completed</option>
              <option>Processing</option>
              <option>Failed</option>
            </select>
          </div>

          {/* Transaction summary for selected vendor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Credits', value: transactions.filter(t => t.vendor_id === selectedVendor && t.type === 'Credit').reduce((s, t) => s + t.amount, 0), color: 'text-green-700' },
              { label: 'Withdrawals', value: transactions.filter(t => t.vendor_id === selectedVendor && t.type === 'Withdrawal').reduce((s, t) => s + t.amount, 0), color: 'text-red-600' },
              { label: 'Refunds', value: transactions.filter(t => t.vendor_id === selectedVendor && t.type === 'Refund').reduce((s, t) => s + t.amount, 0), color: 'text-orange-600' },
              { label: 'Transactions', value: transactions.filter(t => t.vendor_id === selectedVendor).length, color: 'text-gray-800', isCurrency: false },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-md p-3 border border-gray-100 text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>
                  {s.isCurrency === false ? s.value : `₹${s.value.toLocaleString()}`}
                </p>
              </div>
            ))}
          </div>

          {/* Transaction Table */}
          <DataTable columns={txColumns} rows={filteredTxns} pageSize={10} />
        </>
      ) : (
        <>
          {/* All Wallets Table */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{walletData.length} retailer wallets</p>
          </div>
          <DataTable columns={walletColumns} rows={walletData} pageSize={10} />
        </>
      )}

      {/* Wallet Detail Modal */}
      {detailModal && (
        <Modal title="Wallet Details" onClose={() => setDetailModal(null)}>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-5 text-white">
              <p className="text-sm text-primary-200">Available Balance</p>
              <p className="text-3xl font-bold mt-1">₹{detailModal.balance.toLocaleString()}</p>
              {detailModal.hold_amount > 0 && (
                <p className="text-sm text-amber-300 mt-1">₹{detailModal.hold_amount.toLocaleString()} on hold</p>
              )}
              <p className="text-xs text-primary-300 mt-3">{detailModal.vendor_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 rounded-md p-3">
                <p className="text-green-600 text-xs">Total Credited</p>
                <p className="text-lg font-bold text-green-700">₹{detailModal.total_credited.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-md p-3">
                <p className="text-red-500 text-xs">Total Withdrawn</p>
                <p className="text-lg font-bold text-red-600">₹{detailModal.total_withdrawn.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold text-gray-700">Bank Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Bank</p>
                  <p className="font-medium">{detailModal.bank_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account No</p>
                  <p className="font-medium">{detailModal.account_no}</p>
                </div>
                <div>
                  <p className="text-gray-500">IFSC</p>
                  <p className="font-medium">{detailModal.ifsc}</p>
                </div>
                <div>
                  <p className="text-gray-500">UPI ID</p>
                  <p className="font-medium">{detailModal.upi_id}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-gray-100">
              <div>
                <p className="text-gray-500">Min Withdrawal</p>
                <p className="font-medium">₹{detailModal.min_withdrawal}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusPill status={detailModal.status} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Payout Modal */}
      {payoutModal && (
        <Modal title="Initiate Payout" onClose={() => setPayoutModal(null)} size="sm">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-500">Retailer</p>
              <p className="font-semibold">{payoutModal.vendor_name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">Available Balance</span>
                <span className="text-lg font-bold text-primary-800">₹{payoutModal.balance.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-gray-400 font-normal">Min: ₹{payoutModal.min_withdrawal}</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  max={payoutModal.balance}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
              <select value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm">
                <option>Bank Transfer</option>
                <option>UPI</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-sm">
              <p className="text-gray-500">Payout to</p>
              {payoutMethod === 'Bank Transfer' ? (
                <p className="font-medium">{payoutModal.bank_name} — {payoutModal.account_no} ({payoutModal.ifsc})</p>
              ) : (
                <p className="font-medium">{payoutModal.upi_id}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handlePayout}
                className="flex-1 bg-primary-800 text-white py-2.5 rounded-sm text-sm font-medium hover:bg-primary-900 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Process Payout
              </button>
              <button onClick={() => setPayoutModal(null)}
                className="flex-1 border border-gray-300 py-2.5 rounded-sm text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Transaction Detail Modal */}
      {txDetailModal && (
        <Modal title="Transaction Details" onClose={() => setTxDetailModal(null)} size="sm">
          <div className="space-y-4">
            <div className={`rounded-md p-4 ${
              txDetailModal.type === 'Credit' ? 'bg-green-50' :
              txDetailModal.type === 'Withdrawal' ? 'bg-red-50' :
              txDetailModal.type === 'Hold' ? 'bg-amber-50' : 'bg-orange-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {typeIcons[txDetailModal.type]}
                <span className="font-semibold">{txDetailModal.type}</span>
              </div>
              <p className={`text-2xl font-bold ${txDetailModal.type === 'Credit' ? 'text-green-700' : 'text-red-600'}`}>
                {txDetailModal.type === 'Credit' ? '+' : '-'}₹{txDetailModal.amount.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Reference</p>
                <p className="font-medium font-mono text-xs">{txDetailModal.reference}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{txDetailModal.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusPill status={txDetailModal.status} />
              </div>
              <div>
                <p className="text-gray-500">Balance After</p>
                <p className="font-medium">₹{txDetailModal.balance_after.toLocaleString()}</p>
              </div>
            </div>

            <div className="text-sm border-t border-gray-100 pt-3">
              <p className="text-gray-500">Description</p>
              <p className="font-medium">{txDetailModal.description}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
