const Pet = require('../models/Pet');
const Owner = require('../models/Owner');
const Vaccination = require('../models/Vaccination');

// @desc    Get all pets for logged in doctor
// @route   GET /api/pets
const getPets = async (req, res, next) => {
  try {
    const { search, petType, sort } = req.query;
    let query = { doctorId: req.user._id };

    if (petType && petType !== 'All') {
      query.petType = petType;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingOwners = await Owner.find({ doctorId: req.user._id, name: searchRegex }).select('_id');
      const ownerIds = matchingOwners.map(o => o._id);

      query.$or = [
        { petName: searchRegex },
        { breed: searchRegex },
        { petId: searchRegex },
        { ownerId: { $in: ownerIds } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'name_asc') sortOptions = { petName: 1 };
    if (sort === 'name_desc') sortOptions = { petName: -1 };

    const pets = await Pet.find(query)
      .populate('ownerId', 'name phone email address')
      .sort(sortOptions);

    // Attach latest vaccination date for each pet dynamically
    const petsWithVaccineDates = await Promise.all(
      pets.map(async (pet) => {
        const petObj = pet.toObject();
        const latestVaccine = await Vaccination.findOne({ petId: pet._id })
          .sort({ nextVaccinationDate: 1 });
        
        const lastVaccine = await Vaccination.findOne({ petId: pet._id })
          .sort({ vaccinationDate: -1 });

        petObj.lastVaccination = lastVaccine ? lastVaccine.vaccinationDate : null;
        petObj.nextVaccination = latestVaccine ? latestVaccine.nextVaccinationDate : null;
        petObj.nextVaccineStatus = latestVaccine ? latestVaccine.status : 'None';
        return petObj;
      })
    );

    res.json({ success: true, count: petsWithVaccineDates.length, data: petsWithVaccineDates });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet profile with vaccination history
// @route   GET /api/pets/:id
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, doctorId: req.user._id })
      .populate('ownerId', 'name phone email address');

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet record not found' });
    }

    const vaccinations = await Vaccination.find({ petId: pet._id })
      .sort({ vaccinationDate: -1 });

    res.json({
      success: true,
      data: {
        ...pet.toObject(),
        vaccinationHistory: vaccinations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pet (and owner if specified)
// @route   POST /api/pets
const createPet = async (req, res, next) => {
  try {
    const {
      petName,
      petType,
      breed,
      gender,
      dateOfBirth,
      weight,
      color,
      petId,
      medicalNotes,
      ownerId,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAddress
    } = req.body;

    if (!petName || !petType) {
      return res.status(400).json({ success: false, message: 'Pet name and type are required' });
    }

    let finalOwnerId = ownerId;

    // Create new owner if ownerId is not provided
    if (!finalOwnerId) {
      if (!ownerName || !ownerPhone) {
        return res.status(400).json({ success: false, message: 'Owner name and phone are required' });
      }
      const newOwner = await Owner.create({
        doctorId: req.user._id,
        name: ownerName,
        phone: ownerPhone,
        email: ownerEmail || '',
        address: ownerAddress || ''
      });
      finalOwnerId = newOwner._id;
    }

    const generatedPetId = petId || `PET-${Math.floor(1000 + Math.random() * 9000)}`;

    const pet = await Pet.create({
      doctorId: req.user._id,
      ownerId: finalOwnerId,
      petName,
      petType,
      breed: breed || 'Mixed / Unknown',
      gender: gender || 'Unknown',
      dateOfBirth: dateOfBirth || null,
      weight: weight || 0,
      color: color || '',
      petId: generatedPetId,
      medicalNotes: medicalNotes || ''
    });

    const populatedPet = await Pet.findById(pet._id).populate('ownerId');

    res.status(201).json({ success: true, data: populatedPet });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
const updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet record not found' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('ownerId');

    res.json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet record not found' });
    }

    // Clean up associated vaccination records
    await Vaccination.deleteMany({ petId: pet._id });

    await pet.deleteOne();
    res.json({ success: true, message: 'Pet and associated vaccination history deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
