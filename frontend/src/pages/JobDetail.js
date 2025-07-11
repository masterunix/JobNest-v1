import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  Globe, 
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMode } from '../contexts/ModeContext';
import { useAuth } from '../contexts/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useMode();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [sending, setSending] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobAPI.getJob(id);
        if (res.data.success) {
          setJob(res.data.data);
          console.log('Fetched job:', res.data.data); // Debug log
          // Check if user has already applied
          const applications = res.data.data.applications;
          if (Array.isArray(applications) && user) {
            setHasApplied(applications.some(app => app.applicant === user._id || app.applicant === user.id));
          } else {
            setHasApplied(false);
          }
        } else {
          toast.error('Job not found');
          navigate('/jobs');
        }
      } catch {
        toast.error('Failed to load job');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate, user]);

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const handleSendApplication = async () => {
    setSending(true);
    try {
      const res = await jobAPI.applyForJob(id, { coverLetter });
      if (res.data.success) {
        toast.success('Application submitted! You can track your application in your dashboard.');
        setShowApplyModal(false);
        setCoverLetter('');
        setHasApplied(true); // Update button immediately
        // Optionally update local job applications count for instant feedback
        setJob(prevJob => prevJob ? {
          ...prevJob,
          applications: Array.isArray(prevJob.applications)
            ? [...prevJob.applications, { applicant: user._id || user.id }]
            : [{ applicant: user._id || user.id }],
        } : prevJob);
      } else {
        toast.error(res.data.message || 'Failed to apply.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply.');
    } finally {
      setSending(false);
    }
  };

  if (loading || !job) return <div className="max-w-2xl mx-auto py-16 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/jobs" 
          className={`inline-flex items-center mb-6 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className={`rounded-lg border p-6 mb-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Building className={`h-8 w-8 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{job?.title || 'Job Title'}</h1>
                <p className={`text-lg mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{job?.company?.name || job?.company || 'Company'}</p>
                <div className={`flex items-center space-x-4 text-sm transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job?.location?.city}, {job?.location?.state}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job?.type || 'Type not specified'}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job?.salary?.min && job?.salary?.max ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}/${job.salary.period}` : 'Salary not specified'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-lg border transition-colors duration-200 ${
                  isSaved 
                    ? 'bg-primary-50 border-primary-200 text-primary-600' 
                    : isDarkMode
                      ? 'border-gray-600 text-gray-400 hover:text-gray-300'
                      : 'border-gray-300 text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className={`p-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:text-gray-300'
                  : 'border-gray-300 text-gray-400 hover:text-gray-600'
              }`}>
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t transition-colors duration-200 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`flex items-center space-x-4 text-sm transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>Posted {job?.posted || 'N/A'}</span>
              <span>•</span>
              <span>{Array.isArray(job?.applications) ? job.applications.length : 0} applications</span>
            </div>
            <button
              className="btn-primary px-8 py-3"
              onClick={handleApply}
              disabled={hasApplied}
            >
              {hasApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Job Description</h2>
              <div className="prose prose-gray max-w-none">
                {job?.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className={`mb-4 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Requirements</h2>
              {job?.requirements ? (
                <ul className="space-y-2">
                  {/* Skills */}
                  {Array.isArray(job?.requirements?.skills) && job?.requirements?.skills.length > 0 && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Skills: {job?.requirements?.skills?.join(', ')}
                      </span>
                    </li>
                  )}
                  {/* Experience */}
                  {job?.requirements?.experience && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Experience: {job?.requirements?.experience}
                      </span>
                    </li>
                  )}
                  {/* Education */}
                  {job?.requirements?.education && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Education: {job?.requirements?.education}
                      </span>
                    </li>
                  )}
                  {/* Certifications */}
                  {Array.isArray(job?.requirements?.certifications) && job?.requirements?.certifications.length > 0 && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Certifications: {job?.requirements?.certifications?.join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
              ) : (
                <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No requirements specified.</p>
              )}
            </div>

            {/* Benefits */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Benefits</h2>
              {Array.isArray(job?.benefits) && job?.benefits.length > 0 ? (
                <ul className="space-y-2">
                  {job?.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No benefits specified.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>About {job?.company?.name || job?.company || 'Company'}</h3>
              <p className={`mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {job?.companyInfo?.description || 'No company description available.'}
              </p>
              <div className="space-y-2 text-sm">
                {job?.companyInfo?.size && (
                  <div className="flex items-center">
                    <Users className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <span className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{job?.companyInfo?.size}</span>
                  </div>
                )}
                {job?.companyInfo?.industry && (
                  <div className="flex items-center">
                    <Building className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <span className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{job?.companyInfo?.industry}</span>
                  </div>
                )}
                {job?.companyInfo?.website && (
                  <div className="flex items-center">
                    <Globe className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <a 
                      href={job?.companyInfo?.website} 
                      className="text-primary-600 hover:text-primary-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              {/* Remove hardcoded placeholder jobs here. Optionally, you can fetch and display real similar jobs if available. */}
            </div>
          </div>
        </div>
      </div>
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Submit Your Application</h2>
            <div className="mb-2 text-gray-700 dark:text-gray-300 text-sm">
              Please write a short paragraph about why you are a good fit for this job. Consider including:
              <ul className="list-disc ml-6 mt-1 text-xs text-gray-600 dark:text-gray-400">
                <li>Your motivation for applying</li>
                <li>Relevant experience or skills</li>
                <li>What excites you about this company or role</li>
              </ul>
            </div>
            <div className="mb-2 text-xs text-red-600 dark:text-red-400 font-semibold">You can apply only once for this job.</div>
            <textarea
              className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-gray-100"
              rows={5}
              placeholder="Type your application message here..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              disabled={sending}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary px-4 py-2 rounded"
                onClick={() => setShowApplyModal(false)}
                disabled={sending}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2 rounded"
                onClick={handleSendApplication}
                disabled={sending || !coverLetter.trim()}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail; 