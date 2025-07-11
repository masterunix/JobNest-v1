import React, { useState } from 'react';
import { 
  Plus,
  X
} from 'lucide-react';
import { useMode } from '../contexts/ModeContext';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    experience: '',
    description: '',
    requirements: [''],
    benefits: [''],
    skills: [''],
    contactEmail: '',
    applicationDeadline: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { isDarkMode } = useMode();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit to the backend
    console.log('Job data:', jobData);
    alert('Job posted successfully!');
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Post a Job</h1>
          <p className={`transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Create a new job listing to attract top talent</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Step {currentStep} of {totalSteps}
            </span>
            <span className={`text-sm transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className={`w-full rounded-full h-2 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your company name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA or Remote"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Job Type *
                  </label>
                  <select
                    required
                    value={jobData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={jobData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g., 3-5 years"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={jobData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="hr@company.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    value={jobData.salary.min}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    placeholder="50000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    value={jobData.salary.max}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    placeholder="80000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Currency
                  </label>
                  <select
                    value={jobData.salary.currency}
                    onChange={(e) => handleSalaryChange('currency', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Job Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Job Description *
                  </label>
                  <textarea
                    required
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Requirements
                  </label>
                  {jobData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                        placeholder="e.g., 3+ years of React experience"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                      />
                      {jobData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('requirements', index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('requirements')}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </button>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Required Skills
                  </label>
                  {jobData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                        placeholder="e.g., React, Node.js, Python"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                      />
                      {jobData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('skills', index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('skills')}
                    className="btn-secondary px-4 py-2 text-sm"
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
            <div className={`rounded-lg border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Benefits & Final Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Benefits & Perks
                  </label>
                  {jobData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                        placeholder="e.g., Health insurance, 401(k) matching"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
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
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Benefit
                  </button>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={jobData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <div className={`border rounded-lg p-4 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-900'
                  }`}>Review Your Job Posting</h3>
                  <div className={`text-sm space-y-1 transition-colors duration-200 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    <p><strong>Title:</strong> {jobData.title}</p>
                    <p><strong>Company:</strong> {jobData.company}</p>
                    <p><strong>Location:</strong> {jobData.location}</p>
                    <p><strong>Type:</strong> {jobData.type}</p>
                    {jobData.salary.min && jobData.salary.max && (
                      <p><strong>Salary:</strong> {jobData.salary.min} - {jobData.salary.max} {jobData.salary.currency}</p>
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
              className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-6 py-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary px-8 py-2"
                >
                  Post Job
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