const Brand = require('../models/Brand');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name is required' });

    const exists = await Brand.findOne({ name, shopId: req.scopedShopId });
    if (exists) return res.status(400).json({ success: false, message: 'Brand already exists in this shop' });

    const brandData = { name, shopId: req.scopedShopId };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/brands', 'image');
      brandData.logo = result.secure_url;
    }

    const brand = await Brand.create(brandData);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Brand already exists' });
    next(error);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ shopId: req.scopedShopId, isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    next(error);
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!brand || !brand.isActive) return res.status(404).json({ success: false, message: 'Brand not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (brand.logo) await deleteFromCloudinary(brand.logo);
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/brands', 'image');
      updateData.logo = result.secure_url;
    }

    brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Brand name already exists' });
    next(error);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    brand.isActive = false;
    await brand.save();
    res.status(200).json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};
