const mongoose = require('mongoose');
require('dotenv').config();
const { getProducts } = require('./src/controllers/productController');
const Product = require('./src/models/Product');
require('./src/models/Category');
require('./src/models/Brand');
require('./src/models/Shop');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const req = { scopedShopId: '66810a95c37021e139963e62' }; // arbitrary object id
    const res = {
      status: (code) => ({
        json: (data) => console.log('Response:', code, data)
      })
    };
    const next = (err) => console.error('Next called with error:', err);

    await getProducts(req, res, next);
  } catch (err) {
    console.error('Test script error:', err);
  } finally {
    mongoose.disconnect();
  }
}
test();
