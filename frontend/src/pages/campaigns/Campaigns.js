import React, { useState } from 'react';

const mockCampaigns = [
  {
    id: 1,
    title: 'Build a School in Kenya',
    category: 'Education',
    goal: 20000,
    raised: 12000,
    deadline: '2024-08-30',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    trending: true,
    createdAt: '2024-06-01',
    contributors: 120
  },
  {
    id: 2,
    title: 'Clean Water for All',
    category: 'Social Impact',
    goal: 10000,
    raised: 9500,
    deadline: '2024-07-15',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    trending: true,
    createdAt: '2024-06-10',
    contributors: 80
  },
  {
    id: 3,
    title: 'Art for Change',
    category: 'Arts',
    goal: 5000,
    raised: 3000,
    deadline: '2024-09-01',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    trending: false,
    createdAt: '2024-05-20',
    contributors: 40
  },
  {
    id: 4,
    title: 'Tech for Rural Youth',
    category: 'Tech',
    goal: 15000,
    raised: 4000,
    deadline: '2024-08-10',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    trending: false,
    createdAt: '2024-06-15',
    contributors: 25
  }
];

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
  const [sortBy, setSortBy] = useState('trending');

  let filtered = mockCampaigns;
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Campaigns</h1>
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
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
            <div key={campaign.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col">
              <img src={campaign.image} alt={campaign.title} className="rounded-lg mb-4 h-40 w-full object-cover" />
              <h2 className="text-lg font-semibold mb-1">{campaign.title}</h2>
              <div className="text-xs text-gray-500 mb-2">{campaign.category}</div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.round((campaign.raised / campaign.goal) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round((campaign.raised / campaign.goal) * 100)}%
                </span>
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium text-primary-700">${campaign.raised.toLocaleString()}</span> raised of ${campaign.goal.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {campaign.contributors} contributors
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Deadline: {campaign.deadline}
              </div>
              <a
                href={`/campaigns/${campaign.id}`}
                className="mt-auto btn-primary px-4 py-2 rounded text-center text-white block"
              >
                View Campaign
              </a>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-12">No campaigns found.</div>
        )}
      </div>
    </div>
  );
};

export default Campaigns; 