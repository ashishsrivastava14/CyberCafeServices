import { useParams, Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { services } from '../../data/services';
import { ArrowLeft, Clock, IndianRupee, FileText, ArrowRight } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const loading = useLoadingDelay();
  const service = services.find(s => s.id === Number(id));

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-6"><PageSkeleton /></div>;
  if (!service) return <div className="text-center py-12 text-gray-500">Service not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Link to="/services" className="flex items-center gap-1 text-sm text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
        {service.image ? (
          <div className="w-full h-48 bg-gray-50 rounded-md overflow-hidden mb-6">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-50 rounded-md flex items-center justify-center mb-6">
            <span className="text-6xl">{service.icon}</span>
          </div>
        )}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{service.category}</p>
          {service.badge && (
            <span className="inline-block mt-2 bg-accent-100 text-accent-800 text-xs font-semibold px-2 py-0.5 rounded-full">{service.badge}</span>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <IndianRupee className="w-4 h-4" /> Price
            </div>
            <p className="text-xl font-bold text-primary-800">{service.price === 0 ? 'Free' : `₹${service.price}`}</p>
          </div>
          <div className="bg-gray-50 rounded-sm p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Clock className="w-4 h-4" /> Turnaround
            </div>
            <p className="text-xl font-bold text-primary-800">{service.turnaround}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Required Documents
          </h3>
          <ul className="space-y-2">
            {service.documents.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-primary-800 rounded-full shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to={`/apply/${service.id}`}
          className="w-full bg-primary-800 hover:bg-primary-900 text-white py-3 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
