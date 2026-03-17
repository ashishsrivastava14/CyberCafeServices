import { vendors } from './vendors';

// Wallet accounts per vendor
export const wallets = vendors.map(v => ({
  vendor_id: v.id,
  vendor_name: v.name,
  balance: Math.round(v.total_earned * v.commission_rate / 100 - v.commission_earned),
  total_credited: Math.round(v.total_earned * v.commission_rate / 100),
  total_withdrawn: v.commission_earned,
  hold_amount: v.status === 'Suspended' ? Math.round(v.total_earned * v.commission_rate / 100 - v.commission_earned) : 0,
  bank_name: ['SBI', 'HDFC Bank', 'ICICI Bank', 'PNB', 'Axis Bank', 'Bank of Baroda', 'Kotak Mahindra', 'Canara Bank'][v.id - 1] || 'SBI',
  account_no: `XXXX${String(4000 + v.id).slice(-4)}`,
  ifsc: `${['SBIN', 'HDFC', 'ICIC', 'PUNB', 'UTIB', 'BARB', 'KKBK', 'CNRB'][v.id - 1] || 'SBIN'}0001234`,
  upi_id: `${v.name.split(' ')[0].toLowerCase()}@upi`,
  min_withdrawal: 500,
  status: v.status === 'Active' ? 'Active' : 'Frozen',
}));

// Transaction types: credit (commission earned), debit (withdrawal), hold, refund, adjustment
export const walletTransactions = [
  // Vendor 1 — Sharma Digital Services
  { id: 1, vendor_id: 1, type: 'Credit', amount: 1200, balance_after: 1200, description: 'Commission — Oct batch 1', reference: 'TXN-W-001', date: '2024-10-05', status: 'Completed' },
  { id: 2, vendor_id: 1, type: 'Credit', amount: 800, balance_after: 2000, description: 'Commission — Oct batch 2', reference: 'TXN-W-002', date: '2024-10-10', status: 'Completed' },
  { id: 3, vendor_id: 1, type: 'Withdrawal', amount: 1500, balance_after: 500, description: 'Bank withdrawal — SBI', reference: 'TXN-W-003', date: '2024-10-12', status: 'Completed' },
  { id: 4, vendor_id: 1, type: 'Credit', amount: 1500, balance_after: 2000, description: 'Commission — Oct batch 3', reference: 'TXN-W-004', date: '2024-10-15', status: 'Completed' },
  { id: 5, vendor_id: 1, type: 'Credit', amount: 1000, balance_after: 3000, description: 'Commission — Oct batch 4', reference: 'TXN-W-005', date: '2024-10-18', status: 'Completed' },
  { id: 6, vendor_id: 1, type: 'Withdrawal', amount: 2000, balance_after: 1000, description: 'Bank withdrawal — SBI', reference: 'TXN-W-006', date: '2024-10-20', status: 'Processing' },
  { id: 7, vendor_id: 1, type: 'Refund', amount: 100, balance_after: 900, description: 'Refund deduction — APP005', reference: 'TXN-W-007', date: '2024-10-20', status: 'Completed' },

  // Vendor 2 — Patel Online Center
  { id: 8, vendor_id: 2, type: 'Credit', amount: 960, balance_after: 960, description: 'Commission — Oct batch 1', reference: 'TXN-W-008', date: '2024-10-06', status: 'Completed' },
  { id: 9, vendor_id: 2, type: 'Credit', amount: 1080, balance_after: 2040, description: 'Commission — Oct batch 2', reference: 'TXN-W-009', date: '2024-10-12', status: 'Completed' },
  { id: 10, vendor_id: 2, type: 'Withdrawal', amount: 1500, balance_after: 540, description: 'UPI withdrawal', reference: 'TXN-W-010', date: '2024-10-14', status: 'Completed' },
  { id: 11, vendor_id: 2, type: 'Credit', amount: 1000, balance_after: 1540, description: 'Commission — Oct batch 3', reference: 'TXN-W-011', date: '2024-10-18', status: 'Completed' },

  // Vendor 3 — Singh E-Seva
  { id: 12, vendor_id: 3, type: 'Credit', amount: 2400, balance_after: 2400, description: 'Commission — Oct batch 1', reference: 'TXN-W-012', date: '2024-10-04', status: 'Completed' },
  { id: 13, vendor_id: 3, type: 'Withdrawal', amount: 2000, balance_after: 400, description: 'Bank withdrawal — ICICI', reference: 'TXN-W-013', date: '2024-10-08', status: 'Completed' },
  { id: 14, vendor_id: 3, type: 'Credit', amount: 2500, balance_after: 2900, description: 'Commission — Oct batch 2', reference: 'TXN-W-014', date: '2024-10-13', status: 'Completed' },
  { id: 15, vendor_id: 3, type: 'Credit', amount: 1800, balance_after: 4700, description: 'Commission — Oct batch 3', reference: 'TXN-W-015', date: '2024-10-17', status: 'Completed' },
  { id: 16, vendor_id: 3, type: 'Withdrawal', amount: 3000, balance_after: 1700, description: 'Bank withdrawal — ICICI', reference: 'TXN-W-016', date: '2024-10-19', status: 'Completed' },

  // Vendor 4 — Kumar Cyber Café
  { id: 17, vendor_id: 4, type: 'Credit', amount: 700, balance_after: 700, description: 'Commission — Oct batch 1', reference: 'TXN-W-017', date: '2024-10-07', status: 'Completed' },
  { id: 18, vendor_id: 4, type: 'Withdrawal', amount: 500, balance_after: 200, description: 'UPI withdrawal', reference: 'TXN-W-018', date: '2024-10-11', status: 'Completed' },
  { id: 19, vendor_id: 4, type: 'Credit', amount: 600, balance_after: 800, description: 'Commission — Oct batch 2', reference: 'TXN-W-019', date: '2024-10-16', status: 'Completed' },

  // Vendor 5 — Gupta Jan Seva Kendra
  { id: 20, vendor_id: 5, type: 'Credit', amount: 1800, balance_after: 1800, description: 'Commission — Oct batch 1', reference: 'TXN-W-020', date: '2024-10-05', status: 'Completed' },
  { id: 21, vendor_id: 5, type: 'Credit', amount: 1500, balance_after: 3300, description: 'Commission — Oct batch 2', reference: 'TXN-W-021', date: '2024-10-11', status: 'Completed' },
  { id: 22, vendor_id: 5, type: 'Withdrawal', amount: 2500, balance_after: 800, description: 'Bank withdrawal — Axis', reference: 'TXN-W-022', date: '2024-10-15', status: 'Completed' },
  { id: 23, vendor_id: 5, type: 'Credit', amount: 1800, balance_after: 2600, description: 'Commission — Oct batch 3', reference: 'TXN-W-023', date: '2024-10-19', status: 'Completed' },
  { id: 24, vendor_id: 5, type: 'Withdrawal', amount: 2000, balance_after: 600, description: 'Bank withdrawal — Axis', reference: 'TXN-W-024', date: '2024-10-20', status: 'Processing' },

  // Vendor 6 — Verma (Suspended) — has hold
  { id: 25, vendor_id: 6, type: 'Credit', amount: 1120, balance_after: 1120, description: 'Commission — Oct batch 1', reference: 'TXN-W-025', date: '2024-10-06', status: 'Completed' },
  { id: 26, vendor_id: 6, type: 'Hold', amount: 1120, balance_after: 0, description: 'Account frozen — under review', reference: 'TXN-W-026', date: '2024-10-10', status: 'Completed' },

  // Vendor 7 — Yadav Online Hub
  { id: 27, vendor_id: 7, type: 'Credit', amount: 1200, balance_after: 1200, description: 'Commission — Oct batch 1', reference: 'TXN-W-027', date: '2024-10-06', status: 'Completed' },
  { id: 28, vendor_id: 7, type: 'Credit', amount: 900, balance_after: 2100, description: 'Commission — Oct batch 2', reference: 'TXN-W-028', date: '2024-10-13', status: 'Completed' },
  { id: 29, vendor_id: 7, type: 'Withdrawal', amount: 1500, balance_after: 600, description: 'UPI withdrawal', reference: 'TXN-W-029', date: '2024-10-16', status: 'Completed' },
  { id: 30, vendor_id: 7, type: 'Credit', amount: 900, balance_after: 1500, description: 'Commission — Oct batch 3', reference: 'TXN-W-030', date: '2024-10-20', status: 'Completed' },

  // Vendor 8 — Mehra Net Café
  { id: 31, vendor_id: 8, type: 'Credit', amount: 600, balance_after: 600, description: 'Commission — Oct batch 1', reference: 'TXN-W-031', date: '2024-10-09', status: 'Completed' },
  { id: 32, vendor_id: 8, type: 'Credit', amount: 400, balance_after: 1000, description: 'Commission — Oct batch 2', reference: 'TXN-W-032', date: '2024-10-17', status: 'Completed' },
  { id: 33, vendor_id: 8, type: 'Withdrawal', amount: 800, balance_after: 200, description: 'Bank withdrawal — Canara', reference: 'TXN-W-033', date: '2024-10-20', status: 'Failed' },
];
