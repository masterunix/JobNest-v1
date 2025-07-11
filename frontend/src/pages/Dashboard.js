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

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for job seekers
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

  // Mock data for employers
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isJobSeeker ? 'Track your job applications and career progress' : 'Manage your job postings and candidates'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {isJobSeeker ? 'Applications' : 'Recent Applications'}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {isJobSeeker ? 'Saved Jobs' : 'Posted Jobs'}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {isJobSeeker ? 'Applications' : 'Active Jobs'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isJobSeeker ? jobSeekerData.applications.length : employerData.postedJobs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                  <Eye className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {isJobSeeker ? 'Profile Views' : 'Total Views'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isJobSeeker ? '12' : '245'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {isJobSeeker ? 'Profile Completion' : 'Response Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isJobSeeker ? `${jobSeekerData.profileCompletion}%` : '85%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isJobSeeker ? 'Your Applications' : 'Recent Applications'}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {(isJobSeeker ? jobSeekerData.applications : employerData.recentApplications).map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.jobTitle || item.applicantName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.company || item.jobTitle}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isJobSeeker ? 'Saved Jobs' : 'Posted Jobs'}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {(isJobSeeker ? jobSeekerData.savedJobs : employerData.postedJobs).map((job) => (
                <div key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{job.jobTitle || job.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                          job.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
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