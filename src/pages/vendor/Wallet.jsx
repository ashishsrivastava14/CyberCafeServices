import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { wallets, walletTransactions } from '../../data/wallets';
import { vendors } from '../../data/vendors';
import StatCard from '../../components/StatCard';
import StatusPill from '../../components/StatusPill';
import SearchBar from '../../components/SearchBar';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import Modal from '../../components/Modal';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Ban, IndianRupee, Building2, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const typeTabs = ['All', 'Credit', 'Withdrawal', 'Refund', 'Hold'];

export default function VendorWalletPage() {
  const loading = useLoadingDelay();
  const { user } = useAuth();
  const vendorId = user?.id;

  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');

  const vendor = useMemo(() => vendors.find(v => v.id === vendorId), [vendorId]);
  const wallet = useMemo(() => wallets.find(w => w.vendor_id === vendorId), [vendorId]);
  const transactions = useMemo(() =>
    walletTransactions.filter(t => t.vendor_id === vendorId).sort((a, b) => b.date.localeCompare(a.date)),
    [vendorId]
  );

  const filtered = useMemo(() => {
    let list = transactions;
    if (activeType !== 'All') list = list.filter(t => t.type === activeType);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, activeType, search]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount < (wallet?.min_withdrawal || 500)) {
      toast.error(`Minimum withdrawal amount is ₹${wallet?.min_withdrawal || 500}`);
      return;
    }
    if (amount > (wallet?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    toast.success(`Withdrawal request of ₹${amount} submitted successfully!`);
    setShowWithdraw(false);
    setWithdrawAmount('');
  };

  const typeIcon = {
    Credit: <ArrowDownCircle className="w-4 h-4 text-green-500" />,
    Withdrawal: <ArrowUpCircle className="w-4 h-4 text-red-500" />,
    Refund: <ArrowUpCircle className="w-4 h-4 text-orange-500" />,
    Hold: <Ban className="w-4 h-4 text-blue-500" />,
    Adjustment: <IndianRupee className="w-4 h-4 text-gray-500" />,
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      {/* Wallet Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Balance" value={`₹${wallet?.balance?.toLocaleString() || 0}`} icon={Wallet} />
        <StatCard label="Total Credited" value={`₹${wallet?.total_credited?.toLocaleString() || 0}`} icon={ArrowDownCircle} trend={10} />
        <StatCard label="Total Withdrawn" value={`₹${wallet?.total_withdrawn?.toLocaleString() || 0}`} icon={ArrowUpCircle} />
        <StatCard label="On Hold" value={`₹${wallet?.hold_amount?.toLocaleString() || 0}`} icon={Ban} />
      </div>

      {/* Bank Details & Withdraw */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Bank Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank</span>
              <span className="font-medium">{wallet?.bank_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account</span>
              <span className="font-medium">{wallet?.account_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IFSC</span>
              <span className="font-medium">{wallet?.ifsc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">UPI ID</span>
              <span className="font-medium">{wallet?.upi_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Min Withdrawal</span>
              <span className="font-medium">₹{wallet?.min_withdrawal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Wallet Status</span>
              <StatusPill status={wallet?.status || 'Active'} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-6 text-white flex flex-col justify-between">
          <div>
            <p className="text-primary-300 text-sm">Available Balance</p>
            <p className="text-3xl font-bold mt-1">₹{wallet?.balance?.toLocaleString() || 0}</p>
            <p className="text-primary-300 text-xs mt-2">Commission Rate: {vendor?.commission_rate}%</p>
          </div>
          <button
            onClick={() => setShowWithdraw(true)}
            disabled={wallet?.status === 'Frozen'}
            className="mt-4 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold py-2.5 rounded-sm text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {wallet?.status === 'Frozen' ? 'Wallet Frozen' : 'Request Withdrawal'}
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {typeTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveType(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeType === tab
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search transactions..." />

      {/* Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Balance</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {typeIcon[txn.type]}
                      <span className="font-medium text-gray-700">{txn.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{txn.description}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{txn.reference}</td>
                  <td className="px-4 py-3 text-gray-500">{txn.date}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">₹{txn.balance_after.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={txn.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(txn => (
            <div key={txn.id} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {typeIcon[txn.type]}
                  <span className="text-sm font-medium text-gray-700">{txn.type}</span>
                </div>
                <StatusPill status={txn.status} />
              </div>
              <p className="text-sm text-gray-600">{txn.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{txn.date}</span>
                <span className={`text-sm font-semibold ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <Modal title="Request Withdrawal" onClose={() => setShowWithdraw(false)}>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={wallet?.min_withdrawal || 500}
                max={wallet?.balance || 0}
                placeholder={`Min ₹${wallet?.min_withdrawal || 500}`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-400 mt-1">Available: ₹{wallet?.balance?.toLocaleString() || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bank')}
                  className={`p-3 rounded-sm border text-sm font-medium flex items-center gap-2 justify-center transition-colors ${
                    withdrawMethod === 'bank' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('upi')}
                  className={`p-3 rounded-sm border text-sm font-medium flex items-center gap-2 justify-center transition-colors ${
                    withdrawMethod === 'upi' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> UPI
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-sm p-3 text-sm">
              <p className="text-gray-500">
                {withdrawMethod === 'bank'
                  ? `Transfer to ${wallet?.bank_name} — ${wallet?.account_no}`
                  : `Transfer to UPI — ${wallet?.upi_id}`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-sm text-sm text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-primary-800 hover:bg-primary-900 text-white rounded-sm text-sm font-semibold">
                Submit Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
