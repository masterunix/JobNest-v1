import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save,
  Edit,
  Plus
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    bio: 'Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB'],
    experience: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: 'Present',
        description: 'Led development of multiple web applications using React and Node.js. Mentored junior developers and implemented best practices.'
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        startDate: '2020-03',
        endDate: '2021-12',
        description: 'Built and maintained web applications using modern technologies. Collaborated with cross-functional teams.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }
    ],
    preferences: {
      jobType: ['Full-time', 'Remote'],
      salary: '$100,000 - $150,000',
      location: ['San Francisco, CA', 'Remote'],
      industries: ['Technology', 'Healthcare', 'Finance']
    }
  });

  const handleSave = () => {
    // Here you would typically save to the backend
    setIsEditing(false);
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your professional information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary px-4 py-2"
          >
            {isEditing ? (
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

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'experience'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'education'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        ×
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
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
              {isEditing && (
                <button className="btn-secondary px-4 py-2 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                    {isEditing && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              {isEditing && (
                <button className="btn-secondary px-4 py-2 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.location}</p>
                      <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    {isEditing && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Types</label>
                <div className="flex flex-wrap gap-2">
                  {['Full-time', 'Part-time', 'Contract', 'Remote', 'On-site', 'Hybrid'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.preferences.jobType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProfile(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                jobType: [...prev.preferences.jobType, type]
                              }
                            }));
                          } else {
                            setProfile(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                jobType: prev.preferences.jobType.filter(t => t !== type)
                              }
                            }));
                          }
                        }}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={profile.preferences.salary}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, salary: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                <input
                  type="text"
                  value={profile.preferences.location.join(', ')}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: { 
                      ...prev.preferences, 
                      location: e.target.value.split(',').map(loc => loc.trim()) 
                    }
                  }))}
                  disabled={!isEditing}
                  placeholder="Enter locations separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary px-6 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-6 py-2"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 