import React, { useState } from 'react';
import { 
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { jobAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const PostJob = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: {
      skills: [''],
      experience: 'mid',
      education: 'bachelor'
    },
    location: {
      type: 'onsite',
      address: {
        city: '',
        state: '',
        country: 'USA'
      }
    },
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly'
    },
    benefits: [''],
    type: 'full-time',
    category: 'technology',
    applicationDeadline: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 3;
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalaryChange = (field, value) => {
    setJobData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!jobData.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!jobData.description.trim()) {
      toast.error('Job description is required');
      return;
    }
    
    if (!user?.company?.name) {
      toast.error('Your company name is missing. Please complete your profile before posting a job.');
      return;
    }
    
    if (!jobData.salary.min || !jobData.salary.max) {
      toast.error('Please provide both minimum and maximum salary');
      return;
    }
    
    if (parseInt(jobData.salary.min) > parseInt(jobData.salary.max)) {
      toast.error('Minimum salary cannot be greater than maximum salary');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format the data according to the API schema
      const formattedJobData = {
        title: jobData.title,
        description: jobData.description,
        requirements: {
          skills: jobData.requirements.skills.filter(skill => skill.trim()),
          experience: jobData.requirements.experience,
          education: jobData.requirements.education
        },
        location: jobData.location,
        salary: {
          min: jobData.salary.min ? parseInt(jobData.salary.min) : 0,
          max: jobData.salary.max ? parseInt(jobData.salary.max) : 0,
          currency: jobData.salary.currency,
          period: jobData.salary.period
        },
        benefits: jobData.benefits.filter(benefit => benefit.trim()),
        type: jobData.type,
        category: jobData.category,
        deadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null,
        company: {
          name: user?.company?.name || '',
        },
      };

      console.log('Sending job data:', formattedJobData);
      const response = await jobAPI.createJob(formattedJobData);
      
      if (response.data.success) {
        toast.success('Job posted successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else if (error.response?.status === 403) {
        toast.error('You must be logged in as an employer to post jobs.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to post a job.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to post job. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Post a Job</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new job listing to attract top talent</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full rounded-full h-2 bg-gray-200">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="rounded-lg border p-6 bg-white border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={user?.company?.name || ''}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Job Category *
                  </label>
                  <select
                    required
                    value={jobData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="design">Design</option>
                    <option value="engineering">Engineering</option>
                    <option value="operations">Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Job Type *
                  </label>
                  <select
                    required
                    value={jobData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Location Type *
                  </label>
                  <select
                    required
                    value={jobData.location.type}
                    onChange={(e) => handleInputChange('location', { ...jobData.location, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Experience Level
                  </label>
                  <select
                    value={jobData.requirements.experience}
                    onChange={(e) => handleInputChange('requirements', { ...jobData.requirements, experience: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>


              </div>

              {/* Location Address */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={jobData.location.address.city}
                    onChange={(e) => handleInputChange('location', { 
                      ...jobData.location, 
                      address: { ...jobData.location.address, city: e.target.value }
                    })}
                    placeholder="San Francisco"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    value={jobData.location.address.state}
                    onChange={(e) => handleInputChange('location', { 
                      ...jobData.location, 
                      address: { ...jobData.location.address, state: e.target.value }
                    })}
                    placeholder="CA"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Country
                  </label>
                  <select
                    value={jobData.location.address.country}
                    onChange={(e) => handleInputChange('location', { 
                      ...jobData.location, 
                      address: { ...jobData.location.address, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Salary Section */}
              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    value={jobData.salary.min}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    value={jobData.salary.max}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    placeholder="80000"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Currency
                  </label>
                  <select
                    value={jobData.salary.currency}
                    onChange={(e) => handleSalaryChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="Rs.">Rs.</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Period
                  </label>
                  <select
                    value={jobData.salary.period}
                    onChange={(e) => handleSalaryChange('period', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className="rounded-lg border p-6 bg-white border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Job Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Job Description *
                  </label>
                  <textarea
                    required
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Required Skills
                  </label>
                  {jobData.requirements.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...jobData.requirements.skills];
                          newSkills[index] = e.target.value;
                          handleInputChange('requirements', { ...jobData.requirements, skills: newSkills });
                        }}
                        placeholder="e.g., React, Node.js, Python"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                      {jobData.requirements.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = jobData.requirements.skills.filter((_, i) => i !== index);
                            handleInputChange('requirements', { ...jobData.requirements, skills: newSkills });
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = [...jobData.requirements.skills, ''];
                      handleInputChange('requirements', { ...jobData.requirements, skills: newSkills });
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Benefits & Final Details */}
          {currentStep === 3 && (
            <div className="rounded-lg border p-6 bg-white border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Benefits & Final Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Benefits & Perks
                  </label>
                  {jobData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                        placeholder="e.g., Health insurance, 401(k) matching"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                      {jobData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('benefits', index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('benefits')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Benefit
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={jobData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                </div>

                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h3 className="text-sm font-medium mb-2 text-blue-900">Review Your Job Posting</h3>
                  <div className="text-sm space-y-1 text-blue-700">
                    <p><strong>Title:</strong> {jobData.title}</p>
                    <p><strong>Category:</strong> {jobData.category}</p>
                    <p><strong>Type:</strong> {jobData.type}</p>
                    <p><strong>Location:</strong> {jobData.location.type} - {jobData.location.address.city}, {jobData.location.address.state}</p>
                    {jobData.salary.min && jobData.salary.max && (
                      <p><strong>Salary:</strong> {jobData.salary.min} - {jobData.salary.max} {jobData.salary.currency} ({jobData.salary.period})</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Posting...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob; 