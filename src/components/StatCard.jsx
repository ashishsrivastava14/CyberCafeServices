import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, direction = 'up', icon: Icon }) {
  return (
    <div className="bg-white rounded-md p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-xs font-medium ${direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {change}%
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 rounded-md">
            <Icon className="w-6 h-6 text-primary-800" />
          </div>
        )}
      </div>
    </div>
  );
}
