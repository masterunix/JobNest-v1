import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/assets/jobnest-logo-light.png"
            alt="JobNest Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
              {user?.role === 'admin' ? (
                <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              {/* Role-based main action button */}
              {user?.role === 'employer' && (
                <Link to="/post-job" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Post Job
                </Link>
              )}
              {user?.role === 'jobseeker' && (
                <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Jobs
                </Link>
              )}
              {user?.role === 'owner' && (
                <Link to="/campaigns/create" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Create Campaign
                </Link>
              )}
              {user?.role === 'backer' && (
                <Link to="/campaigns" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Campaigns
                </Link>
              )}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                  }
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Log In</Link>
              <Link to="/register" className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign Up</Link>
            </>
          )}
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
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {user?.firstName || user?.fullName || 'User'}
                  </span>
                </div>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors">
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Dashboard
                  </Link>
                )}
                {/* Role-based main action button */}
                {user?.role === 'employer' && (
                  <Link to="/post-job" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Post Job
                  </Link>
                )}
                {user?.role === 'jobseeker' && (
                  <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                    Jobs
                  </Link>
                )}
                {user?.role === 'owner' && (
                  <Link to="/campaigns/create" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                    Create Campaign
                  </Link>
                )}
                {user?.role === 'backer' && (
                  <Link to="/campaigns" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                    Campaigns
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium py-2 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">Log In</Link>
                <Link to="/register" className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 