import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  UserPlus,
  Compass,
  PlusCircle,
  LayoutDashboard
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
  const { isAuthenticated } = useAuth();
  const { mode } = useMode();

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Smart Job Search',
      description: 'Find jobs that match your skills and preferences with our intelligent matching algorithm.'
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Easy Job Posting',
      description: 'Post job openings quickly and reach qualified candidates in your industry.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Talent Pool',
      description: 'Access a diverse pool of talented professionals from various industries.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Career Growth',
      description: 'Track your career progress and discover opportunities for advancement.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast & Efficient',
      description: 'Streamlined processes for quick job applications and hiring decisions.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Jobs' },
    { number: '50K+', label: 'Job Seekers' },
    { number: '5K+', label: 'Companies' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="bg-background text-text">
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary-700">
            {mode === 'company' ? 'Hire top startup talent' : 'Where startups and job seekers connect'}
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-8">
            {mode === 'company'
              ? 'Post jobs, manage applicants, and find your next great hire.'
              : 'Find your next hire or your next job. Discover unique opportunities at top startups and tech companies.'}
          </p>
          {/* Redesigned Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/80 shadow rounded-xl p-4">
              {mode === 'company' ? (
                <>
                  <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <UserPlus className="h-5 w-5" /> Sign Up as Company
                  </Link>
                  <Link to="/post-job" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <Briefcase className="h-5 w-5" /> Post a Job
                  </Link>
                  <Link to="/dashboard" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <LayoutDashboard className="h-5 w-5" /> Company Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <UserPlus className="h-5 w-5" /> Sign Up as Job Seeker
                  </Link>
                  <Link to="/jobs" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <Briefcase className="h-5 w-5" /> Find Jobs
                  </Link>
                  <Link to="/dashboard" className="btn-accent flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                    <LayoutDashboard className="h-5 w-5" /> My Dashboard
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/80 shadow rounded-xl p-4">
              <Link to="/campaigns" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                <Compass className="h-5 w-5" /> Explore Campaigns
              </Link>
              <Link to="/campaigns/create" className="btn-secondary flex items-center gap-2 px-6 py-3 text-lg font-semibold">
                <PlusCircle className="h-5 w-5" /> Create Campaign
              </Link>
            </div>
          </div>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              className="input w-full py-3 px-4 text-lg border-2 border-primary-200 focus:border-primary-500 rounded-lg shadow-sm"
            />
          </div>
        </div>
      </section>
      {/* Company Logos */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {companyLogos.map((src, i) => (
            <img key={i} src={src} alt="Company logo" className="h-10 grayscale opacity-80 hover:opacity-100 transition" />
          ))}
        </div>
      </section>
      {/* Why Job Seekers Love Us */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary-700">Why job seekers love us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <div className="font-semibold mb-2">Direct connection with founders</div>
              <div className="text-gray-500">No third party recruiters. Connect directly with decision makers.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <div className="font-semibold mb-2">Transparent offers</div>
              <div className="text-gray-500">See salary, stock options, and more before you apply.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <div className="font-semibold mb-2">One-click apply</div>
              <div className="text-gray-500">No cover letters. Your profile is all you need.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <div className="font-semibold mb-2">Unique opportunities</div>
              <div className="text-gray-500">Find jobs you won't see anywhere else.</div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Recruiters Love Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-secondary-700">Why recruiters love us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <div className="font-semibold mb-2">10M+ startup-ready candidates</div>
              <div className="text-gray-500">Tap into a huge, engaged talent pool.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <div className="font-semibold mb-2">All-in-one recruiting tools</div>
              <div className="text-gray-500">Post jobs, manage applicants, and brand your company for free.</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <div className="font-semibold mb-2">AI-powered matching</div>
              <div className="text-gray-500">Let JobNest AI find and schedule the best candidates for you.</div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary-700">From our users</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"I got my tech job on JobNest 4 years ago and I'm still happy! Pays well, great culture, and unlimited PTO."</div>
              <div className="text-sm text-gray-500">- Sarah, Software Engineer</div>
            </div>
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"Half of the offers I give are sourced from JobNest. It's the best product for anyone looking for startup talent."</div>
              <div className="text-sm text-gray-500">- Michael, Recruiter</div>
            </div>
            <div className="card p-6">
              <div className="mb-4 text-lg font-semibold">"I love JobNest. I got my current job at a startup entirely through the site last year - it's super easy to use and I love the UI."</div>
              <div className="text-sm text-gray-500">- Priya, Product Manager</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 