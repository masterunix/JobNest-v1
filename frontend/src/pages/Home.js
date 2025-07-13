import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMode } from '../contexts/ModeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  UserPlus,
  Compass,
  PlusCircle,
  LayoutDashboard,
  Search,
  User
} from 'lucide-react';

const companyLogos = [
  '/assets/companies/peloton.svg',
  '/assets/companies/roblox.svg',
  '/assets/companies/airtable.svg',
  '/assets/companies/postmates.svg',
  '/assets/companies/doordash.svg',
  '/assets/companies/nerdwallet.svg',
  '/assets/companies/plaid.svg',
  '/assets/companies/ifttt.svg',
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { mode } = useMode();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200">
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary-700 dark:text-white">
            {isAuthenticated 
              ? user?.role === 'employer'
                ? `Welcome back, ${user?.firstName || 'User'}!`
                : `Welcome back, ${user?.firstName || 'User'}!`
              : mode === 'company' 
                ? 'Hire top startup talent' 
                : 'Where startups and job seekers connect'
            }
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {isAuthenticated
              ? user?.role === 'employer'
                ? 'Ready to hire? Post jobs, manage applicants, and find your next great hire.'
                : 'Ready to find your next opportunity? Explore jobs, update your profile, and track your applications.'
              : mode === 'company'
                ? 'Post jobs, manage applicants, and find your next great hire.'
                : 'Find your next hire or your next job. Discover unique opportunities at top startups and tech companies.'
            }
          </p>
          {/* Redesigned Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {isAuthenticated ? (
              // Logged in user actions
              <div className="flex flex-col sm:flex-row gap-4 bg-white/80 dark:bg-gray-800/80 shadow rounded-xl p-4">
                {user?.role === 'admin' ? (
                  // Admin actions
                  <>
                    <Link to="/admin" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <LayoutDashboard className="h-5 w-5" /> Admin Panel
                    </Link>
                    <Link to="/jobs" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Briefcase className="h-5 w-5" /> Manage Jobs
                    </Link>
                    <Link to="/campaigns" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Compass className="h-5 w-5" /> Manage Campaigns
                    </Link>
                  </>
                ) : user?.role === 'employer' ? (
                  // Employer actions
                  <>
                    <Link to="/post-job" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Briefcase className="h-5 w-5" /> Post a Job
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <LayoutDashboard className="h-5 w-5" /> Company Dashboard
                    </Link>
                    <Link to="/profile" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <User className="h-5 w-5" /> Company Profile
                    </Link>
                  </>
                ) : (
                  // Job seeker actions
                  <>
                    <Link to="/jobs" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Search className="h-5 w-5" /> Find Jobs
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <LayoutDashboard className="h-5 w-5" /> My Dashboard
                    </Link>
                    <Link to="/profile" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <User className="h-5 w-5" /> My Profile
                    </Link>
                  </>
                )}
              </div>
            ) : (
              // Not logged in user actions
              <div className="flex flex-col sm:flex-row gap-4 bg-white/80 dark:bg-gray-800/80 shadow rounded-xl p-4">
                {mode === 'company' ? (
                  <>
                    <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <UserPlus className="h-5 w-5" /> Sign Up as Company
                    </Link>
                    <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <User className="h-5 w-5" /> Log In
                    </Link>
                    <Link to="/jobs" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Briefcase className="h-5 w-5" /> Browse Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <UserPlus className="h-5 w-5" /> Sign Up as Job Seeker
                    </Link>
                    <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <User className="h-5 w-5" /> Log In
                    </Link>
                    <Link to="/jobs" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                      <Briefcase className="h-5 w-5" /> Browse Jobs
                    </Link>
                  </>
                )}
              </div>
            )}
            {/* Campaigns section - Show explore for all users, create only for authenticated employers */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white/80 dark:bg-gray-800/80 shadow rounded-xl p-4">
              <Link to="/campaigns" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                <Compass className="h-5 w-5" /> Explore Campaigns
              </Link>
              {isAuthenticated && user?.role === 'employer' ? (
                <Link to="/campaigns/create" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                  <PlusCircle className="h-5 w-5" /> Create Campaign
                </Link>
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                  <User className="h-5 w-5" /> Log In to Create
                </Link>
              ) : null}
            </div>
          </div>
          <div className="max-w-xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
              }
            }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isAuthenticated && user?.role === 'employer'
                      ? "Search candidates, skills, experience..."
                      : "Search jobs, companies, skills..."
                  }
                  className="input w-full py-3 px-4 pl-10 text-lg border-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 dark:focus:border-primary-400 rounded-lg shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Company Logos */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {companyLogos.map((src, i) => (
            <img key={i} src={src} alt="Company logo" className="h-10 grayscale opacity-80 hover:opacity-100 transition" />
          ))}
        </div>
      </section>
      {/* Why Job Seekers Love Us - Only show for job seekers or non-authenticated users */}
      {(!isAuthenticated || user?.role !== 'employer') && (
        <section className="py-16 bg-background-light dark:bg-background-dark">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-primary-700 dark:text-white">Why job seekers love us</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">💬</div>
                <div className="font-semibold mb-2">Direct connection with founders</div>
                <div className="text-gray-500 dark:text-gray-400">No third party recruiters. Connect directly with decision makers.</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <div className="font-semibold mb-2">Transparent offers</div>
                <div className="text-gray-500 dark:text-gray-400">See salary, and more before you apply.</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <div className="font-semibold mb-2">One-click apply</div>
                <div className="text-gray-500 dark:text-gray-400">No cover letters. Your profile is all you need.</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">🌟</div>
                <div className="font-semibold mb-2">Unique opportunities</div>
                <div className="text-gray-500 dark:text-gray-400">Find jobs you won't see anywhere else.</div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Why Recruiters Love Us - Show for all users, but emphasize for employers */}
      <section className={`py-16 ${isAuthenticated && user?.role === 'employer' ? 'bg-primary-50 dark:bg-primary-900' : 'bg-white dark:bg-gray-900'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-10 ${isAuthenticated && user?.role === 'employer' ? 'text-primary-700 dark:text-white' : 'text-secondary-700 dark:text-white'}`}>
            {isAuthenticated && user?.role === 'employer' ? 'Why you\'ll love JobNest' : 'Why recruiters love us'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <div className="font-semibold mb-2">A complete solution</div>
              <div className="text-gray-500 dark:text-gray-400">Everthing Just Works.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <div className="font-semibold mb-2">All-in-one recruiting tools</div>
              <div className="text-gray-500 dark:text-gray-400">Post jobs, manage applicants, and brand your company for free.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <div className="font-semibold mb-2">AI-powered matching</div>
              <div className="text-gray-500 dark:text-gray-400">An Exciting and Upcoming Project where you can Post Jobs.</div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary-700 dark:text-white">From our users</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"I got my tech job on JobNest. Pays well, great culture, and unlimited PTO."</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">- Sanjeev, Software Engineer</div>
            </div>
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"Half of the offers I give are sourced from JobNest. It's the best product for anyone looking for startup talent."</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">- Nadeem, Recruiter</div>
            </div>
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"I love JobNest. - it's super easy to use and I love the UI."</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">- Raj, Product Manager</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 