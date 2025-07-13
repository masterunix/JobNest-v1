import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (user && (user._id || user.id)) {
      config.headers['user-id'] = user._id || user.id;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Job API functions
export const jobAPI = {
  // Get all jobs with filters
  getJobs: (params = {}) => api.get('/jobs', { params }),
  
  // Get single job
  getJob: (id) => api.get(`/jobs/${id}`),
  
  // Create job (employers only)
  createJob: (data) => api.post('/jobs', data),
  
  // Update job
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  
  // Delete job
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  
  // Apply for job
  applyForJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
  getApplicationsForUser: () => api.get('/users/applications'),
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update profile
  updateProfile: (data) => api.put('/users/profile', data),
  
  // Change password
  changePassword: (data) => api.put('/users/password', data),
  
  // Get user applications
  getApplications: () => api.get('/users/applications'),
  
  // Get employer jobs
  getEmployerJobs: () => api.get('/users/jobs'),
  
  // Update application status
  updateApplicationStatus: (jobId, applicationId, status) => 
    api.put(`/users/jobs/${jobId}/applications/${applicationId}`, { status }),
  getProfileCompletion: () => api.get('/users/profile/completion'),
};

// Auth API functions
export const authAPI = {
  // Register
  register: (data) => api.post('/auth/register', data),
  
  // Login
  login: (data) => api.post('/auth/login', data),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// Campaign API functions
export const campaignAPI = {
  // Get all campaigns
  getCampaigns: (params = {}) => api.get('/campaigns', { params }),

  // Get single campaign
  getCampaign: (id) => api.get(`/campaigns/${id}`),

  // Create campaign
  createCampaign: (data) => api.post('/campaigns', data),

  // Razorpay integration
  createRazorpayOrder: (campaignId, data) => api.post(`/campaigns/${campaignId}/razorpay-order`, data),
  verifyRazorpayPayment: (campaignId, data) => api.post(`/campaigns/${campaignId}/razorpay-verify`, data),

  // Update campaign
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),

  // Delete campaign
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),

  // Upload campaign media
  uploadCampaignMedia: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/campaigns/${id}/upload-media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api; 