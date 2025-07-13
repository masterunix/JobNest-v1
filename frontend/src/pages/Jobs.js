import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Building, Loader2, Settings } from 'lucide-react';
import { jobAPI } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    experience: '',
    minSalary: '',
    maxSalary: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  
  const location_router = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location_router.search);
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [location_router.search]);

  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(location && { location }),
        ...(role && { category: role }),
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type }),
        ...(filters.experience && { experience: filters.experience }),
        ...(filters.minSalary && { minSalary: filters.minSalary }),
        ...(filters.maxSalary && { maxSalary: filters.maxSalary })
      };

      const response = await jobAPI.getJobs(params);
      
      if (response.data.success) {
        setJobs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when search or filters change
  useEffect(() => {
    fetchJobs(1);
  }, [searchTerm, location, role, filters]);

  useEffect(() => {
    if (user && user.role === 'jobseeker') {
      jobAPI.getApplicationsForUser()
        .then(res => {
          const apps = res.data.applications || res.data.data || [];
          setAppliedJobIds(apps.map(app => app.id));
        })
        .catch(() => setAppliedJobIds([]));
    }
  }, [user]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  const isApplied = (jobId) => appliedJobIds.includes(jobId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="border-b bg-white border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find your next job</h1>
            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </button>
            )}
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              >
                <option value="">All Roles</option>
                <option value="engineering">Engineering</option>
                <option value="technology">Technology</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleFilterChange('type', 'remote')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                filters.type === 'remote'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
              }`}
            >
              Remote
            </button>
            <button 
              onClick={() => handleFilterChange('type', 'full-time')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                filters.type === 'full-time'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
              }`}
            >
              Full-time
            </button>
            <button 
              onClick={() => handleFilterChange('type', 'part-time')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                filters.type === 'part-time'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
              }`}
            >
              Part-time
            </button>
            <button 
              onClick={() => handleFilterChange('type', 'contract')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                filters.type === 'contract'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
              }`}
            >
              Contract
            </button>
            <button 
              onClick={() => {
                setFilters({
                  category: '',
                  type: '',
                  experience: '',
                  minSalary: '',
                  maxSalary: ''
                });
              }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-lg text-gray-600">Loading jobs...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-lg mb-4 text-red-600">{error}</p>
            <button
              onClick={() => fetchJobs(1)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Jobs Found */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg mb-4 text-gray-600">No jobs found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setLocation('');
                setRole('');
                setFilters({
                  category: '',
                  type: '',
                  experience: '',
                  minSalary: '',
                  maxSalary: ''
                });
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Job Listings */}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {jobs.length} of {pagination.totalJobs} jobs
              </p>
            </div>
            
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="rounded-lg border p-6 hover:shadow-md transition-all duration-200 bg-white border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100">
                        <Building className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 text-gray-900">{job.title}</h3>
                        <p className="mb-2 text-gray-600">{job.company?.name || job.employer?.company || 'Company'}</p>
                        
                        <div className="flex items-center space-x-4 text-sm mb-3 text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location?.city && job.location?.state 
                              ? `${job.location.city}, ${job.location.state}`
                              : job.location?.type || 'Location not specified'
                            }
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary?.min && job.salary?.max 
                              ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                              : 'Salary not specified'
                            }
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.requirements?.experience || 'Experience not specified'}
                          </div>
                        </div>

                        <p className="mb-3 text-gray-600">
                          {job.description?.substring(0, 200)}...
                        </p>
                        
                        {/* Skills */}
                        {job.requirements?.skills && job.requirements.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.requirements.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                          <div className="flex gap-2 flex-col sm:flex-row-reverse">
                            <button 
                              onClick={() => navigate(`/jobs/${job._id}`)}
                              className="btn-primary px-6 py-2 text-sm order-1"
                              disabled={isApplied(job._id)}
                            >
                              {isApplied(job._id) ? 'Applied' : 'Apply Now'}
                            </button>
                            <button 
                              onClick={() => navigate(`/jobs/${job._id}`)}
                              className="btn-secondary px-4 py-2 text-sm order-2"
                            >
                              View Job
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {pagination.currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  
                  <span className="px-4 py-2">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  {pagination.currentPage < pagination.totalPages && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs; 