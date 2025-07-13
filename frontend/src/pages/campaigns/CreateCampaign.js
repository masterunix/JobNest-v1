import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI } from '../../utils/api';

const categories = [
  'Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other'
];

const totalSteps = 4;

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    goal: '',
    deadline: '',
    category: '',
    media: null,
    story: ''
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Validation logic
  const validate = (fields = form) => {
    const errs = {};
    if (!fields.title || fields.title.trim().length < 5 || fields.title.trim().length > 120) {
      errs.title = 'Title must be 5-120 characters.';
    }
    if (!fields.goal || isNaN(fields.goal) || Number(fields.goal) < 1) {
      errs.goal = 'Goal must be a positive number.';
    }
    if (!fields.deadline) {
      errs.deadline = 'Deadline is required.';
    }
    if (!fields.category) {
      errs.category = 'Category is required.';
    }
    if (!fields.story || fields.story.trim().length < 20) {
      errs.story = 'Story must be at least 20 characters.';
    }
    return errs;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate({ ...form, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, media: file }));
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMediaPreview(null);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called', form);
    setTouched({ title: true, goal: true, deadline: true, category: true, story: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    let errorMsg = '';
    try {
      // Prepare campaign data for backend
      const campaignData = {
        title: form.title,
        category: form.category,
        goal: parseFloat(form.goal),
        deadline: form.deadline,
        story: form.story
      };
      // Send to backend
      const response = await campaignAPI.createCampaign(campaignData);
      if (response.data.success) {
        const campaignId = response.data.data._id;
        // If media file is selected, upload it
        if (form.media) {
          try {
            await campaignAPI.uploadCampaignMedia(campaignId, form.media);
          } catch (uploadErr) {
            alert('Campaign created, but failed to upload image/video.');
            navigate('/campaigns');
            return;
          }
        }
        alert('Campaign created successfully!');
        navigate('/campaigns');
      } else {
        errorMsg = response.data.message || 'Error creating campaign.';
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        // Print validation errors from backend
        alert('Validation errors: ' + JSON.stringify(error.response.data.errors));
      } else if (error.response && error.response.status === 401) {
        errorMsg = 'You must be logged in as an employer to create a campaign.';
        alert(errorMsg);
      } else if (error.response && error.response.status === 403) {
        errorMsg = 'You do not have permission to create a campaign.';
        alert(errorMsg);
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
        alert(errorMsg);
      } else {
        errorMsg = 'Error creating campaign. Please try again.';
        alert(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create a Campaign</h1>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Show validation errors at the top */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              <strong>Validation Errors:</strong>
              <ul className="list-disc ml-5">
                {Object.entries(errors).map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Basic Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  onBlur={() => handleBlur('title')}
                  className="input w-full"
                  placeholder="e.g., Help Build a School"
                />
                {touched.title && errors.title && (
                  <div className="text-red-500 text-xs mt-1">{errors.title}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  className="input w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <div className="text-red-500 text-xs mt-1">{errors.category}</div>
                )}
              </div>
            </div>
          )}
          {/* Step 2: Goal & Deadline */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Goal & Deadline</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Goal Amount (USD) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.goal}
                  onChange={e => handleChange('goal', e.target.value)}
                  onBlur={() => handleBlur('goal')}
                  className="input w-full"
                  placeholder="e.g., 10000"
                />
                {touched.goal && errors.goal && (
                  <div className="text-red-500 text-xs mt-1">{errors.goal}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.deadline}
                  onChange={e => handleChange('deadline', e.target.value)}
                  onBlur={() => handleBlur('deadline')}
                  className="input w-full"
                />
                {touched.deadline && errors.deadline && (
                  <div className="text-red-500 text-xs mt-1">{errors.deadline}</div>
                )}
              </div>
            </div>
          )}
          {/* Step 3: Media & Story */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Media & Story</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Upload Image/Video</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="w-full"
                />
                {mediaPreview && (
                  <div className="mt-2">
                    {form.media && form.media.type.startsWith('image') ? (
                      <img src={mediaPreview} alt="Preview" className="max-h-40 rounded" />
                    ) : (
                      <video src={mediaPreview} controls className="max-h-40 rounded" />
                    )}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Campaign Story *</label>
                <textarea
                  required
                  value={form.story}
                  onChange={e => handleChange('story', e.target.value)}
                  onBlur={() => handleBlur('story')}
                  rows={6}
                  className="input w-full"
                  placeholder="Share the story behind your campaign..."
                />
                {touched.story && errors.story && (
                  <div className="text-red-500 text-xs mt-1">{errors.story}</div>
                )}
              </div>
            </div>
          )}
          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Review Your Campaign</h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div><strong>Title:</strong> {form.title}</div>
                <div><strong>Category:</strong> {form.category}</div>
                <div><strong>Goal:</strong> ${form.goal}</div>
                <div><strong>Deadline:</strong> {form.deadline}</div>
                <div><strong>Story:</strong> <br />{form.story}</div>
              </div>
              {mediaPreview && (
                <div className="mt-4">
                  {form.media && form.media.type.startsWith('image') ? (
                    <img src={mediaPreview} alt="Preview" className="max-h-40 rounded" />
                  ) : (
                    <video src={mediaPreview} controls className="max-h-40 rounded" />
                  )}
                </div>
              )}
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign; 