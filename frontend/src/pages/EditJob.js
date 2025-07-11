import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../utils/api';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobAPI.getJob(id);
        if (res.data.success) {
          setJobData(res.data.data);
        } else {
          toast.error('Job not found');
          navigate('/dashboard');
        }
      } catch {
        toast.error('Failed to load job');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updateData = {
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        salary: jobData.salary,
        benefits: jobData.benefits,
        type: jobData.type,
        category: jobData.category,
        deadline: jobData.deadline,
        company: jobData.company,
      };
      const res = await jobAPI.updateJob(id, updateData);
      if (res.data.success) {
        toast.success('Job updated successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res.data.message || 'Error updating job.');
      }
    } catch (error) {
      toast.error('Error updating job.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !jobData) return <div className="max-w-2xl mx-auto py-16 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Job</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Job Title *</label>
              <input
                type="text"
                required
                value={jobData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className="input w-full"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Job Description *</label>
              <textarea
                required
                value={jobData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={6}
                className="input w-full"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
              <input
                type="text"
                required
                value={jobData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className="input w-full"
                placeholder="e.g., Engineering"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Job Type *</label>
              <input
                type="text"
                required
                value={jobData.type}
                onChange={e => handleInputChange('type', e.target.value)}
                className="input w-full"
                placeholder="e.g., Full-time"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Salary *</label>
              <input
                type="number"
                required
                value={jobData.salary?.min || ''}
                onChange={e => handleSalaryChange('min', e.target.value)}
                className="input w-full mb-2"
                placeholder="Minimum Salary"
              />
              <input
                type="number"
                required
                value={jobData.salary?.max || ''}
                onChange={e => handleSalaryChange('max', e.target.value)}
                className="input w-full"
                placeholder="Maximum Salary"
              />
            </div>
            {/* Add more fields as needed */}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-4 py-2 rounded disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob; 