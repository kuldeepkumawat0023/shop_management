const express = require('express');
const router = express.Router();

// Import individual route files here
// const authRoutes = require('./authRoutes');
// router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API Routes are active' });
});

module.exports = router;
