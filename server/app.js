const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const mongoSanitize = require('./middlewares/sanitize');
const { apiRateLimiter } = require('./middlewares/rateLimiter');
const { protect } = require('./middlewares/auth');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const adminLeadRoutes = require('./routes/adminLeadRoutes');
const statsRoutes = require('./routes/statsRoutes');
const staffRoutes = require('./routes/staffRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const countryRoutes = require('./routes/countryRoutes');
const universityRoutes = require('./routes/universityRoutes');
const courseRoutes = require('./routes/courseRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faqRoutes = require('./routes/faqRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const footerRoutes = require('./routes/footerRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Logging — dev mode: colorized, production: combined (Apache-style for log files)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  const fs = require('fs');
  const path = require('path');
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// CORS Configuration with credentials
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Body Parsing with 1MB limit & Cookie Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// NoSQL Injection protection
app.use(mongoSanitize);

// General rate limiter on all API routes
app.use('/api', apiRateLimiter);

// Serve uploaded public images
app.use('/uploads/images', express.static('uploads/images'));

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Public Leads Route (rate limited + validated in the router itself)
app.use('/api/leads', leadRoutes);

// Public Content Routes — read-only for the website frontend
app.use('/api/countries', countryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/settings/footer', footerRoutes);
app.use('/api/settings/contact', contactRoutes);

// ── Admin-Only Routes ──────────────────────────────────────────────────────
// All /api/admin/* routes require a valid JWT session (protect middleware).
// Individual route handlers may further restrict by role (authorize).
const adminRouter = express.Router();
adminRouter.use(protect); // Gate the entire /api/admin namespace

adminRouter.use('/leads', adminLeadRoutes);
adminRouter.use('/stats', statsRoutes);
adminRouter.use('/staff', staffRoutes);
adminRouter.use('/upload', uploadRoutes);
adminRouter.use('/countries', countryRoutes);
adminRouter.use('/universities', universityRoutes);
adminRouter.use('/courses', courseRoutes);
adminRouter.use('/services', serviceRoutes);
adminRouter.use('/testimonials', testimonialRoutes);
adminRouter.use('/blogs', blogRoutes);
adminRouter.use('/faqs', faqRoutes);
adminRouter.use('/partners', partnerRoutes);
adminRouter.use('/jobs', jobRoutes);
adminRouter.use('/applications', jobApplicationRoutes);
adminRouter.use('/hero', heroRoutes);
adminRouter.use('/about', aboutRoutes);
adminRouter.use('/settings/footer', footerRoutes);
adminRouter.use('/settings/contact', contactRoutes);

app.use('/api/admin', adminRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Central Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  // Never send stack traces in production
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
