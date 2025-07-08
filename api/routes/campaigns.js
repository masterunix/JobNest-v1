const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Contribution = require('../models/Contribution');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const path = require('path');

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (Owner only)
router.post('/', [
  body('title').trim().isLength({ min: 5, max: 120 }).withMessage('Title must be 5-120 chars'),
  body('goal').isNumeric().withMessage('Goal must be a number'),
  body('deadline').isISO8601().toDate().withMessage('Deadline required'),
  body('category').isIn(['Tech', 'Arts', 'Social Impact', 'Education', 'Health', 'Environment', 'Other']).withMessage('Invalid category'),
  body('story').isLength({ min: 20 }).withMessage('Story must be at least 20 chars')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    // In a real app, get owner from JWT
    const ownerId = req.headers['user-id'] || req.body.ownerId;
    if (!ownerId) return res.status(401).json({ success: false, message: 'Owner ID required' });
    const owner = await User.findById(ownerId);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
    // Only allow certain roles
    if (!['owner', 'employer'].includes(owner.role)) {
      return res.status(403).json({ success: false, message: 'Only owners/employers can create campaigns' });
    }
    const campaign = new Campaign({ ...req.body, owner: ownerId });
    await campaign.save();
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   GET /api/campaigns
// @desc    List/filter campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, trending, status, owner, q, sort = 'createdAt', order = 'desc', limit = 20, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (trending) filter.trending = trending === 'true';
    if (status) filter.status = status;
    if (owner) filter.owner = owner;
    if (q) filter.$text = { $search: q };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const campaigns = await Campaign.find(filter)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('owner', 'firstName lastName email');
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private (Owner only)
router.put('/:id', async (req, res) => {
  try {
    // In a real app, get owner from JWT
    const ownerId = req.headers['user-id'] || req.body.ownerId;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    if (campaign.owner.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    Object.assign(campaign, req.body);
    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private (Owner only)
router.delete('/:id', async (req, res) => {
  try {
    // In a real app, get owner from JWT
    const ownerId = req.headers['user-id'] || req.body.ownerId;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    if (campaign.owner.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await campaign.deleteOne();
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/contribute
// @desc    Contribute to a campaign
// @access  Private (Backer only)
router.post('/:id/contribute', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').isIn(['card', 'upi', 'paypal', 'other']).withMessage('Invalid payment method')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    // In a real app, get contributor from JWT
    const contributorId = req.headers['user-id'] || req.body.contributorId;
    if (!contributorId) return res.status(401).json({ success: false, message: 'Contributor ID required' });
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    // Only allow if campaign is approved and not closed
    if (campaign.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Campaign not open for contributions' });
    }
    const contribution = new Contribution({
      campaign: campaign._id,
      contributor: contributorId,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: 'succeeded' // Simulate success for now
    });
    await contribution.save();
    // Update campaign raised and contributors
    campaign.raised += req.body.amount;
    if (!campaign.contributors.includes(contributorId)) {
      campaign.contributors.push(contributorId);
    }
    campaign.contributionsCount += 1;
    await campaign.save();
    res.status(201).json({ success: true, data: contribution });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   GET /api/campaigns/:id/contributions
// @desc    List contributions for a campaign
// @access  Public
router.get('/:id/contributions', async (req, res) => {
  try {
    const contributions = await Contribution.find({ campaign: req.params.id })
      .populate('contributor', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: contributions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/stripe-intent
// @desc    Create a Stripe PaymentIntent for a campaign contribution
// @access  Private (Backer only)
router.post('/:id/stripe-intent', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('contributorId').notEmpty().withMessage('Contributor ID required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { amount, contributorId } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    // Only allow if campaign is approved and not closed
    if (campaign.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Campaign not open for contributions' });
    }
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        campaignId: campaign._id.toString(),
        contributorId: contributorId
      },
      description: `Contribution to campaign: ${campaign.title}`
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Stripe error', error: err.message });
  }
});

// Admin middleware (simulate with header for now)
function requireAdmin(req, res, next) {
  const role = req.headers['user-role'] || req.body.userRole;
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

// @route   GET /api/campaigns/moderate
// @desc    List campaigns by status for moderation
// @access  Admin only
router.get('/moderate', requireAdmin, async (req, res) => {
  try {
    const { status = 'pending', limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const campaigns = await Campaign.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/approve
// @desc    Approve a campaign
// @access  Admin only
router.post('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    campaign.status = 'approved';
    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/reject
// @desc    Reject a campaign
// @access  Admin only
router.post('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    campaign.status = 'rejected';
    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/close
// @desc    Close a campaign
// @access  Admin only
router.post('/:id/close', requireAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    campaign.status = 'closed';
    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/campaigns/:id/upload-media
// @desc    Upload media (image/video) for a campaign
// @access  Private (Owner only)
router.post('/:id/upload-media', upload.single('file'), async (req, res) => {
  try {
    const ownerId = req.headers['user-id'] || req.body.ownerId;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    if (campaign.owner.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    const url = `/uploads/${req.file.filename}`;
    campaign.media.push({ url, type: fileType });
    await campaign.save();
    res.json({ success: true, url, type: fileType });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router; 