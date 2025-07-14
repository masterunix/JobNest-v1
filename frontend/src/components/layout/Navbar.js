import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMode } from '../../contexts/ModeContext';
import { useSocket } from '../../contexts/SocketContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useMode();
  const socket = useSocket();
  const [notifications, setNotifications] = React.useState([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);

  // Listen for real-time notifications
  React.useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      setNotifications((prev) => [{
        message: data.message || 'You have a new notification!',
        timestamp: new Date().toLocaleTimeString(),
        read: false,
      }, ...prev]);
      setUnread((prev) => prev + 1);
    };
    socket.on('notification', handler);
    return () => {
      socket.off('notification', handler);
    };
  }, [socket]);

  // Mark all as read when dropdown opens
  React.useEffect(() => {
    if (dropdownOpen) setUnread(0);
  }, [dropdownOpen]);

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
          {/* Notification Bell */}
          {isAuthenticated && (
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                aria-label="Notifications"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unread}</span>
                )}
              </button>
              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-gray-100">Notifications</div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 dark:text-gray-400 text-sm">No notifications yet.</div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className={`p-4 text-sm ${n.read ? 'text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>{n.message}<div className="text-xs text-gray-400 mt-1">{n.timestamp}</div></div>
                      ))
                    )}
                  </div>
                  <button
                    className="w-full py-2 text-center text-xs text-blue-600 dark:text-blue-400 hover:underline bg-gray-50 dark:bg-gray-800 rounded-b-lg"
                    onClick={() => { setNotifications([]); setDropdownOpen(false); }}
                  >Clear All</button>
                </div>
              )}
            </div>
          )}
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