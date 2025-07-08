import React, { useState } from 'react';

const categories = [
  'Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other'
];

const totalSteps = 4;

const CreateCampaign = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    alert('Campaign created!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Create a Campaign</h1>
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
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Help Build a School"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Goal & Deadline</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Goal Amount (USD) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.goal}
                  onChange={e => handleChange('goal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.deadline}
                  onChange={e => handleChange('deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
          {/* Step 3: Media & Story */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Media & Story</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Upload Image/Video</label>
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
                <label className="block text-sm font-medium mb-2">Campaign Story *</label>
                <textarea
                  required
                  value={form.story}
                  onChange={e => handleChange('story', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Share the story behind your campaign..."
                />
              </div>
            </div>
          )}
          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Review Your Campaign</h2>
              <div className="mb-2"><strong>Title:</strong> {form.title}</div>
              <div className="mb-2"><strong>Category:</strong> {form.category}</div>
              <div className="mb-2"><strong>Goal:</strong> ${form.goal}</div>
              <div className="mb-2"><strong>Deadline:</strong> {form.deadline}</div>
              <div className="mb-2"><strong>Story:</strong> <br />{form.story}</div>
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
                className="btn-primary px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign; 