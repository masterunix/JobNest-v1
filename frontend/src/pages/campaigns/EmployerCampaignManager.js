import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { campaignAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const EmployerCampaignManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !['employer', 'owner'].includes(user.role)) return;
    setLoading(true);
    campaignAPI.getCampaigns({ owner: user._id || user.id })
      .then(res => {
        setCampaigns(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load campaigns');
        setLoading(false);
      });
  }, [user]);

  const handleView = (id) => navigate(`/campaigns/${id}`);
  const handleEdit = (id) => navigate(`/campaigns/edit/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignAPI.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch {
      alert('Failed to delete campaign');
    }
  };

  if (!user || !['employer', 'owner'].includes(user.role)) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <button
          className="btn-primary px-4 py-2 rounded"
          onClick={() => navigate('/campaigns/create')}
        >
          + Create Campaign
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : campaigns.length === 0 ? (
        <div>No campaigns found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Raised</th>
                <th className="px-4 py-2">Goal</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2 font-medium">{c.title}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{Number(c.raised).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  <td className="px-4 py-2">{Number(c.goal).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  <td className="px-4 py-2">{c.deadline ? new Date(c.deadline).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="btn-secondary px-2 py-1 rounded" onClick={() => handleView(c._id)}>View</button>
                    <button className="btn-secondary px-2 py-1 rounded" onClick={() => handleEdit(c._id)}>Edit</button>
                    <button className="btn-danger px-2 py-1 rounded" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployerCampaignManager; 