const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');
const Owner = require('../models/Owner');
const { checkVaccinationReminders } = require('../jobs/reminderCron');

// @desc    Get all vaccination records with search, filter, and sorting
// @route   GET /api/vaccinations
const getVaccinations = async (req, res, next) => {
  try {
    const { search, petType, status, sort } = req.query;

    let query = { doctorId: req.user._id };

    // Fetch matching pets if petType or search is active
    let petQuery = { doctorId: req.user._id };
    if (petType && petType !== 'All') {
      petQuery.petType = petType;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingOwners = await Owner.find({
        doctorId: req.user._id,
        $or: [{ name: searchRegex }, { phone: searchRegex }]
      }).select('_id');
      const ownerIds = matchingOwners.map(o => o._id);

      petQuery.$or = [
        { petName: searchRegex },
        { petId: searchRegex },
        { ownerId: { $in: ownerIds } }
      ];
    }

    const matchingPets = await Pet.find(petQuery).select('_id ownerId');
    const petIds = matchingPets.map(p => p._id);

    if (search || (petType && petType !== 'All')) {
      query.$or = [
        { petId: { $in: petIds } },
        { vaccineName: new RegExp(search || '', 'i') }
      ];
    }

    let records = await Vaccination.find(query)
      .populate('petId', 'petName petType breed petId')
      .populate('ownerId', 'name phone email address');

    // Filter by calculated status if specified
    if (status && status !== 'All') {
      records = records.filter(r => r.status === status);
    }

    // Sorting logic
    if (sort === 'pet_asc') {
      records.sort((a, b) => (a.petId?.petName || '').localeCompare(b.petId?.petName || ''));
    } else if (sort === 'pet_desc') {
      records.sort((a, b) => (b.petId?.petName || '').localeCompare(a.petId?.petName || ''));
    } else if (sort === 'next_soonest') {
      records.sort((a, b) => new Date(a.nextVaccinationDate) - new Date(b.nextVaccinationDate));
    } else if (sort === 'next_latest') {
      records.sort((a, b) => new Date(b.nextVaccinationDate) - new Date(a.nextVaccinationDate));
    } else if (sort === 'vaccine_latest') {
      records.sort((a, b) => new Date(b.vaccinationDate) - new Date(a.vaccinationDate));
    } else if (sort === 'vaccine_oldest') {
      records.sort((a, b) => new Date(a.vaccinationDate) - new Date(b.vaccinationDate));
    } else {
      // Default: soonest next vaccination date
      records.sort((a, b) => new Date(a.nextVaccinationDate) - new Date(b.nextVaccinationDate));
    }

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vaccination record
// @route   GET /api/vaccinations/:id
const getVaccinationById = async (req, res, next) => {
  try {
    const record = await Vaccination.findOne({ _id: req.params.id, doctorId: req.user._id })
      .populate('petId')
      .populate('ownerId');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Vaccination record not found' });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create vaccination record
// @route   POST /api/vaccinations
const createVaccination = async (req, res, next) => {
  try {
    const {
      petId,
      vaccineName,
      vaccineType,
      vaccinationDate,
      nextVaccinationDate,
      dose,
      batchNumber,
      notes
    } = req.body;

    if (!petId || !vaccineName || !vaccinationDate || !nextVaccinationDate) {
      return res.status(400).json({
        success: false,
        message: 'Pet, Vaccine Name, Vaccination Date, and Next Vaccination Date are required'
      });
    }

    const pet = await Pet.findOne({ _id: petId, doctorId: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Selected pet not found' });
    }

    const record = await Vaccination.create({
      doctorId: req.user._id,
      petId: pet._id,
      ownerId: pet.ownerId,
      vaccineName,
      vaccineType: vaccineType || 'Core Vaccine',
      vaccinationDate,
      nextVaccinationDate,
      dose: dose || '1st Dose',
      batchNumber: batchNumber || '',
      notes: notes || ''
    });

    const populatedRecord = await Vaccination.findById(record._id)
      .populate('petId', 'petName petType breed petId')
      .populate('ownerId', 'name phone email');

    // Trigger immediate reminder scan asynchronously
    checkVaccinationReminders();

    res.status(201).json({ success: true, data: populatedRecord });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vaccination record
// @route   PUT /api/vaccinations/:id
const updateVaccination = async (req, res, next) => {
  try {
    let record = await Vaccination.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Vaccination record not found' });
    }

    record = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('petId')
      .populate('ownerId');

    // Trigger immediate reminder check
    checkVaccinationReminders();

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vaccination record
// @route   DELETE /api/vaccinations/:id
const deleteVaccination = async (req, res, next) => {
  try {
    const record = await Vaccination.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Vaccination record not found' });
    }

    await record.deleteOne();
    res.json({ success: true, message: 'Vaccination record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination
};
