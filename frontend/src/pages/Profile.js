import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import { 
  Save,
  Edit,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    profile: {
      bio: '',
      skills: [],
      experience: 'mid'
    },
    company: {
      name: '',
      website: '',
      industry: '',
      size: 'small'
    }
  });

  // Load user data from API
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getProfile();
        if (response.data.success) {
          const userData = response.data.data;
          setProfile({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || { city: '', state: '', country: '' },
            profile: {
              bio: userData.profile?.bio || '',
              skills: userData.profile?.skills || [],
              experience: userData.profile?.experience || 'mid'
            },
            company: userData.company || {
              name: '',
              website: '',
              industry: '',
              size: 'small'
            }
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(profile);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && !profile.profile.skills.includes(newSkill)) {
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, newSkill]
        }
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-lg">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your professional information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary px-4 py-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
              <input
                type="text"
                value={profile.location.city}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, city: e.target.value }
                }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
              <input
                type="text"
                value={profile.location.state}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, state: e.target.value }
                }))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              value={profile.profile.bio}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                profile: { ...prev.profile, bio: e.target.value }
              }))}
              disabled={!isEditing}
              rows={4}
              className="input w-full"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Only show experience and skills for jobseekers */}
          {user?.role === 'jobseeker' && (
            <>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                <select
                  value={profile.profile.experience}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    profile: { ...prev.profile, experience: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="input w-full"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </button>
                )}
              </div>
            </>
          )}

          {/* Company Info for employers */}
          {user?.role === 'employer' && (
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={profile.company.name}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      company: { ...prev.company, name: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                  <input
                    type="text"
                    value={profile.company.website}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      company: { ...prev.company, website: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                  <input
                    type="text"
                    value={profile.company.industry}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      company: { ...prev.company, industry: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    value={profile.location.country}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save button for all info */}
          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="btn-primary px-6 py-2 text-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary px-6 py-2"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 