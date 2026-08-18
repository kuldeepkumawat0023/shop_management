const Brand = require('../models/Brand');

exports.createBrand = async (req, res, next) => {
  try {
    const { name, contactPerson, description, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }

    const exists = await Brand.findOne({ name: name.trim(), shopId: req.scopedShopId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Brand already exists in this shop' });
    }

    const brandData = {
      name: name.trim(),
      contactPerson: contactPerson ? contactPerson.trim() : undefined,
      description: description ? description.trim() : undefined,
      isActive: status === 'Inactive' ? false : true,
      shopId: req.scopedShopId
    };

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
    if (!brand || !brand.isActive) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const { name, contactPerson, description, status, isActive } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (contactPerson !== undefined) updateData.contactPerson = contactPerson.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.isActive = status === 'Active';
    if (isActive !== undefined) updateData.isActive = isActive;

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
