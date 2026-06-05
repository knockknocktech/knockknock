/* ══════════════════════════════════════════════════════════════
   KNOCKKNOCK — Express Server
   Lead capture API with MongoDB persistence
══════════════════════════════════════════════════════════════ */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');

const leadsRouter = require('./routes/leads');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── MIDDLEWARE ─────────────────────────────────────────────── */
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:5500', 
    'http://localhost:5500', 
    'null',
    'https://knockknocktech.in',
    'https://www.knockknocktech.in'
  ],
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (optional: for production)
app.use(express.static(path.join(__dirname, '..')));

// Request logger (dev)
app.use((req, res, next) => {
  const ts = new Date().toLocaleTimeString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
});

/* ── ROUTES ────────────────────────────────────────────────── */
app.use('/api/leads', leadsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'KNOCKKNOCK Lead API',
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString(),
  });
});

/* ── 404 ───────────────────────────────────────────────────── */
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, errors: ['Endpoint not found.'] });
});

/* ── ERROR HANDLER ─────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, errors: ['Internal server error.'] });
});

/* ── DATABASE + START ──────────────────────────────────────── */
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knockknock';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected:', MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

    app.listen(PORT, () => {
      console.log('');
      console.log('  ╔══════════════════════════════════════════╗');
      console.log('  ║   KNOCKKNOCK Lead API 🚀                ║');
      console.log(`  ║   Running on http://localhost:${PORT}       ║`);
      console.log('  ║   Health:  /api/health                   ║');
      console.log('  ║   Leads:   POST /api/leads               ║');
      console.log('  ╚══════════════════════════════════════════╝');
      console.log('');
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.log('');
    console.log('  ⚠️  Starting in FRONTEND-ONLY mode (no database).');
    console.log('  ⚠️  Form submissions will be logged to console only.');
    console.log('');

    // Start without DB — form submissions just get logged
    app.listen(PORT, () => {
      console.log(`  🌐 Server running on http://localhost:${PORT} (no DB)`);
    });
  }
}

start();
