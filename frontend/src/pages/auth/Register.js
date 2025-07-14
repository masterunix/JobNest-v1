import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { User, Eye, EyeOff, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMode } from '../../contexts/ModeContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('jobseeker');
  const [company, setCompany] = useState({ name: '', website: '', industry: '' });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { mode, isDarkMode } = useMode();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  React.useEffect(() => {
    setRole(mode === 'company' ? 'employer' : 'jobseeker');
  }, [mode]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        role,
        ...(role === 'employer' ? { company } : {}),
      };
      const result = await registerUser(formData);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create your account
          </h2>
          <p className={`mt-2 text-center text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Role Selection */}
        <div className={`p-4 rounded-lg border transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <label
            className={`block text-sm font-medium mb-3 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('jobseeker')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                role === 'jobseeker'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:border-gray-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                role === 'employer'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:border-gray-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Employer</span>
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={`block text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="First name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className={`block text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Last name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            {/* Company fields for employer */}
            {role === 'employer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium transition-colors duration-200">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={company.name}
                    onChange={e => setCompany(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium transition-colors duration-200">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={company.website}
                    onChange={e => setCompany(prev => ({ ...prev, website: e.target.value }))}
                    className="input"
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium transition-colors duration-200">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={company.industry}
                    onChange={e => setCompany(prev => ({ ...prev, industry: e.target.value }))}
                    className="input"
                    placeholder="e.g., Technology"
                  />
                </div>

              </div>
            )}

            <div>
              <label htmlFor="email" className={`block text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  City
                </label>
                <input
                  type="text"
                  {...register('location.city')}
                  className="input"
                  placeholder="City"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  State
                </label>
                <input
                  type="text"
                  {...register('location.state')}
                  className="input"
                  placeholder="State"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Country
                </label>
                <select
                  {...register('location.country')}
                  className="input bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-400'
                    }`} />
                  ) : (
                    <Eye className={`h-5 w-5 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-400'
                    }`} />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`h-5 w-5 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-400'
                    }`} />
                  ) : (
                    <Eye className={`h-5 w-5 transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-400'
                    }`} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-primary-600"
            />
            <label htmlFor="agree-terms" className={`ml-2 block text-sm transition-colors duration-200 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              I agree to the{' '}
              <Link
                to="/terms"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Create account
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className={`text-sm transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 