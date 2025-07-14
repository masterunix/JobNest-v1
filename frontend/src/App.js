import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import CreateCampaign from './pages/campaigns/CreateCampaign';
import Campaigns from './pages/campaigns/Campaigns';
import CampaignDetail from './pages/campaigns/CampaignDetail';
import AdminPanel from './pages/AdminPanel';
import EditCampaign from './pages/campaigns/EditCampaign';
import EditJob from './pages/EditJob';
import { AuthProvider } from './contexts/AuthContext';
import { ModeProvider } from './contexts/ModeContext';
import Companies from './pages/Companies';
import SalaryGuide from './pages/SalaryGuide';
import CareerAdvice from './pages/CareerAdvice';
import Pricing from './pages/Pricing';
import RecruitingTools from './pages/RecruitingTools';
import SuccessStories from './pages/SuccessStories';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

function App() {
  return (
    <ModeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/post-job" element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                } />
                <Route path="/campaigns/create" element={
                  <ProtectedRoute allowedRoles={['employer', 'owner']}>
                    <CreateCampaign />
                  </ProtectedRoute>
                } />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/:id" element={<CampaignDetail />} />
                <Route path="/campaigns/edit/:id" element={
                  <ProtectedRoute allowedRoles={['employer', 'owner']}>
                    <EditCampaign />
                  </ProtectedRoute>
                } />
                <Route path="/jobs/edit/:id" element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EditJob />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/companies" element={<Companies />} />
                <Route path="/salary-guide" element={<SalaryGuide />} />
                <Route path="/career-advice" element={<CareerAdvice />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/recruiting-tools" element={<RecruitingTools />} />
                <Route path="/success-stories" element={<SuccessStories />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ModeProvider>
  );
}

export default App; 