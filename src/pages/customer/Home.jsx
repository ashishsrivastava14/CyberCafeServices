import { Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import ServiceCard from '../../components/ServiceCard';
import StatusPill from '../../components/StatusPill';
import { services } from '../../data/services';
import { applications } from '../../data/applications';
import { Phone, MessageCircle, Mail, Star, FileCheck, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerHome() {
  const loading = useLoadingDelay();
  const navigate = useNavigate();

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><PageSkeleton /></div>;

  const popularServices = services.filter(s => s.badge === 'Popular' || s.badge === 'Hot').slice(0, 6);
  const recentApps = applications.slice(-3).reverse();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Welcome to <span className="text-accent-400">SuvidhaHub</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Your trusted partner for all government services — Aadhaar, PAN, Driving License, Passport, and 30+ more services at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-sm text-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
              Browse Services <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/track" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-3 rounded-sm text-lg font-semibold transition-colors border border-white/20">
              Track Application
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Services', value: '30+', icon: '🏪' },
            { label: 'Applications Done', value: '5000+', icon: '📋' },
            { label: 'Avg Turnaround', value: '7 Days', icon: '⏱️' },
            { label: 'Customer Rating', value: '4.8 ★', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-md p-4 shadow-md text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-1 text-xl font-bold text-primary-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
          <Link to="/services" className="text-sm text-primary-800 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularServices.map(s => (
            <ServiceCard key={s.id} {...s} onClick={() => navigate(`/services/${s.id}`)} />
          ))}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          {recentApps.map(app => (
            <div key={app.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{app.service_name}</p>
                <p className="text-xs text-gray-500">{app.id} • {app.submitted_date}</p>
              </div>
              <StatusPill status={app.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="tel:+919876543210" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <Phone className="w-8 h-8 text-primary-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">WhatsApp</h3>
              <p className="text-sm text-gray-500 mt-1">Quick support on chat</p>
            </a>
            <a href="mailto:help@suvidhahub.in" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-accent-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-500 mt-1">help@suvidhahub.in</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
