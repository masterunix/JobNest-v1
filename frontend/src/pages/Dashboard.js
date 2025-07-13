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
  const [profileViews, setProfileViews] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const navigate = useNavigate();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);

  const isJobSeeker = user?.role === 'jobseeker';

  useEffect(() => {
    if (user && user.role === 'employer') {
      setLoadingJobs(true);
      userAPI.getEmployerJobs()
        .then(res => {
          const jobs = res.data.jobs || res.data.data || [];
          setEmployerJobs(jobs);
          // Calculate response rate based on applications received
          const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationsCount || (job.applications ? job.applications.length : 0)), 0);
          const activeJobs = jobs.filter(job => job.status === 'active').length;
          const rate = activeJobs > 0 ? Math.round((totalApplications / activeJobs) * 100) : 0;
          setResponseRate(rate);

          // Aggregate all applications from all jobs
          const allApplications = jobs.flatMap(job =>
            (job.applications || []).map(app => ({
              id: app._id,
              jobTitle: job.title,
              company: job.company?.name || 'Company',
              applicant: app.applicant,
              appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A',
              status: app.status || 'pending',
              location: job.location?.address?.city && job.location?.address?.state 
                ? `${job.location.address.city}, ${job.location.address.state}`
                : job.location?.address?.city 
                ? job.location.address.city
                : job.location?.type 
                ? job.location.type.charAt(0).toUpperCase() + job.location.type.slice(1)
                : 'Location not specified',
              salary: job.salary?.min && job.salary?.max 
                ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                : job.salary?.min 
                ? `${job.salary.min.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                : job.salary?.max 
                ? `${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                : 'Salary not specified',
            }))
          );
          setApplications(allApplications);
        })
        .catch(() => {
          setEmployerJobs([]);
          setApplications([]);
          setResponseRate(0);
        })
        .finally(() => setLoadingJobs(false));
    }
    if (user && user.role === 'jobseeker') {
      // Fetch applications
      jobAPI.getApplicationsForUser()
        .then(res => {
          setApplications(res.data.applications || res.data.data || []);
        })
        .catch(() => setApplications([]));
      // Fetch profile completion
      userAPI.getProfileCompletion()
        .then(res => {
          const completion = res.data.completion || 0;
          setProfileCompletion(completion);
          // Calculate profile views based on completion and applications
          const baseViews = Math.floor(completion / 10) * 5;
          setProfileViews(baseViews);
        })
        .catch(() => {
          setProfileCompletion(0);
          setProfileViews(0);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Applicant Details Modal */}
      {showApplicantModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setShowApplicantModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Applicant Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {selectedApplicant.firstName} {selectedApplicant.lastName}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {selectedApplicant.email}</div>
            {selectedApplicant.phone && (
              <div className="mb-2"><span className="font-semibold">Contact Number:</span> {selectedApplicant.phone}</div>
            )}
            {/* Address */}
            {selectedApplicant.location && (
              <div className="mb-2">
                <span className="font-semibold">Address:</span> {selectedApplicant.location.city || ''}{selectedApplicant.location.city && selectedApplicant.location.state ? ', ' : ''}{selectedApplicant.location.state || ''}{(selectedApplicant.location.city || selectedApplicant.location.state) && selectedApplicant.location.country ? ', ' : ''}{selectedApplicant.location.country || ''}
              </div>
            )}
            {selectedApplicant.profile && (
              <>
                {selectedApplicant.profile.bio && (
                  <div className="mb-2"><span className="font-semibold">Bio:</span> {selectedApplicant.profile.bio}</div>
                )}
                {selectedApplicant.profile.skills && selectedApplicant.profile.skills.length > 0 && (
                  <div className="mb-2"><span className="font-semibold">Skills:</span> {selectedApplicant.profile.skills.join(', ')}</div>
                )}
                {selectedApplicant.profile.experience && (
                  <div className="mb-2"><span className="font-semibold">Experience:</span> {selectedApplicant.profile.experience}</div>
                )}
                {/* Education */}
                {selectedApplicant.profile.education && (
                  <div className="mb-2"><span className="font-semibold">Education:</span> {selectedApplicant.profile.education}</div>
                )}
                {/* Social Links */}
                {selectedApplicant.profile.linkedin && (
                  <div className="mb-2"><span className="font-semibold">LinkedIn:</span> <a href={selectedApplicant.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedApplicant.profile.linkedin}</a></div>
                )}
                {selectedApplicant.profile.github && (
                  <div className="mb-2"><span className="font-semibold">GitHub:</span> <a href={selectedApplicant.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedApplicant.profile.github}</a></div>
                )}
                {selectedApplicant.profile.website && (
                  <div className="mb-2"><span className="font-semibold">Website:</span> <a href={selectedApplicant.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedApplicant.profile.website}</a></div>
                )}
                {/* Resume/CV */}
                {selectedApplicant.profile.resume && (
                  <div className="mb-2"><span className="font-semibold">Resume:</span> <a href={selectedApplicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a></div>
                )}
                {/* Any other custom fields */}
                {Object.entries(selectedApplicant.profile).map(([key, value]) => {
                  if (["bio","skills","experience","education","linkedin","github","website","resume"].includes(key)) return null;
                  if (!value) return null;
                  return (
                    <div className="mb-2" key={key}><span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {typeof value === 'string' ? value : JSON.stringify(value)}</div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
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
                    {isJobSeeker ? profileViews : responseRate}
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
              {applications.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {isJobSeeker ? 'You haven\'t applied to any jobs yet.' : 'No applications yet.'}
                  </p>
                  {isJobSeeker && (
                    <button
                      onClick={() => navigate('/jobs')}
                      className="btn-primary px-6 py-2"
                    >
                      Browse Jobs
                    </button>
                  )}
                </div>
              ) : (
                applications.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.jobTitle}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.company}</p>
                        {/* Applicant details for employers */}
                        {user && user.role === 'employer' && item.applicant && (
                          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Applicant:</span> {item.applicant.firstName} {item.applicant.lastName} <br />
                            <span className="font-semibold">Email:</span> {item.applicant.email}
                            {item.applicant.profile && item.applicant.profile.skills && item.applicant.profile.skills.length > 0 && (
                              <>
                                <br />
                                <span className="font-semibold">Skills:</span> {item.applicant.profile.skills.join(', ')}
                              </>
                            )}
                            <br />
                            <button
                              className="btn-secondary mt-2 px-3 py-1 text-xs"
                              onClick={() => { setSelectedApplicant(item.applicant); setShowApplicantModal(true); }}
                            >
                              View Details
                            </button>
                          </div>
                        )}
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
                          item.status === 'pending' || item.status === 'Applied' || item.status === 'New'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : item.status === 'shortlisted'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : item.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
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