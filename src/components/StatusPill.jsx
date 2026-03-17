const colorMap = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-600',
  Suspended: 'bg-red-100 text-red-800',
  Paid: 'bg-green-100 text-green-800',
  Refunded: 'bg-orange-100 text-orange-800',
  Frozen: 'bg-blue-100 text-blue-800',
  Failed: 'bg-red-100 text-red-800',
  Processing: 'bg-blue-100 text-blue-800',
};

export default function StatusPill({ status }) {
  const classes = colorMap[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}
