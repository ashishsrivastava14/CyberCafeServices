import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import ServiceCard from '../../components/ServiceCard';
import SearchBar from '../../components/SearchBar';
import { services, categories } from '../../data/services';

export default function Services() {
  const loading = useLoadingDelay();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><PageSkeleton /></div>;

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Services</h1>

      <SearchBar placeholder="Search services..." value={search} onChange={setSearch} />

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No services found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(s => (
            <ServiceCard key={s.id} {...s} onClick={() => navigate(`/services/${s.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
