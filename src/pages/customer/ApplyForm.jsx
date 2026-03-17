import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { services } from '../../data/services';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplyForm() {
  const { serviceId } = useParams();
  const loading = useLoadingDelay();
  const service = services.find(s => s.id === Number(serviceId));

  const [form, setForm] = useState({ name: '', mobile: '', aadhaar: '', dob: '', address: '', city: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [appId] = useState(`APP${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-6"><PageSkeleton /></div>;
  if (!service) return <div className="text-center py-12 text-gray-500">Service not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = 'Required';
    if (!form.mobile) errs.mobile = 'Required';
    if (!form.dob) errs.dob = 'Required';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    toast.success(`Application submitted! ID: ${appId}`);
    setSubmitted(true);
  };

  const update = (key, val) => {
    setForm({ ...form, [key]: val });
    setErrors({ ...errors, [key]: undefined });
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-4">Your application has been received and is being processed.</p>
          <div className="bg-primary-50 rounded-sm p-4 mb-6">
            <p className="text-sm text-gray-500">Application ID</p>
            <p className="text-2xl font-bold text-primary-800">{appId}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to={`/track`} className="bg-primary-800 text-white py-2.5 rounded-sm text-sm font-medium hover:bg-primary-900">
              Track Application
            </Link>
            <Link to="/services" className="border border-gray-300 py-2.5 rounded-sm text-sm font-medium hover:bg-gray-50">
              Browse More Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = (key) => `w-full border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors[key] ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Link to={`/services/${service.id}`} className="flex items-center gap-1 text-sm text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to {service.name}
      </Link>

      {/* Service Info */}
      <div className="bg-primary-50 rounded-md p-4 flex items-center gap-3">
        <span className="text-3xl">{service.icon}</span>
        <div>
          <h2 className="font-semibold text-gray-900">{service.name}</h2>
          <p className="text-sm text-gray-500">₹{service.price} • {service.turnaround}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Applicant Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} className={inputCls('name')} placeholder="Enter full name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input value={form.mobile} onChange={e => update('mobile', e.target.value)} className={inputCls('mobile')} placeholder="10-digit mobile" />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number (optional)</label>
            <input value={form.aadhaar} onChange={e => update('aadhaar', e.target.value)} className={inputCls('aadhaar')} placeholder="12-digit Aadhaar" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className={inputCls('dob')} />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input value={form.city} onChange={e => update('city', e.target.value)} className={inputCls('city')} placeholder="City name" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <textarea value={form.address} onChange={e => update('address', e.target.value)} rows={3} className={inputCls('address')} placeholder="Full address" />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Document Upload */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Documents</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB each)</p>
            <input type="file" multiple className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="mt-3 inline-block bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-sm text-sm cursor-pointer">
              Choose Files
            </label>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Required: {service.documents.join(', ')}
          </div>
        </div>

        <button type="submit" className="w-full bg-primary-800 hover:bg-primary-900 text-white py-3 rounded-sm text-sm font-semibold transition-colors">
          Submit Application
        </button>
      </form>
    </div>
  );
}
