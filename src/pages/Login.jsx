import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, Shield, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const result = login(email, password);
    if (result === 'admin') {
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } else if (result === 'vendor') {
      toast.success('Welcome to Vendor Portal!');
      navigate('/vendor/dashboard');
    } else if (result === 'suspended') {
      toast.error('Your account has been suspended. Contact admin.');
      setErrors({ password: 'Account suspended' });
    } else {
      toast.error('Invalid credentials');
      setErrors({ password: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-4xl">🏪</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">SuvidhaHub</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-gray-100 rounded-sm p-1 mb-6">
          <button
            type="button"
            onClick={() => { setLoginType('admin'); setEmail(''); setPassword(''); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium transition-colors ${loginType === 'admin' ? 'bg-primary-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
          <button
            type="button"
            onClick={() => { setLoginType('vendor'); setEmail(''); setPassword(''); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium transition-colors ${loginType === 'vendor' ? 'bg-primary-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Store className="w-4 h-4" /> Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              placeholder={loginType === 'admin' ? 'admin@suvidhahub.in' : 'sharma@suvidhahub.in'}
              className={`w-full px-4 py-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full bg-primary-800 hover:bg-primary-900 text-white py-2.5 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          {loginType === 'admin' ? 'Demo: admin@suvidhahub.in / admin123' : 'Demo: sharma@suvidhahub.in / vendor123'}
        </p>
      </div>
    </div>
  );
}
