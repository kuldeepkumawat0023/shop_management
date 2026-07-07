const { csrfSync } = require('csrf-sync');

const {
  csrfSynchronisedProtection: baseCsrfSynchronisedProtection,
  generateToken,
  revokeToken,
  getTokenFromState,
  getTokenFromRequest
} = csrfSync({
  getTokenFromRequest: (req) => {
    return req.headers['x-csrf-token'] || req.headers['csrf-token'];
  },
  getTokenFromState: (req) => {
    return req.cookies['csrf-secret'];
  },
  storeTokenInState: (req, token) => {
    // Note: use res.cookie instead of req.res.cookie
    req.res.cookie('csrf-secret', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
});

// Ponytail Mode: Bypass CSRF in development to prevent Postman blocking
const csrfSynchronisedProtection = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  return baseCsrfSynchronisedProtection(req, res, next);
};

module.exports = {
  csrfSynchronisedProtection,
  generateToken,
  revokeToken,
  getTokenFromState,
  getTokenFromRequest
};
