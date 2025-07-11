import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI } from '../../utils/api';

const categories = [
  'Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other'
];

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    goal: '',
    deadline: '',
    category: '',
    story: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const res = await campaignAPI.getCampaign(id);
        if (res.data.success) {
          const c = res.data.data;
          setForm({
            title: c.title || '',
            goal: c.goal || '',
            deadline: c.deadline ? c.deadline.slice(0, 10) : '',
            category: c.category || '',
            story: c.story || ''
          });
        } else {
          alert('Campaign not found');
          navigate('/dashboard');
        }
      } catch {
        alert('Failed to load campaign');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, [id, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, goal: true, deadline: true, category: true, story: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      const updateData = {
        title: form.title,
        category: form.category,
        goal: parseFloat(form.goal),
        deadline: form.deadline,
        story: form.story
      };
      const res = await campaignAPI.updateCampaign(id, updateData);
      if (res.data.success) {
        alert('Campaign updated successfully!');
        navigate('/dashboard');
      } else {
        alert(res.data.message || 'Error updating campaign.');
      }
    } catch (error) {
      alert('Error updating campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="max-w-2xl mx-auto py-16 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Campaign</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Goal Amount (INR) *</label>
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaign; 