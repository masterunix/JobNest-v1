import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState('jobseeker');
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/jobnest-logo.svg" alt="JobNest Logo" className="h-8 w-auto" />
        </Link>
        {/* Toggle */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${mode === 'jobseeker' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500 hover:bg-primary-50'}`}
            onClick={() => setMode('jobseeker')}
          >
            Job Seeker
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${mode === 'company' ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-500 hover:bg-secondary-50'}`}
            onClick={() => setMode('company')}
          >
            Company
          </button>
        </div>
        {/* Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Log In</Link>
          <Link to="/register" className="btn-primary px-5 py-2">Sign Up</Link>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-500" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            <div className="flex space-x-2 mb-2">
              <button
                className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors text-sm ${mode === 'jobseeker' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500 hover:bg-primary-50'}`}
                onClick={() => setMode('jobseeker')}
              >
                Job Seeker
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors text-sm ${mode === 'company' ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-500 hover:bg-secondary-50'}`}
                onClick={() => setMode('company')}
              >
                Company
              </button>
            </div>
            <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium py-2">Log In</Link>
            <Link to="/register" className="btn-primary px-5 py-2">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 