const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    logo: String,
    website: String,
    industry: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    }
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Job description must be at least 50 characters']
  },
  requirements: {
    skills: [String],
    experience: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
      required: true
    },
    education: {
      type: String,
      enum: ['high-school', 'bachelor', 'master', 'phd', 'any']
    },
    certifications: [String]
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    },
    address: {
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  benefits: [String],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'technology', 'healthcare', 'finance', 'education', 'marketing',
      'sales', 'design', 'engineering', 'operations', 'other'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    coverLetter: String,
    resume: String,
    notes: String
  }],
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  deadline: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ 'location.type': 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'company.name': 1 });
jobSchema.index({ employer: 1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Method to add application
jobSchema.methods.addApplication = function(applicationData) {
  this.applications.push(applicationData);
  this.applicationsCount = this.applications.length;
  return this.save();
};

// Method to update application status
jobSchema.methods.updateApplicationStatus = function(applicationId, status) {
  const application = this.applications.id(applicationId);
  if (application) {
    application.status = status;
    return this.save();
  }
  throw new Error('Application not found');
};

// Pre-save middleware to update application count
jobSchema.pre('save', function(next) {
  this.applicationsCount = this.applications.length;
  next();
});

module.exports = mongoose.model('Job', jobSchema); 