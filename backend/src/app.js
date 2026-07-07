const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const errorHandler = require('./middlewares/errorHandler'); // Fixed path to middlewares
const { csrfSynchronisedProtection, generateToken } = require('./middlewares/csrfMiddleware');

const app = express();
app.disable('etag');

// 1. Trust Proxy (Important for Rate Limiting behind Load Balancers like Heroku/Vercel/Nginx)
app.set('trust proxy', 1);

// 2. CORS config (Must be first to avoid generic Network Errors on rate limit hits/errors)
const allowedOrigins = [
  // Env-based
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  // Live production URLs
  'https://thoritechnicalshop.com',
].filter(Boolean); // Remove undefined/null values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    // Allow if in explicit list or if it's a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// 3. Performance Middleware
app.use(compression()); // Gzip compression for faster responses

// 4. Rate Limiting (Traffic Control)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Increase max requests to 10000 in development to prevent dev lockouts
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply limiter to all API routes
app.use('/api', limiter);

// 5. Security Middleware
app.use(helmet());

// Parsing Middleware (10mb limit for base64 image messages)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request ID Middleware for Tracing
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  // Also send it in response headers so frontend can trace it if needed
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  morgan.token('id', (req) => req.id);
  app.use(morgan(':id :method :url :status :response-time ms - :res[content-length]'));
}

const apiRoutes = require('./routes/index');

// Add CSRF endpoint for frontend
app.get('/api/v1/csrf-token', (req, res) => {
  res.json({ csrfToken: generateToken(req) });
});

// CSRF Protection Middleware
app.use(csrfSynchronisedProtection);

// Mount routes
app.use('/api/v1', apiRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Global Error Handler (strictly uses 400 for errors)
app.use(errorHandler);

module.exports = app;
