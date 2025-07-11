import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMode } from '../../contexts/ModeContext';

const mockCampaigns = [
  {
    id: 1,
    title: 'Build a School in Kenya',
    category: 'Education',
    goal: 20000,
    raised: 12000,
    deadline: '2024-08-30',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    story: 'Help us build a school for children in rural Kenya. Your support will provide classrooms, books, and hope.',
    contributors: [
      { name: 'Alice', amount: 1000 },
      { name: 'Bob', amount: 500 },
      { name: 'Charlie', amount: 2000 },
      { name: 'Dana', amount: 800 },
    ]
  },
  {
    id: 2,
    title: 'Clean Water for All',
    category: 'Social Impact',
    goal: 10000,
    raised: 9500,
    deadline: '2024-07-15',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    story: 'Join us in bringing clean water to remote villages. Every dollar helps save lives.',
    contributors: [
      { name: 'Eve', amount: 2000 },
      { name: 'Frank', amount: 1500 },
      { name: 'Grace', amount: 3000 },
    ]
  }
];

const CampaignDetail = () => {
  const { id } = useParams();
  const { isDarkMode } = useMode();
  const [campaign, setCampaign] = useState(
    mockCampaigns.find(c => c.id === Number(id))
  );
  const [showModal, setShowModal] = useState(false);
  const [contribName, setContribName] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  if (!campaign) {
    return <div className={`max-w-2xl mx-auto py-16 text-center transition-colors duration-200 ${
      isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>Campaign not found.</div>;
  }

  const percent = Math.round((campaign.raised / campaign.goal) * 100);

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`Support the campaign: ${campaign?.title}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = () => {
    setShowModal(true);
    setModalStep(1);
    setContribName('');
    setContribAmount('');
    setError('');
  };

  const handleContribute = (e) => {
    e.preventDefault();
    setError('');
    const amount = Number(contribAmount);
    if (!contribName.trim() || !amount || amount <= 0) {
      setError('Please enter a valid name and amount.');
      return;
    }
    setModalStep(2); // Go to payment step
  };

  const handlePayment = (method) => {
    // Simulate payment success
    setCampaign(prev => ({
      ...prev,
      raised: prev.raised + Number(contribAmount),
      contributors: [
        ...prev.contributors,
        { name: contribName, amount: Number(contribAmount), method }
      ]
    }));
    setShowModal(false);
    setModalStep(1);
    setContribName('');
    setContribAmount('');
    toast.success('Thank you for your contribution!');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className={`rounded-lg shadow border p-6 mb-8 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <img src={campaign.image} alt={campaign.title} className="rounded-lg mb-6 w-full h-64 object-cover" />
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{campaign.title}</h1>
          <div className={`text-sm mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{campaign.category}</div>
          <div className={`mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>{campaign.story}</div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <div className={`w-full rounded-full h-3 mr-2 transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="bg-primary-600 h-3 rounded-full"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>{percent}%</span>
            </div>
            <div className={`flex justify-between text-sm transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span><span className={`font-semibold transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-primary-700'
              }`}>${campaign.raised.toLocaleString()}</span> raised</span>
              <span>Goal: ${campaign.goal.toLocaleString()}</span>
              <span>Deadline: {campaign.deadline}</span>
            </div>
          </div>
          <button className="btn-primary px-6 py-2 rounded text-white font-semibold mt-4" onClick={openModal}>Contribute</button>
          {/* Share Section */}
          <div className="mt-8">
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Share this campaign</h3>
            <div className="flex gap-3 flex-wrap">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-blue-400 text-white text-sm font-medium hover:bg-blue-500"
              >
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-green-500 text-white text-sm font-medium hover:bg-green-600"
              >
                WhatsApp
              </a>
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
        <div className={`rounded-lg shadow border p-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Contributors</h2>
          {campaign.contributors.length === 0 ? (
            <div className={`transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>No contributors yet.</div>
          ) : (
            <ul className={`divide-y transition-colors duration-200 ${
              isDarkMode ? 'divide-gray-700' : 'divide-gray-100'
            }`}>
              {campaign.contributors.map((contrib, idx) => (
                <li key={idx} className="py-2 flex justify-between items-center">
                  <span className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{contrib.name}</span>
                  <span className={`font-semibold transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-primary-700'
                  }`}>${contrib.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Contribute Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`rounded-lg shadow-lg p-8 w-full max-w-md relative transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <button className={`absolute top-2 right-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`} onClick={() => setShowModal(false)}>&times;</button>
              <h3 className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Contribute to {campaign.title}</h3>
              {modalStep === 1 && (
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Your Name</label>
                    <input
                      type="text"
                      value={contribName}
                      onChange={e => setContribName(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Jane Doe"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Amount (USD)</label>
                    <input
                      type="number"
                      value={contribAmount}
                      onChange={e => setContribAmount(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., 50"
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <button type="submit" className="btn-primary w-full">Continue to Payment</button>
                </form>
              )}
              {modalStep === 2 && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h4 className={`font-medium mb-2 transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Contribution Summary</h4>
                    <div className={`text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <p>Name: {contribName}</p>
                      <p>Amount: ${contribAmount}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePayment('card')}
                      className="w-full btn-primary"
                    >
                      Pay with Card
                    </button>
                    <button
                      onClick={() => handlePayment('paypal')}
                      className="w-full btn-secondary"
                    >
                      Pay with PayPal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail; 