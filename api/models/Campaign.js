const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  goal: {
    type: Number,
    required: true,
    min: 1
  },
  raised: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other'
    ]
  },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' }
  }],
  story: {
    type: String,
    required: true,
    minlength: 20
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'closed'],
    default: 'pending'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contributionsCount: {
    type: Number,
    default: 0
  },
  trending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

campaignSchema.index({ title: 'text', story: 'text', category: 1 });

module.exports = mongoose.model('Campaign', campaignSchema); 