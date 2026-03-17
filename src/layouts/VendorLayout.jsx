import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Grid3X3, Wallet,
  User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const sidebarItems = [
  { path: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendor/applications', label: 'Applications', icon: FileText },
  { path: '/vendor/services', label: 'Services', icon: Grid3X3 },
  { path: '/vendor/wallet', label: 'Wallet', icon: Wallet },
  { path: '/vendor/profile', label: 'Profile', icon: User },
];

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'V';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-primary-800 text-white fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-primary-700">
          <Link to="/vendor/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <h1 className="text-sm font-bold leading-tight">SuvidhaHub</h1>
              <p className="text-[10px] text-primary-300">Vendor Portal</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith(item.path)
                  ? 'bg-primary-900 text-accent-400 border-r-2 border-accent-400'
                  : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-primary-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-accent-400 text-primary-900 rounded-full flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-primary-300 truncate">{user?.city}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-primary-200 hover:text-white transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-primary-800 text-white flex flex-col">
            <div className="p-4 border-b border-primary-700 flex items-center justify-between">
              <span className="text-sm font-bold">Vendor Portal</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 py-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${
                    pathname.startsWith(item.path) ? 'bg-primary-900 text-accent-400' : 'text-primary-200 hover:bg-primary-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-primary-700">
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-primary-200 hover:text-white">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded hover:bg-gray-100">
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {sidebarItems.find((i) => pathname.startsWith(i.path))?.label || 'Vendor'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-[10px] text-gray-400">{user?.city}</p>
              </div>
              <div className="w-8 h-8 bg-primary-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around py-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
                  pathname.startsWith(item.path) ? 'text-primary-800' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
