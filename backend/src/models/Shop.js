const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Shop name is required'],
    trim: true
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Shop must have an owner'] 
  },
  gstNumber: { 
    type: String,
    trim: true,
    uppercase: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  address: { 
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
