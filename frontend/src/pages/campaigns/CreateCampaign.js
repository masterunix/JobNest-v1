import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
    setIsSubmitting(true);
    
    try {
      // Create campaign object
      const campaignData = {
        id: Date.now(), // Simple ID generation
        title: form.title,
        category: form.category,
        goal: parseFloat(form.goal),
        deadline: form.deadline,
        story: form.story,
        status: 'pending',
        raised: 0,
        contributors: 0,
        createdAt: new Date().toISOString(),
        owner: 'current-user-id' // This would come from auth context
      };

      // Save to localStorage for now (in real app, this would go to backend)
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      existingCampaigns.push(campaignData);
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

      // Show success message
      alert('Campaign created successfully!');
      
      // Navigate to campaigns list
      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please try again.');
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
                  className="input w-full"
                  placeholder="e.g., Help Build a School"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  className="input w-full"
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.deadline}
                  onChange={e => handleChange('deadline', e.target.value)}
                  className="input w-full"
                />
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
                  rows={6}
                  className="input w-full"
                  placeholder="Share the story behind your campaign..."
                />
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