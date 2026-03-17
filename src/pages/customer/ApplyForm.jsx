import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import { services } from '../../data/services';
import { ArrowLeft, Upload, CheckCircle, CreditCard, Smartphone, Landmark, Wallet, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, description: 'All major banks supported' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Paytm, Amazon Pay, Mobikwik' },
];

export default function ApplyForm() {
  const { serviceId } = useParams();
  const loading = useLoadingDelay();
  const service = services.find(s => s.id === Number(serviceId));

  const [form, setForm] = useState({ name: '', mobile: '', aadhaar: '', dob: '', address: '', city: '' });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'submitted'
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [appId] = useState(`APP${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-6"><PageSkeleton /></div>;
  if (!service) return <div className="text-center py-12 text-gray-500">Service not found</div>;

  const handleDetailsSubmit = (e) => {
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
    setStep('payment');
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      toast.success(`Payment of ₹${service.price} successful! Application ID: ${appId}`);
      setStep('submitted');
    }, 2000);
  };

  const update = (key, val) => {
    setForm({ ...form, [key]: val });
    setErrors({ ...errors, [key]: undefined });
  };

  // Step 3: Success
  if (step === 'submitted') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-4">Your payment was successful and application is being processed.</p>
          <div className="bg-primary-50 rounded-sm p-4 mb-6">
            <p className="text-sm text-gray-500">Application ID</p>
            <p className="text-2xl font-bold text-primary-800">{appId}</p>
          </div>
          <div className="bg-green-50 rounded-sm p-4 mb-6">
            <p className="text-sm text-gray-500">Amount Paid</p>
            <p className="text-xl font-bold text-green-700">₹{service.price}</p>
            <p className="text-xs text-gray-400 mt-1">via {paymentMethods.find(m => m.id === selectedPayment)?.label}</p>
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

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className={`flex items-center gap-1.5 text-sm font-medium ${step === 'details' ? 'text-primary-800' : 'text-green-600'}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === 'details' ? 'bg-primary-800' : 'bg-green-500'}`}>
          {step === 'details' ? '1' : '✓'}
        </span>
        Details
      </div>
      <div className="w-8 h-0.5 bg-gray-300" />
      <div className={`flex items-center gap-1.5 text-sm font-medium ${step === 'payment' ? 'text-primary-800' : 'text-gray-400'}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === 'payment' ? 'bg-primary-800' : 'bg-gray-300'}`}>
          2
        </span>
        Payment
      </div>
    </div>
  );

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

      <StepIndicator />

      {/* Step 1: Applicant Details */}
      {step === 'details' && (
        <form onSubmit={handleDetailsSubmit} className="bg-white rounded-md p-6 shadow-sm border border-gray-100 space-y-4">
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

          <button type="submit" className="w-full bg-primary-800 hover:bg-primary-900 text-white py-3 rounded-sm text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            Proceed to Payment <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && (
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Applicant</span>
                <span className="font-medium text-gray-900">{form.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mobile</span>
                <span className="font-medium text-gray-900">{form.mobile}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-gray-900">₹{service.price}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-primary-800">₹{service.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-md border-2 transition-all text-left ${
                      selectedPayment === method.id
                        ? 'border-primary-800 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedPayment === method.id ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id ? 'border-primary-800' : 'border-gray-300'
                    }`}>
                      {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-800" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="flex-1 border border-gray-300 py-3 rounded-sm text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="flex-[2] bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white py-3 rounded-sm text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {paymentProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay ₹{service.price}</>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Secure Payment</span>
          </div>
        </div>
      )}
    </div>
  );
}
