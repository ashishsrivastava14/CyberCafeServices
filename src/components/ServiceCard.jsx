const badgeColors = {
  Hot: 'bg-red-500',
  New: 'bg-green-500',
  Popular: 'bg-accent-500',
};

export default function ServiceCard({ icon, image, name, category, price, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all text-left w-full group overflow-hidden"
    >
      {badge && (
        <span className={`absolute top-3 right-3 z-10 ${badgeColors[badge] || 'bg-gray-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
          {badge}
        </span>
      )}
      {image ? (
        <div className="w-full h-32 bg-gray-50">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-50 flex items-center justify-center text-4xl">{icon}</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-800 transition-colors">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
        <p className="mt-2 text-primary-800 font-bold">
          {price === 0 ? 'Free' : `₹${price}`}
        </p>
      </div>
    </button>
  );
}
