const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await Product.find({}).lean();
    console.log('Products:', products.length);
    console.log(products);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}
test();
