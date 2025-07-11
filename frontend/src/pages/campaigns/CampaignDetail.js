import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMode } from '../../contexts/ModeContext';
import { campaignAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const CampaignDetail = () => {
  const { id } = useParams();
  const { isDarkMode } = useMode();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contribName, setContribName] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await campaignAPI.getCampaign(id);
        if (response.data.success) {
          setCampaign(response.data.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div className={`max-w-2xl mx-auto py-16 text-center transition-colors duration-200 ${
      isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>Loading campaign...</div>;
  }
  if (notFound || !campaign) {
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

  const handleRazorpay = async () => {
    setError('');
    if (!contribName.trim() || !contribAmount || isNaN(contribAmount) || Number(contribAmount) <= 0) {
      setError('Please enter a valid name and amount.');
      return;
    }
    try {
      const { data } = await campaignAPI.createRazorpayOrder(campaign._id, { amount: contribAmount });
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: campaign.title,
        description: campaign.story,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await campaignAPI.verifyRazorpayPayment(campaign._id, {
              ...response,
              amount: contribAmount,
            });
            toast.success('Thank you for your contribution!');
            setShowModal(false);
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: contribName,
          email: user?.email,
        },
        theme: { color: '#3399cc' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
    }
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
              }`}>₹{campaign.raised.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span> raised</span>
              <span>Goal: ₹{campaign.goal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
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
                  }`}>₹{contrib.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
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
                    }`}>Amount (INR)</label>
                    <input
                      type="number"
                      value={contribAmount}
                      onChange={e => setContribAmount(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., 500"
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <button type="button" onClick={handleRazorpay} className="btn-primary w-full">
                    Pay with Razorpay
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Payments are processed securely via Razorpay in INR.</p>
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
                      <p>Amount: ₹{contribAmount}</p>
                    </div>
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