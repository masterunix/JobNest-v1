import React, { useState, useEffect } from 'react';
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
import EmployerCampaignManager from './campaigns/EmployerCampaignManager';
import { userAPI, jobAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [employerJobs, setEmployerJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [applications, setApplications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const navigate = useNavigate();

  const isJobSeeker = user?.role === 'jobseeker';

  useEffect(() => {
    if (user && user.role === 'employer') {
      setLoadingJobs(true);
      userAPI.getEmployerJobs()
        .then(res => {
          setEmployerJobs(res.data.jobs || res.data.data || []);
        })
        .catch(() => setEmployerJobs([]))
        .finally(() => setLoadingJobs(false));
    }
    if (user && user.role === 'jobseeker') {
      // Fetch applications
      jobAPI.getApplicationsForUser()
        .then(res => {
          setApplications(res.data.applications || res.data.data || []);
        })
        .catch(() => setApplications([]));
      // Optionally fetch profile completion
      userAPI.getProfileCompletion()
        .then(res => setProfileCompletion(res.data.completion || 0))
        .catch(() => setProfileCompletion(0));
    }
  }, [user]);

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
          {/* Only show Posted Jobs tab if NOT a jobseeker */}
          {user && !isJobSeeker && ['employer', 'owner'].includes(user.role) && (
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Posted Jobs
            </button>
          )}
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
                    {applications.length}
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
                    {profileCompletion}%
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
              {applications.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.jobTitle}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.company}</p>
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

        {/* Only show Posted Jobs section if NOT a jobseeker */}
        {activeTab === 'jobs' && user && !isJobSeeker && ['employer', 'owner'].includes(user.role) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Posted Jobs
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loadingJobs ? (
                <div className="px-6 py-4 text-gray-500 dark:text-gray-400">Loading jobs...</div>
              ) : employerJobs.length === 0 ? (
                <div className="px-6 py-4 text-gray-500 dark:text-gray-400">No jobs posted yet.</div>
              ) : (
                employerJobs.map((job) => (
                  <div key={job._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{job.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company?.name}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location?.type} {job.location?.address?.city ? `- ${job.location.address.city}` : ''}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary?.min} - {job.salary?.max} {job.salary?.currency} ({job.salary?.period})
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applicationsCount || 0} applications
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {job.views || 0} views
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {job.status}
                        </span>
                        <button className="btn-primary px-4 py-2 text-sm"
                          onClick={() => navigate(`/jobs/edit/${job._id}`)}>
                           Manage
                        </button>
                        <button className="btn-secondary px-4 py-2 text-sm"
                          onClick={() => navigate(`/jobs/${job._id}/applications`)}>
                           Applications
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {user && ['employer', 'owner'].includes(user.role) && (
          <div className="mt-10">
            <EmployerCampaignManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 