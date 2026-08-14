const Owner = require('../models/Owner');

// @desc    Get all owners for logged-in doctor
// @route   GET /api/owners
const getOwners = async (req, res, next) => {
  try {
    const owners = await Owner.find({ doctorId: req.user._id }).sort({ name: 1 });
    res.json({ success: true, count: owners.length, data: owners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new owner
// @route   POST /api/owners
const createOwner = async (req, res, next) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Owner name and phone are required' });
    }

    const owner = await Owner.create({
      doctorId: req.user._id,
      name,
      phone,
      email: email || '',
      address: address || ''
    });

    res.status(201).json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update owner
// @route   PUT /api/owners/:id
const updateOwner = async (req, res, next) => {
  try {
    let owner = await Owner.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete owner
// @route   DELETE /api/owners/:id
const deleteOwner = async (req, res, next) => {
  try {
    const owner = await Owner.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    await owner.deleteOne();
    res.json({ success: true, message: 'Owner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwners,
  createOwner,
  updateOwner,
  deleteOwner
};
