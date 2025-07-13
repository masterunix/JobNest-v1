import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMode } from '../../contexts/ModeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useMode();

  return (
    <nav className={`sticky top-0 z-40 border-b border-gray-200 shadow-sm ${darkMode ? 'bg-surface-dark' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={darkMode ? "/assets/jobnest-logo-dark.png" : "/assets/jobnest-logo-light.png"} 
            alt="JobNest Logo" 
            className="h-12 w-auto" 
          />
        </Link>

        {/* Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
              {user?.role === 'admin' ? (
                <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              {/* Role-based main action button */}
              {user?.role === 'employer' && (
                <Link to="/post-job" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Post Job
                </Link>
              )}
              {user?.role === 'jobseeker' && (
                <Link to="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Jobs
                </Link>
              )}
              {user?.role === 'owner' && (
                <Link to="/campaigns/create" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Create Campaign
                </Link>
              )}
              {user?.role === 'backer' && (
                <Link to="/campaigns" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                  Campaigns
                </Link>
              )}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                  }
                }}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Log In</Link>
              <Link to="/register" className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign Up</Link>
            </>
          )}
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-500 dark:text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-surface-dark' : 'bg-white'} border-t border-gray-200 dark:border-gray-700 shadow-lg`}>
          <div className="flex flex-col p-4 space-y-2">
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 w-full text-left"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user?.firstName || user?.fullName || 'User'}
                  </span>
                </div>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium py-2 transition-colors">
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors">
                    Dashboard
                  </Link>
                )}
                {/* Role-based main action button */}
                {user?.role === 'employer' && (
                  <Link to="/post-job" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors">
                    Post Job
                  </Link>
                )}
                {user?.role === 'jobseeker' && (
                  <Link to="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors">
                    Jobs
                  </Link>
                )}
                {user?.role === 'owner' && (
                  <Link to="/campaigns/create" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Create Campaign
                  </Link>
                )}
                {user?.role === 'backer' && (
                  <Link to="/campaigns" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 transition-colors">
                    Campaigns
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium py-2 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors">Log In</Link>
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