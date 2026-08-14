const Product = require('../models/Product');

// @desc    Get all inventory products
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus, sort } = req.query;

    let query = { doctorId: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { supplier: searchRegex },
        { batchNumber: searchRegex }
      ];
    }

    let products = await Product.find(query);

    // Filter by calculated stock status
    if (stockStatus && stockStatus !== 'All') {
      products = products.filter(p => p.stockStatus === stockStatus);
    }

    // Sort products
    if (sort === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      products.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'qty_asc') {
      products.sort((a, b) => a.quantity - b.quantity);
    } else if (sort === 'qty_desc') {
      products.sort((a, b) => b.quantity - a.quantity);
    } else if (sort === 'expiry_asc') {
      products.sort((a, b) => new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31'));
    } else {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      brand,
      description,
      quantity,
      unit,
      minimumStock,
      price,
      supplier,
      expiryDate,
      batchNumber
    } = req.body;

    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, quantity, and price are required' });
    }

    const product = await Product.create({
      doctorId: req.user._id,
      name,
      category: category || 'Medicine',
      brand: brand || '',
      description: description || '',
      quantity: Number(quantity) < 0 ? 0 : Number(quantity),
      unit: unit || 'Vials',
      minimumStock: Number(minimumStock) || 5,
      price: Number(price) < 0 ? 0 : Number(price),
      supplier: supplier || '',
      expiryDate: expiryDate || null,
      batchNumber: batchNumber || ''
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock quantity (increase/decrease)
// @route   PATCH /api/products/:id/stock
const updateStock = async (req, res, next) => {
  try {
    const { action, amount } = req.body; // action: 'increase' | 'decrease' | 'set'
    const adjustment = Number(amount) || 1;

    const product = await Product.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (action === 'increase') {
      product.quantity += adjustment;
    } else if (action === 'decrease') {
      product.quantity = Math.max(0, product.quantity - adjustment);
    } else if (action === 'set') {
      product.quantity = Math.max(0, adjustment);
    }

    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted from inventory' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct
};
