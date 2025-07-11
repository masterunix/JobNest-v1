import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  'All', 'Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other'
];

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Latest', value: 'latest' },
  { label: 'Most Funded', value: 'mostFunded' }
];

const Campaigns = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [campaigns, setCampaigns] = useState([]);

  // Load campaigns from localStorage
  useEffect(() => {
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(savedCampaigns);
  }, []);

  let filtered = campaigns;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }
  if (sortBy === 'trending') {
    filtered = filtered.filter(c => c.trending).concat(filtered.filter(c => !c.trending));
  } else if (sortBy === 'latest') {
    filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'mostFunded') {
    filtered = filtered.slice().sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Explore Campaigns</h1>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  sortBy === opt.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* Campaign Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map(campaign => (
            <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 h-40 w-full flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
              </div>
              <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">{campaign.title}</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{campaign.category}</div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.round((campaign.raised / campaign.goal) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {Math.round((campaign.raised / campaign.goal) * 100)}%
                </span>
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium text-primary-700 dark:text-white">${campaign.raised.toLocaleString()}</span> raised of ${campaign.goal.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {campaign.contributors} contributors
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Deadline: {campaign.deadline}
              </div>
              <Link
                to={`/campaigns/${campaign.id}`}
                className="mt-auto btn-primary px-4 py-2 rounded text-center text-white block"
              >
                View Campaign
              </Link>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            {campaigns.length === 0 ? (
              <div>
                <p className="text-lg mb-4">No campaigns created yet.</p>
                <Link to="/campaigns/create" className="btn-primary px-6 py-2">
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <p>No campaigns found matching your filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns; 