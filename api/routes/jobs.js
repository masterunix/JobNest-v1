const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn([
    'technology', 'healthcare', 'finance', 'education', 'marketing',
    'sales', 'design', 'engineering', 'operations', 'other'
  ]).withMessage('Invalid category'),
  query('location').optional().isIn(['remote', 'onsite', 'hybrid']).withMessage('Invalid location type'),
  query('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance']).withMessage('Invalid job type'),
  query('experience').optional().isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      location,
      type,
      experience,
      search,
      minSalary,
      maxSalary,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (location) filter['location.type'] = location;
    if (type) filter.type = type;
    if (experience) filter['requirements.experience'] = experience;
    if (minSalary) filter['salary.min'] = { $gte: parseInt(minSalary) };
    if (maxSalary) filter['salary.max'] = { $lte: parseInt(maxSalary) };
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .populate('employer', 'firstName lastName email company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNextPage: skip + jobs.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a specific job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'firstName lastName email company')
      .populate('applications.applicant', 'firstName lastName email profile');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employers only)
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Job title must be between 5 and 100 characters'),
  body('description').isLength({ min: 50 }).withMessage('Job description must be at least 50 characters'),
  body('company.name').trim().notEmpty().withMessage('Company name is required'),
  body('requirements.experience').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('location.type').isIn(['remote', 'onsite', 'hybrid']).withMessage('Invalid location type'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('type').isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance']).withMessage('Invalid job type'),
  body('category').isIn([
    'technology', 'healthcare', 'finance', 'education', 'marketing',
    'sales', 'design', 'engineering', 'operations', 'other'
  ]).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Use authenticated user
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can create job postings'
      });
    }

    const jobData = {
      ...req.body,
      employer: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate('employer', 'firstName lastName email company');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: populatedJob
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job posting
// @access  Private (Job owner only)
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // In a real app, verify the user owns this job
    const employerId = req.headers['user-id'];
    if (job.employer.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employer', 'firstName lastName email company');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting
// @access  Private (Job owner only)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // In a real app, verify the user owns this job
    const employerId = req.headers['user-id'];
    if (job.employer.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (Job seekers only)
router.post('/:id/apply', [
  body('coverLetter').optional().isLength({ max: 1000 }).withMessage('Cover letter cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // In a real app, get applicant ID from JWT token
    const applicantId = req.headers['user-id'];
    
    if (!applicantId) {
      return res.status(401).json({
        success: false,
        message: 'Applicant ID is required'
      });
    }

    // Verify the user is a job seeker
    const applicant = await User.findById(applicantId);
    if (!applicant || applicant.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can apply for jobs'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.applicant.toString() === applicantId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const applicationData = {
      applicant: applicantId,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume
    };

    await job.addApplication(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/admin
// @desc    List all jobs (admin only)
// @access  Admin
router.get('/admin', auth, admin, async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'firstName lastName email company');
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Admin list jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id/admin
// @desc    Edit any job (admin only)
// @access  Admin
router.put('/:id/admin', auth, admin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    console.error('Admin edit job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id/admin
// @desc    Delete any job (admin only)
// @access  Admin
router.delete('/:id/admin', auth, admin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('Admin delete job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 