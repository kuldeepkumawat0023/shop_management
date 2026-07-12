const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, shopId: user.shopId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await axios.get('http://localhost:4000/api/v1/products/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
  } finally {
    mongoose.disconnect();
  }
}
test();
