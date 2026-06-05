const express = require('express');
const router  = express.Router();
const Lead    = require('../models/Lead');

// ──────────────────────────────────────────────────────────────
// POST /api/leads — Create a new service request lead
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, phone, brand, issue, location, preferredTime, submittedAt } = req.body;

    // Server-side validation
    const errors = [];
    if (!name || name.trim().length < 2)   errors.push('Name is required (min 2 chars).');
    if (!phone || !/^[\+\d][\d\s\-]{7,14}$/.test(phone.trim())) errors.push('A valid phone number is required.');
    if (!brand)                             errors.push('Device brand is required.');
    if (!issue || issue.trim().length < 5)  errors.push('Issue description is required (min 5 chars).');
    if (!location || location.trim().length < 3) errors.push('Location is required (min 3 chars).');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const lead = await Lead.create({
      name:          name.trim(),
      phone:         phone.trim(),
      brand:         brand.trim(),
      issue:         issue.trim(),
      location:      location.trim(),
      preferredTime: preferredTime || 'Not specified',
      submittedAt:   submittedAt ? new Date(submittedAt) : new Date(),
    });

    console.log(`✅ New lead: ${lead.name} — ${lead.phone} — ${lead.brand}`);

    res.status(201).json({
      success: true,
      message: 'Service request received! We will contact you within 1 hour.',
      leadId:  lead._id,
    });
  } catch (err) {
    console.error('❌ Lead creation error:', err.message);
    res.status(500).json({
      success: false,
      errors: ['Server error. Please try again or contact us via WhatsApp.'],
    });
  }
});

// ──────────────────────────────────────────────────────────────
// GET /api/leads — List all leads (admin-ready, future auth)
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    console.error('❌ Lead fetch error:', err.message);
    res.status(500).json({ success: false, errors: ['Failed to fetch leads.'] });
  }
});

// ──────────────────────────────────────────────────────────────
// PATCH /api/leads/:id — Update lead status (admin-ready)
// ──────────────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['new', 'contacted', 'booked', 'completed', 'closed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, errors: [`Status must be one of: ${valid.join(', ')}`] });
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!lead) return res.status(404).json({ success: false, errors: ['Lead not found.'] });
    res.json({ success: true, data: lead });
  } catch (err) {
    console.error('❌ Lead update error:', err.message);
    res.status(500).json({ success: false, errors: ['Failed to update lead.'] });
  }
});

module.exports = router;
