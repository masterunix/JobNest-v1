const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
router.put('/profile', [
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

    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
router.put('/password', [
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

    const userId = req.headers['user-id'];
    const { currentPassword, newPassword } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
router.get('/applications', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can view applications'
      });
    }

    // Find jobs where user has applied
    const Job = require('../models/Job');
    const applications = await Job.find({
      'applications.applicant': userId
    })
    .populate('employer', 'firstName lastName email company')
    .select('title company applications status createdAt')
    .lean();

    // Format the response
    const userApplications = applications.map(job => {
      const userApplication = job.applications.find(
        app => app.applicant.toString() === userId
      );
      return {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        status: userApplication.status,
        appliedAt: userApplication.appliedAt,
        jobStatus: job.status
      };
    });

    res.json({
      success: true,
      data: userApplications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/jobs
// @desc    Get employer's job postings
// @access  Private (Employers only)
router.get('/jobs', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user ID provided.'
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can view their job postings'
      });
    }

    const Job = require('../models/Job');
    const jobs = await Job.find({ employer: userId })
      .populate('applications.applicant', 'firstName lastName email profile')
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
router.put('/jobs/:jobId/applications/:applicationId', [
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
    const userId = req.headers['user-id'];
    
    if (!userId) {
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
    if (job.employer.toString() !== userId) {
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

module.exports = router; 