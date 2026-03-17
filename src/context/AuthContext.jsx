import { createContext, useContext, useState, useCallback } from 'react';
import { vendors } from '../data/vendors';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const stored = localStorage.getItem('suvidhahub_auth');
    if (!stored) return { isAuthenticated: false, role: null, user: null };
    try {
      return JSON.parse(stored);
    } catch {
      return { isAuthenticated: false, role: null, user: null };
    }
  });

  const login = useCallback((email, password) => {
    // Admin login
    if (email === 'admin@suvidhahub.in' && password === 'admin123') {
      const state = { isAuthenticated: true, role: 'admin', user: { name: 'Admin', email } };
      localStorage.setItem('suvidhahub_auth', JSON.stringify(state));
      setAuthState(state);
      return 'admin';
    }
    // Vendor login
    const vendor = vendors.find(v => v.email === email && v.password === password);
    if (vendor) {
      if (vendor.status === 'Suspended') return 'suspended';
      const state = { isAuthenticated: true, role: 'vendor', user: { id: vendor.id, name: vendor.name, email: vendor.email, city: vendor.city, phone: vendor.phone } };
      localStorage.setItem('suvidhahub_auth', JSON.stringify(state));
      setAuthState(state);
      return 'vendor';
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('suvidhahub_auth');
    setAuthState({ isAuthenticated: false, role: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
