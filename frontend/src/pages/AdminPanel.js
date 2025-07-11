import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API = {
  users: '/api/users',
  jobs: '/api/jobs/admin',
  campaigns: '/api/campaigns/admin',
};

const AdminPanel = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({ users: [], jobs: [], campaigns: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState('');
  const [editForm, setEditForm] = useState({});

  // Helper to fetch data
  const fetchData = async (type) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API[type], {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => ({ ...prev, [type]: res.data[type] || res.data.data || [] }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  // Edit handlers
  const handleEdit = (item, type) => {
    setEditItem(item);
    setEditType(type);
    setEditForm(item);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = async () => {
    setLoading(true);
    setError('');
    try {
      let url = API[editType] + '/' + editItem._id;
      if (editType !== 'users') url += '/admin';
      await axios.put(url, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditItem(null);
      fetchData(editType);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };
  // Delete handlers
  const handleDelete = async (item, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    setError('');
    try {
      let url = API[type] + '/' + item._id;
      if (type !== 'users') url += '/admin';
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(type);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
      </div>
      {loading && <div className="mb-4 text-blue-600">Loading...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div>
        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u._id}>
                    <td className="border px-2 py-1">{u.firstName} {u.lastName}</td>
                    <td className="border px-2 py-1">{u.email}</td>
                    <td className="border px-2 py-1">{u.role}</td>
                    <td className="border px-2 py-1">
                      <button className="text-blue-600 mr-2" onClick={() => handleEdit(u, 'users')}>Edit</button>
                      <button className="text-red-600" onClick={() => handleDelete(u, 'users')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* JOBS */}
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Jobs</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Company</th>
                  <th className="border px-2 py-1">Employer</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.map((j) => (
                  <tr key={j._id}>
                    <td className="border px-2 py-1">{j.title}</td>
                    <td className="border px-2 py-1">{j.company?.name}</td>
                    <td className="border px-2 py-1">{j.employer?.firstName} {j.employer?.lastName}</td>
                    <td className="border px-2 py-1">
                      <button className="text-blue-600 mr-2" onClick={() => handleEdit(j, 'jobs')}>Edit</button>
                      <button className="text-red-600" onClick={() => handleDelete(j, 'jobs')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Campaigns</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Owner</th>
                  <th className="border px-2 py-1">Goal</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((c) => (
                  <tr key={c._id}>
                    <td className="border px-2 py-1">{c.title}</td>
                    <td className="border px-2 py-1">{c.owner?.firstName} {c.owner?.lastName}</td>
                    <td className="border px-2 py-1">{c.goal}</td>
                    <td className="border px-2 py-1">
                      <button className="text-blue-600 mr-2" onClick={() => handleEdit(c, 'campaigns')}>Edit</button>
                      <button className="text-red-600" onClick={() => handleDelete(c, 'campaigns')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px] max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">Edit {editType.slice(0, -1).toUpperCase()}</h3>
              <form onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                {editType === 'users'
                  ? ['firstName', 'lastName', 'email', 'role'].map((key) => (
                      <div className="mb-2" key={key}>
                        <label className="block text-sm font-medium mb-1">{key}</label>
                        {key === 'role' ? (
                          <select
                            className="w-full border px-2 py-1 rounded"
                            name="role"
                            value={editForm.role ?? ''}
                            onChange={handleEditChange}
                          >
                            <option value="admin">admin</option>
                            <option value="employer">employer</option>
                            <option value="jobseeker">jobseeker</option>
                            <option value="owner">owner</option>
                            <option value="backer">backer</option>
                          </select>
                        ) : (
                          <input
                            className="w-full border px-2 py-1 rounded"
                            name={key}
                            value={editForm[key] ?? ''}
                            onChange={handleEditChange}
                          />
                        )}
                      </div>
                    ))
                  : Object.keys(editForm).map((key) => (
                      key !== '_id' && (
                        <div className="mb-2" key={key}>
                          <label className="block text-sm font-medium mb-1">{key}</label>
                          <input
                            className="w-full border px-2 py-1 rounded"
                            name={key}
                            value={editForm[key] ?? ''}
                            onChange={handleEditChange}
                          />
                        </div>
                      )
                    ))}
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditItem(null)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 