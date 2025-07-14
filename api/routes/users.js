const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid phone number'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('profile.experience').optional().isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('company.size').optional().isIn(['startup', 'small', 'medium', 'large', 'enterprise']).withMessage('Invalid company size')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = req.user;

    // Update user fields
    const updateFields = ['firstName', 'lastName', 'phone', 'location', 'profile', 'company'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/applications
// @desc    Get user's job applications
// @access  Private (Job seekers only)
router.get('/applications', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can view applications'
      });
    }

    // Find jobs where user has applied
    const Job = require('../models/Job');
    const applications = await Job.find({
      'applications.applicant': user._id
    })
    .populate('employer', 'firstName lastName email company')
    .select('title company applications status createdAt location salary')
    .lean();

    // Format the response for frontend
    const userApplications = applications.map(job => {
      const userApplication = job.applications.find(
        app => app.applicant.toString() === user._id.toString()
      );
      return {
        id: job._id,
        jobTitle: job.title,
        company: job.company?.name || 'Company',
        appliedDate: userApplication?.appliedAt ? new Date(userApplication.appliedAt).toLocaleDateString() : 'N/A',
        location: job.location?.address?.city && job.location?.address?.state 
          ? `${job.location.address.city}, ${job.location.address.state}`
          : job.location?.address?.city 
          ? job.location.address.city
          : job.location?.type 
          ? job.location.type.charAt(0).toUpperCase() + job.location.type.slice(1)
          : 'Location not specified',
        salary: job.salary?.min && job.salary?.max 
          ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
          : job.salary?.min 
          ? `${job.salary.min.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
          : job.salary?.max 
          ? `${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
          : 'Salary not specified',
        status: userApplication?.status || 'pending',
        applicationId: userApplication?._id,
        coverLetter: userApplication?.coverLetter || '',
        resume: userApplication?.resume || '',
        notes: userApplication?.notes || '',
      };
    });

    res.json({
      success: true,
      applications: userApplications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/profile/completion
// @desc    Get user profile completion percentage
// @access  Private
router.get('/profile/completion', auth, async (req, res) => {
  try {
    const user = req.user;
    let completion = 0;
    let totalFields = 0;
    let completedFields = 0;

    // Basic profile fields
    totalFields += 4; // firstName, lastName, email, phone
    if (user.firstName && user.firstName.trim()) completedFields++;
    if (user.lastName && user.lastName.trim()) completedFields++;
    if (user.email && user.email.trim()) completedFields++;
    if (user.phone && user.phone.trim()) completedFields++;

    // Location fields
    totalFields += 3; // city, state, country
    if (user.location?.city && user.location.city.trim()) completedFields++;
    if (user.location?.state && user.location.state.trim()) completedFields++;
    if (user.location?.country && user.location.country.trim()) completedFields++;

    // Profile fields (for job seekers)
    if (user.role === 'jobseeker') {
      totalFields += 3; // bio, skills, experience
      if (user.profile?.bio && user.profile.bio.trim()) completedFields++;
      if (user.profile?.skills && user.profile.skills.length > 0) completedFields++;
      if (user.profile?.experience) completedFields++;
    }

    // Company fields (for employers)
    if (user.role === 'employer') {
      totalFields += 3; // company name, website, industry
      if (user.company?.name && user.company.name.trim()) completedFields++;
      if (user.company?.website && user.company.website.trim()) completedFields++;
      if (user.company?.industry && user.company.industry.trim()) completedFields++;
    }

    completion = Math.round((completedFields / totalFields) * 100);

    res.json({
      success: true,
      completion
    });

  } catch (error) {
    console.error('Get profile completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/jobs
// @desc    Get employer's job postings
// @access  Private (Employers only)
router.get('/jobs', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can view their job postings'
      });
    }

    const Job = require('../models/Job');
    const jobs = await Job.find({ employer: user._id })
      .populate('applications.applicant', 'firstName lastName email phone profile')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/jobs/:jobId/applications/:applicationId
// @desc    Update application status (for employers)
// @access  Private (Job owner only)
router.put('/jobs/:jobId/applications/:applicationId', auth, [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { jobId, applicationId } = req.params;
    const { status } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const Job = require('../models/Job');
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Verify the user owns this job
    if (job.employer.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    await job.updateApplicationStatus(applicationId, status);

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/companies
// @desc    List all companies (employers)
// @access  Public
router.get('/companies', async (req, res) => {
  try {
    const companies = await User.find({ role: 'employer', 'company.name': { $exists: true, $ne: '' } })
      .select('company firstName lastName email location profile');
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    List all users (admin only)
// @access  Admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Edit any user (admin only)
// @access  Admin
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Admin edit user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete any user (admin only)
// @access  Admin
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 