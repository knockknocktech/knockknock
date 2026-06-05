const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true, minlength: 2 },
    phone:         { type: String, required: true, trim: true },
    brand:         { type: String, required: true, trim: true },
    issue:         { type: String, required: true, trim: true, minlength: 5 },
    location:      { type: String, required: true, trim: true },
    preferredTime: { type: String, default: 'Not specified' },
    status:        { type: String, enum: ['new', 'contacted', 'booked', 'completed', 'closed'], default: 'new' },
    source:        { type: String, default: 'website' },
    submittedAt:   { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Index for faster queries
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ phone: 1 });

module.exports = mongoose.model('Lead', leadSchema);
