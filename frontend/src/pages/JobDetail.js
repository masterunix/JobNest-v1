import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

const JobDetail = () => {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const { isDarkMode } = useMode();

  // Mock job data
  const job = {
    id: id,
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $180,000',
    experience: '3-5 years',
    posted: '2 days ago',
    applications: 24,
    description: `We are looking for a Senior Full Stack Engineer to join our growing team. You will be responsible for building and maintaining our web applications, working with both frontend and backend technologies.

As a Senior Full Stack Engineer, you will:
- Design and implement scalable web applications
- Work with modern frontend frameworks (React, Vue.js)
- Develop RESTful APIs and microservices
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews and technical discussions`,
    requirements: [
      '5+ years of experience in full-stack development',
      'Proficiency in JavaScript, Python, and SQL',
      'Experience with React, Node.js, and Django',
      'Knowledge of cloud platforms (AWS, GCP)',
      'Strong problem-solving and communication skills',
      'Experience with agile development methodologies'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      '401(k) matching',
      'Flexible work hours and remote options',
      'Professional development budget',
      'Unlimited PTO',
      'Free lunch and snacks',
      'Gym membership reimbursement'
    ],
    companyInfo: {
      size: '50-100 employees',
      industry: 'Technology',
      founded: '2018',
      description: 'TechCorp is a leading technology company focused on building innovative solutions for businesses worldwide.',
      website: 'https://techcorp.com'
    }
  };

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
                }`}>{job.title}</h1>
                <p className={`text-lg mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{job.company}</p>
                <div className={`flex items-center space-x-4 text-sm transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
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
              <span>Posted {job.posted}</span>
              <span>•</span>
              <span>{job.applications} applications</span>
            </div>
            <button className="btn-primary px-8 py-3">
              Apply Now
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
                {job.description.split('\n').map((paragraph, index) => (
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
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{benefit}</span>
                  </li>
                ))}
              </ul>
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
              }`}>About {job.company}</h3>
              <p className={`mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{job.companyInfo.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Users className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{job.companyInfo.size}</span>
                </div>
                <div className="flex items-center">
                  <Building className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{job.companyInfo.industry}</span>
                </div>
                <div className="flex items-center">
                  <Globe className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <a 
                    href={job.companyInfo.website} 
                    className="text-primary-600 hover:text-primary-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <h4 className="font-medium text-gray-900">Frontend Developer</h4>
                  <p className="text-sm text-gray-600">StartupXYZ</p>
                  <p className="text-sm text-gray-500">San Francisco, CA</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <h4 className="font-medium text-gray-900">Backend Engineer</h4>
                  <p className="text-sm text-gray-600">InnovateLab</p>
                  <p className="text-sm text-gray-500">Remote</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">DevOps Engineer</h4>
                  <p className="text-sm text-gray-600">TechCorp</p>
                  <p className="text-sm text-gray-500">New York, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 