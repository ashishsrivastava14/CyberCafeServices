import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Search, Phone, MessageCircle } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/services', label: 'Services', icon: Grid3X3 },
  { path: '/track', label: 'Track', icon: Search },
];

export default function CustomerLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">SuvidhaHub</h1>
              <p className="text-[10px] text-primary-200 leading-tight">Your Trusted Digital Seva Partner</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === item.path ? 'text-accent-400' : 'text-primary-100 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <Link to="/login" className="bg-accent-500 hover:bg-accent-600 px-4 py-1.5 rounded-sm text-sm font-semibold text-white transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">SuvidhaHub</h3>
              <p className="text-sm">Your one-stop solution for all government services and digital documentation.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/services" className="hover:text-white transition-colors">All Services</Link>
                <Link to="/track" className="hover:text-white transition-colors">Track Application</Link>
                <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Contact</h3>
              <div className="flex flex-col gap-2 text-sm">
                <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> +91 98765 43210</span>
                <span className="flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp Support</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-4 text-center text-xs">
            © 2024 SuvidhaHub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
                pathname === item.path ? 'text-primary-800' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
