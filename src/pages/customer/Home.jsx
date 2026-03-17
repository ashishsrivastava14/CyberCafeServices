import { Link } from 'react-router-dom';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';
import { PageSkeleton } from '../../components/Skeleton';
import ServiceCard from '../../components/ServiceCard';
import StatusPill from '../../components/StatusPill';
import { services } from '../../data/services';
import { applications } from '../../data/applications';
import { Phone, MessageCircle, Mail, Star, FileCheck, Clock, ArrowRight, ChevronLeft, ChevronRight, Search, Upload, CheckCircle, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    title: 'Your Digital',
    highlight: 'Seva Partner',
    subtitle: 'for all services',
    description: 'Discover hassle-free government services at your doorstep!',
  },
  {
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80',
    title: 'Quick &',
    highlight: 'Reliable',
    subtitle: 'documents',
    description: 'Aadhaar, PAN, Passport & 30+ services with fast turnaround.',
  },
  {
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=80',
    title: 'Trusted by',
    highlight: '5000+',
    subtitle: 'customers',
    description: 'Join thousands who rely on SuvidhaHub for their document needs.',
  },
];

export default function CustomerHome() {
  const loading = useLoadingDelay();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><PageSkeleton /></div>;

  const popularServices = services.filter(s => s.badge === 'Popular' || s.badge === 'Hot').slice(0, 6);
  const recentApps = applications.slice(-3).reverse();
  const serviceCategories = [...new Set(services.map(s => s.category))].slice(0, 4);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[500px] md:h-[560px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/60 to-transparent" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              <span className="bg-primary-900/50 px-2 inline-block">{heroSlides[currentSlide].title}</span>
              <br />
              <span className="bg-accent-500/90 text-white px-2 inline-block mt-2">{heroSlides[currentSlide].highlight}</span>
              <br />
              <span className="bg-primary-900/50 px-2 inline-block mt-2">{heroSlides[currentSlide].subtitle}</span>
            </h1>
            <p className="mt-6 text-lg text-cream-100 font-medium">
              {heroSlides[currentSlide].description}
            </p>
            <Link
              to="/services"
              className="mt-8 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-3.5 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Explore <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-accent-500 w-8' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Search/Service Bar - Inspired by the image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 translate-y-1/2">
          <div className="bg-white rounded-md shadow-xl border border-cream-200 flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-cream-200">
            <div className="flex-1 px-6 py-4">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">Service</p>
              <p className="text-sm text-primary-500 mt-1">Aadhaar, PAN, License...</p>
            </div>
            <div className="flex-1 px-6 py-4">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">Category</p>
              <p className="text-sm text-primary-500 mt-1">{serviceCategories.join(', ')}</p>
            </div>
            <div className="flex-1 px-6 py-4">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">Documents</p>
              <p className="text-sm text-primary-500 mt-1">30+ services available</p>
            </div>
            <div className="px-6 py-4 flex items-center">
              <Link
                to="/services"
                className="bg-primary-800 hover:bg-primary-900 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors whitespace-nowrap"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 mt-16 md:mt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Services', value: '30+', icon: '🏪' },
            { label: 'Applications Done', value: '5000+', icon: '📋' },
            { label: 'Avg Turnaround', value: '7 Days', icon: '⏱️' },
            { label: 'Customer Rating', value: '4.8 ★', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-md p-4 shadow-md text-center border border-cream-200">
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-1 text-xl font-bold text-primary-800">{stat.value}</p>
              <p className="text-xs text-primary-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 text-center">How It Works</h2>
          <p className="text-primary-500 text-center mt-2 mb-8">Get your documents done in 4 simple steps</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: 'Choose Service', desc: 'Browse 30+ government & document services' },
              { icon: Upload, title: 'Upload Documents', desc: 'Submit required documents securely online' },
              { icon: Clock, title: 'We Process', desc: 'Our experts handle the complete process' },
              { icon: CheckCircle, title: 'Get Delivered', desc: 'Receive your documents at your doorstep' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-accent-500 mb-1">Step {i + 1}</div>
                <h3 className="font-semibold text-primary-900 text-sm">{step.title}</h3>
                <p className="text-xs text-primary-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900">Popular Services</h2>
          <Link to="/services" className="text-sm text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularServices.map(s => (
            <ServiceCard key={s.id} {...s} onClick={() => navigate(`/services/${s.id}`)} />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="bg-cream-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-2">Browse by Category</h2>
          <p className="text-primary-500 text-center mb-8">Find the right service for your needs</p>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {[
              { name: 'Aadhaar', img: '/images/services/aadhaar-new.svg' },
              { name: 'PAN', img: '/images/services/pan-new.svg' },
              { name: 'License', img: '/images/services/permanent-license.svg' },
              { name: 'Passport', img: '/images/services/passport-new.svg' },
              { name: 'Voter ID', img: '/images/services/voter-id-new.svg' },
              { name: 'Ration Card', img: '/images/services/ration-card-new.svg' },
              { name: 'Certificates', img: '/images/services/income-certificate.svg' },
            ].map((cat, i) => (
              <Link
                key={i}
                to="/services"
                className="bg-white rounded-md p-4 text-center shadow-sm border border-cream-200 hover:shadow-md hover:border-accent-300 transition-all group"
              >
                <img src={cat.img} alt={cat.name} className="w-12 h-12 mx-auto mb-2 object-contain" />
                <p className="text-sm font-semibold text-primary-800 group-hover:text-accent-600 transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Services */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900">All Services</h2>
          <Link to="/services" className="text-sm text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.slice(0, 12).map(s => (
            <ServiceCard key={s.id} {...s} onClick={() => navigate(`/services/${s.id}`)} />
          ))}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Recent Applications</h2>
        <div className="bg-white rounded-md shadow-sm border border-cream-200 overflow-hidden">
          {recentApps.map(app => (
            <div key={app.id} className="flex items-center justify-between px-5 py-4 border-b border-cream-200 last:border-0 hover:bg-cream-50">
              <div>
                <p className="font-medium text-primary-900">{app.service_name}</p>
                <p className="text-xs text-primary-500">{app.id} • {app.submitted_date}</p>
              </div>
              <StatusPill status={app.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-primary-900 text-center mb-2">What Our Customers Say</h2>
        <p className="text-primary-500 text-center mb-8">Trusted by thousands across the country</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Rajesh Kumar', service: 'PAN Card', text: 'Got my PAN card in just 10 days. Very professional and hassle-free service. Highly recommended!', rating: 5 },
            { name: 'Priya Sharma', service: 'Aadhaar Update', text: 'Updated my Aadhaar address quickly. The team guided me through every step. Excellent support!', rating: 5 },
            { name: 'Amit Verma', service: 'Driving License', text: 'Applied for my permanent license through SuvidhaHub. Smooth process and got it within a month.', rating: 4 },
          ].map((review, i) => (
            <div key={i} className="bg-white rounded-md p-6 shadow-sm border border-cream-200">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-cream-300'}`} />
                ))}
              </div>
              <p className="text-sm text-primary-600 leading-relaxed">"{review.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-800 text-white flex items-center justify-center text-sm font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{review.name}</p>
                  <p className="text-xs text-primary-500">{review.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-cream-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 text-center mb-8">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="tel:+919876543210" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow border border-cream-200">
              <Phone className="w-8 h-8 text-primary-700 mx-auto mb-3" />
              <h3 className="font-semibold text-primary-900">Call Us</h3>
              <p className="text-sm text-primary-500 mt-1">+91 98765 43210</p>
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow border border-cream-200">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-primary-900">WhatsApp</h3>
              <p className="text-sm text-primary-500 mt-1">Quick support on chat</p>
            </a>
            <a href="mailto:help@suvidhahub.in" className="bg-white rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow border border-cream-200">
              <Mail className="w-8 h-8 text-accent-500 mx-auto mb-3" />
              <h3 className="font-semibold text-primary-900">Email</h3>
              <p className="text-sm text-primary-500 mt-1">help@suvidhahub.in</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
