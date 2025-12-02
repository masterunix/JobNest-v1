import axios from 'axios';

// API URL is already configured in axios defaults in AuthContext or index.js
// But for a service, it's good practice to be explicit or rely on the global axios instance

const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post('/auth/login', userData);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const getCurrentUser = async () => {
    const response = await axios.get('/auth/me');
    return response.data;
};

const updateProfile = async (userData) => {
    const response = await axios.put('/users/profile', userData);
    return response.data;
};

const changePassword = async (passwordData) => {
    const response = await axios.put('/users/password', passwordData);
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
};

export default authService;
