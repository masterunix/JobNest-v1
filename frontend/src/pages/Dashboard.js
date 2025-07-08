import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Eye, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

const mockOwnedCampaigns = [
  {
    id: 1,
    title: 'Build a School in Kenya',
    goal: 20000,
    raised: 12000,
    status: 'approved',
    contributors: 120
  },
  {
    id: 2,
    title: 'Tech for Rural Youth',
    goal: 15000,
    raised: 4000,
    status: 'pending',
    contributors: 25
  }
];

const mockBackedCampaigns = [
  {
    id: 2,
    title: 'Clean Water for All',
    goal: 10000,
    raised: 9500,
    contributed: 200,
    status: 'approved'
  }
];

const Dashboard = () => {
  const { user, setMockRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const jobSeekerData = {
    applications: [
      {
        id: 1,
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp',
        status: 'Applied',
        appliedDate: '2024-01-15',
        location: 'San Francisco, CA',
        salary: '$120k - $150k'
      },
      {
        id: 2,
        jobTitle: 'Product Manager',
        company: 'StartupXYZ',
        status: 'Under Review',
        appliedDate: '2024-01-10',
        location: 'Remote',
        salary: '$100k - $130k'
      }
    ],
    savedJobs: [
      {
        id: 1,
        jobTitle: 'Full Stack Engineer',
        company: 'InnovateLab',
        location: 'New York, NY',
        salary: '$110k - $140k'
      }
    ],
    profileCompletion: 85
  };

  const employerData = {
    postedJobs: [
      {
        id: 1,
        title: 'Senior Backend Engineer',
        applications: 24,
        views: 156,
        status: 'Active',
        postedDate: '2024-01-10'
      },
      {
        id: 2,
        title: 'UX Designer',
        applications: 18,
        views: 89,
        status: 'Active',
        postedDate: '2024-01-08'
      }
    ],
    recentApplications: [
      {
        id: 1,
        applicantName: 'Sarah Johnson',
        jobTitle: 'Senior Backend Engineer',
        appliedDate: '2024-01-15',
        status: 'New'
      }
    ]
  };

  const isJobSeeker = user?.role === 'jobseeker';

  // Role switcher for frontend testing
  const roles = ['admin', 'owner', 'backer', 'jobseeker', 'employer'];

  // Admin dashboard
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <select
              className="ml-auto border rounded px-2 py-1"
              value={user.role}
              onChange={e => setMockRole(e.target.value)}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Moderation & Insights</h2>
            <p className="text-gray-600">(Admin features coming soon: campaign moderation, platform stats, user management...)</p>
          </div>
        </div>
      </div>
    );
  }

  // Owner dashboard
  if (user.role === 'owner') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <select
              className="ml-auto border rounded px-2 py-1"
              value={user.role}
              onChange={e => setMockRole(e.target.value)}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
            <ul className="divide-y divide-gray-100">
              {mockOwnedCampaigns.map(c => (
                <li key={c.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500">Status: {c.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-700 font-semibold">${c.raised.toLocaleString()} / ${c.goal.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{c.contributors} contributors</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Backer dashboard
  if (user.role === 'backer') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-3xl font-bold">Backer Dashboard</h1>
            <select
              className="ml-auto border rounded px-2 py-1"
              value={user.role}
              onChange={e => setMockRole(e.target.value)}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Contributions</h2>
            <ul className="divide-y divide-gray-100">
              {mockBackedCampaigns.map(c => (
                <li key={c.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-500">Status: {c.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-700 font-semibold">Contributed: ${c.contributed.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Raised: ${c.raised.toLocaleString()} / ${c.goal.toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {isJobSeeker ? 'Track your job applications and career progress' : 'Manage your job postings and candidates'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isJobSeeker ? 'Applications' : 'Recent Applications'}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isJobSeeker ? 'Saved Jobs' : 'Posted Jobs'}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isJobSeeker ? 'Applications' : 'Active Jobs'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isJobSeeker ? jobSeekerData.applications.length : employerData.postedJobs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Eye className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isJobSeeker ? 'Profile Views' : 'Total Views'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isJobSeeker ? '12' : '245'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isJobSeeker ? 'Profile Completion' : 'Response Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isJobSeeker ? `${jobSeekerData.profileCompletion}%` : '85%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isJobSeeker ? 'Your Applications' : 'Recent Applications'}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {(isJobSeeker ? jobSeekerData.applications : employerData.recentApplications).map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.jobTitle || item.applicantName}</h4>
                      <p className="text-sm text-gray-600">{item.company || item.jobTitle}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.appliedDate}
                        </span>
                        {item.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </span>
                        )}
                        {item.salary && (
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {item.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Applied' || item.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isJobSeeker ? 'Saved Jobs' : 'Posted Jobs'}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {(isJobSeeker ? jobSeekerData.savedJobs : employerData.postedJobs).map((job) => (
                <div key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.jobTitle || job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        {job.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </span>
                        )}
                        {!isJobSeeker && (
                          <>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applications} applications
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {job.views} views
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isJobSeeker && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      )}
                      <button className="btn-primary px-4 py-2 text-sm">
                        {isJobSeeker ? 'View Job' : 'Manage'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 