const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');
require('./src/models/Category');
require('./src/models/Brand');
require('./src/models/Shop');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const products = await Product.find({}).populate('categoryId').populate('brandId');
    console.log('Products fetched successfully:', products.length);
    console.log(JSON.stringify(products.slice(0, 2), null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}
test();
