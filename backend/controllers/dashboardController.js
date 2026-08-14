const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const Product = require('../models/Product');

// @desc    Get complete dashboard statistics & analytics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    // 1. Total Pets
    const totalPets = await Pet.countDocuments({ doctorId });

    // 2. All Vaccinations for doctor
    const vaccinations = await Vaccination.find({ doctorId })
      .populate('petId', 'petName petType breed')
      .populate('ownerId', 'name phone email');

    let dueToday = 0;
    let dueSoon = 0;
    let upcoming = 0;
    let overdue = 0;

    const todayVaccinations = [];
    const upcomingVaccinationsList = [];
    const overdueVaccinationsList = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const record of vaccinations) {
      if (!record.nextVaccinationDate || !record.petId) continue;
      
      const nextDate = new Date(record.nextVaccinationDate);
      nextDate.setHours(0, 0, 0, 0);

      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        overdue++;
        overdueVaccinationsList.push({
          _id: record._id,
          petName: record.petId.petName,
          petType: record.petId.petType,
          vaccineName: record.vaccineName,
          ownerName: record.ownerId ? record.ownerId.name : 'Unknown Owner',
          ownerPhone: record.ownerId ? record.ownerId.phone : '',
          nextVaccinationDate: record.nextVaccinationDate,
          daysOverdue: Math.abs(diffDays)
        });
      } else if (diffDays === 0) {
        dueToday++;
        todayVaccinations.push({
          _id: record._id,
          petName: record.petId.petName,
          petType: record.petId.petType,
          vaccineName: record.vaccineName,
          ownerName: record.ownerId ? record.ownerId.name : 'Unknown Owner',
          ownerPhone: record.ownerId ? record.ownerId.phone : '',
          nextVaccinationDate: record.nextVaccinationDate
        });
      } else if (diffDays <= 2) {
        dueSoon++;
        upcomingVaccinationsList.push({
          _id: record._id,
          petName: record.petId.petName,
          petType: record.petId.petType,
          vaccineName: record.vaccineName,
          ownerName: record.ownerId ? record.ownerId.name : 'Unknown Owner',
          ownerPhone: record.ownerId ? record.ownerId.phone : '',
          nextVaccinationDate: record.nextVaccinationDate,
          daysRemaining: diffDays
        });
      } else {
        upcoming++;
        if (upcomingVaccinationsList.length < 5) {
          upcomingVaccinationsList.push({
            _id: record._id,
            petName: record.petId.petName,
            petType: record.petId.petType,
            vaccineName: record.vaccineName,
            ownerName: record.ownerId ? record.ownerId.name : 'Unknown Owner',
            ownerPhone: record.ownerId ? record.ownerId.phone : '',
            nextVaccinationDate: record.nextVaccinationDate,
            daysRemaining: diffDays
          });
        }
      }
    }

    // 3. Products Stats
    const products = await Product.find({ doctorId });
    const totalProducts = products.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inStockCount = 0;

    for (const p of products) {
      if (p.quantity === 0) {
        outOfStockCount++;
      } else if (p.quantity <= p.minimumStock) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    }

    // 4. Pet Types Analytics Breakdown
    const pets = await Pet.find({ doctorId });
    const petTypeMap = {};
    pets.forEach(p => {
      petTypeMap[p.petType] = (petTypeMap[p.petType] || 0) + 1;
    });

    const petTypeData = Object.keys(petTypeMap).map(type => ({
      name: type,
      value: petTypeMap[type]
    }));

    // 5. Inventory Chart Data
    const inventoryData = [
      { name: 'In Stock', value: inStockCount, color: '#10B981' },
      { name: 'Low Stock', value: lowStockCount, color: '#F59E0B' },
      { name: 'Out of Stock', value: outOfStockCount, color: '#EF4444' }
    ];

    res.json({
      success: true,
      stats: {
        totalPets,
        upcomingVaccinations: upcoming + dueSoon,
        dueToday,
        overdue,
        totalProducts,
        lowStockProducts: lowStockCount
      },
      lists: {
        todayVaccinations,
        upcomingVaccinations: upcomingVaccinationsList,
        overdueVaccinations: overdueVaccinationsList
      },
      charts: {
        petTypes: petTypeData,
        inventoryStatus: inventoryData
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
