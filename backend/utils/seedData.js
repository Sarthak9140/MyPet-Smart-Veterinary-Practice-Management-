const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

const seedDemoData = async () => {
  try {
    console.log('[Seed] Starting demo dataset population...');

    // Check if demo doctor already exists
    let doctor = await User.findOne({ email: 'dr.smith@mypet.com' });
    if (!doctor) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Doctor123!', salt);

      doctor = await User.create({
        name: 'Dr. Sarah Jenkins',
        email: 'dr.smith@mypet.com',
        phone: '+91 98765 12345',
        clinicName: 'Starlight Veterinary Practice',
        clinicAddress: '742 Park Street, Indiranagar, Bengaluru',
        password: hashedPassword
      });
      console.log('[Seed] Created default demo doctor: dr.smith@mypet.com (Password: Doctor123!)');
    }

    const doctorId = doctor._id;

    // Clear existing data for this demo doctor to ensure clean seed
    await Owner.deleteMany({ doctorId });
    await Pet.deleteMany({ doctorId });
    await Vaccination.deleteMany({ doctorId });
    await Product.deleteMany({ doctorId });
    await Notification.deleteMany({ doctorId });

    // 1. Create Owners
    const owners = await Owner.insertMany([
      { doctorId, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@example.com', address: 'B-104, Sunrise Apartments, Mumbai' },
      { doctorId, name: 'Emily Watson', phone: '+91 98111 22233', email: 'emily.w@example.com', address: '12 West Oak Street, New Delhi' },
      { doctorId, name: 'Carlos Mendez', phone: '+91 98222 33344', email: 'carlos.m@example.com', address: '450 Pine Valley Road, Pune' },
      { doctorId, name: 'Priya Patel', phone: '+91 98333 44455', email: 'priya.p@example.com', address: 'Flat 12, Green Park, Ahmedabad' }
    ]);

    // 2. Create Pets
    const pets = await Pet.insertMany([
      {
        doctorId,
        ownerId: owners[0]._id,
        petName: 'Bruno',
        petType: 'Dog',
        breed: 'Golden Retriever',
        gender: 'Male',
        dateOfBirth: new Date('2022-04-15'),
        weight: 28.5,
        color: 'Golden',
        petId: 'PET-1001',
        medicalNotes: 'Friendly, slightly sensitive skin. Loves treats.'
      },
      {
        doctorId,
        ownerId: owners[1]._id,
        petName: 'Max',
        petType: 'Dog',
        breed: 'German Shepherd',
        gender: 'Male',
        dateOfBirth: new Date('2021-09-10'),
        weight: 34.0,
        color: 'Black & Tan',
        petId: 'PET-1002',
        medicalNotes: 'Up to date on flea medication.'
      },
      {
        doctorId,
        ownerId: owners[2]._id,
        petName: 'Luna',
        petType: 'Cat',
        breed: 'Siamese',
        gender: 'Female',
        dateOfBirth: new Date('2023-01-20'),
        weight: 4.2,
        color: 'Cream & Seal Point',
        petId: 'PET-1003',
        medicalNotes: 'Indoor cat. Mild food allergy.'
      },
      {
        doctorId,
        ownerId: owners[3]._id,
        petName: 'Rocky',
        petType: 'Dog',
        breed: 'Beagle',
        gender: 'Male',
        dateOfBirth: new Date('2020-11-05'),
        weight: 12.8,
        color: 'Tricolor',
        petId: 'PET-1004',
        medicalNotes: 'Ear cleaning required regularly.'
      },
      {
        doctorId,
        ownerId: owners[1]._id,
        petName: 'Milo',
        petType: 'Cat',
        breed: 'Persian',
        gender: 'Male',
        dateOfBirth: new Date('2023-06-12'),
        weight: 3.8,
        color: 'White',
        petId: 'PET-1005',
        medicalNotes: 'Needs grooming every month.'
      }
    ]);

    // Calculate dynamic dates relative to TODAY
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getRelativeDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d;
    };

    // 3. Create Vaccination Records (Includes Due Today, Overdue, Due Soon, Upcoming)
    const vaccinations = await Vaccination.insertMany([
      // Bruno - Due Today
      {
        doctorId,
        petId: pets[0]._id,
        ownerId: owners[0]._id,
        vaccineName: 'Rabies Vaccine',
        vaccineType: 'Core Vaccine',
        vaccinationDate: getRelativeDate(-365),
        nextVaccinationDate: getRelativeDate(0), // DUE TODAY
        dose: 'Annual Booster',
        batchNumber: 'RB-2025-09A',
        notes: 'Annual rabies booster due today.'
      },
      // Max - Due Soon (Tomorrow)
      {
        doctorId,
        petId: pets[1]._id,
        ownerId: owners[1]._id,
        vaccineName: 'DHPP Vaccine',
        vaccineType: 'Core Combination',
        vaccinationDate: getRelativeDate(-364),
        nextVaccinationDate: getRelativeDate(1), // DUE TOMORROW
        dose: 'Dose 2',
        batchNumber: 'DHPP-8812',
        notes: 'Distemper, Hepatitis, Parvovirus, Parainfluenza.'
      },
      // Rocky - Overdue (2 days ago)
      {
        doctorId,
        petId: pets[3]._id,
        ownerId: owners[3]._id,
        vaccineName: 'Rabies Vaccine',
        vaccineType: 'Core Vaccine',
        vaccinationDate: getRelativeDate(-367),
        nextVaccinationDate: getRelativeDate(-2), // 2 DAYS OVERDUE
        dose: '1st Booster',
        batchNumber: 'RB-2024-44',
        notes: 'Owner notified via SMS.'
      },
      // Luna - Due Soon (In 2 days)
      {
        doctorId,
        petId: pets[2]._id,
        ownerId: owners[2]._id,
        vaccineName: 'FVRCP Vaccine',
        vaccineType: 'Feline Core',
        vaccinationDate: getRelativeDate(-363),
        nextVaccinationDate: getRelativeDate(2), // IN 2 DAYS
        dose: 'Annual Shot',
        batchNumber: 'FVR-901',
        notes: 'Feline Viral Rhinotracheitis.'
      },
      // Milo - Upcoming (In 15 days)
      {
        doctorId,
        petId: pets[4]._id,
        ownerId: owners[1]._id,
        vaccineName: 'Rabies Vaccine',
        vaccineType: 'Core Vaccine',
        vaccinationDate: getRelativeDate(-350),
        nextVaccinationDate: getRelativeDate(15), // UPCOMING
        dose: '1st Dose',
        batchNumber: 'RB-9988',
        notes: 'Scheduled regular checkup.'
      }
    ]);

    // 4. Create Product Inventory (In Stock, Low Stock, Out of Stock, Expiring)
    await Product.insertMany([
      {
        doctorId,
        name: 'Rabies Vaccine (Canine & Feline)',
        category: 'Vaccine',
        brand: 'Nobivac',
        description: '3-Year Rabies Vaccine viles 10ml',
        quantity: 18,
        unit: 'Vials',
        minimumStock: 5,
        price: 450.00,
        supplier: 'Zoetis Animal Health India',
        expiryDate: getRelativeDate(180),
        batchNumber: 'ZO-RB-4021'
      },
      {
        doctorId,
        name: 'DHPP Combination Vaccine',
        category: 'Vaccine',
        brand: 'Vanguard Plus',
        description: '5-in-1 Canine Distemper combination',
        quantity: 3, // LOW STOCK
        unit: 'Vials',
        minimumStock: 10,
        price: 650.00,
        supplier: 'Merck Animal Health India',
        expiryDate: getRelativeDate(12), // EXPIRING SOON
        batchNumber: 'MK-DH-102'
      },
      {
        doctorId,
        name: 'Amoxicillin Oral Suspension 100ml',
        category: 'Medicine',
        brand: 'VetAmox',
        description: 'Broad spectrum antibiotic for small animals',
        quantity: 0, // OUT OF STOCK
        unit: 'Bottles',
        minimumStock: 4,
        price: 280.00,
        supplier: 'Apex Vet Pharma India',
        expiryDate: getRelativeDate(90),
        batchNumber: 'AMX-003'
      },
      {
        doctorId,
        name: 'Flea & Tick Spot-On (Medium Dogs)',
        category: 'Pet Care',
        brand: 'Bravecto',
        description: '3-month topical flea and tick protection',
        quantity: 25,
        unit: 'Packs',
        minimumStock: 8,
        price: 890.00,
        supplier: 'Merck Animal Health India',
        expiryDate: getRelativeDate(300),
        batchNumber: 'BRV-7782'
      },
      {
        doctorId,
        name: 'Veterinary Syringes 3ml with Needle',
        category: 'Medical Supply',
        brand: 'BD Vet',
        description: 'Sterile single use 22G needles',
        quantity: 120,
        unit: 'Boxes',
        minimumStock: 30,
        price: 220.00,
        supplier: 'Medical Supply Co. India',
        expiryDate: getRelativeDate(500),
        batchNumber: 'SYR-901'
      }
    ]);

    // 5. Initial Notifications
    const todayStr = today.toISOString().split('T')[0];
    await Notification.insertMany([
      {
        doctorId,
        type: 'REMINDER_TODAY',
        title: 'Vaccination Due Today',
        message: "Vaccination Due Today: Bruno is scheduled for Rabies Vaccine vaccination today.",
        relatedId: vaccinations[0]._id,
        relatedModel: 'Vaccination',
        notificationKey: `${doctorId}_${vaccinations[0]._id}_REMINDER_TODAY_${todayStr}`,
        isRead: false
      },
      {
        doctorId,
        type: 'REMINDER_1_DAY',
        title: 'Vaccination Reminder (Tomorrow)',
        message: "Vaccination Reminder: Max's DHPP Vaccine vaccination is due tomorrow.",
        relatedId: vaccinations[1]._id,
        relatedModel: 'Vaccination',
        notificationKey: `${doctorId}_${vaccinations[1]._id}_REMINDER_1_DAY_${todayStr}`,
        isRead: false
      },
      {
        doctorId,
        type: 'OVERDUE',
        title: 'Overdue Vaccination',
        message: "Overdue Vaccination: Rocky's Rabies Vaccine vaccination is 2 day(s) overdue.",
        relatedId: vaccinations[2]._id,
        relatedModel: 'Vaccination',
        notificationKey: `${doctorId}_${vaccinations[2]._id}_OVERDUE_${todayStr}`,
        isRead: false
      },
      {
        doctorId,
        type: 'INVENTORY_LOW',
        title: 'Low Stock Alert',
        message: "Inventory Warning: DHPP Combination Vaccine stock is low (3 Vials remaining).",
        relatedId: null,
        relatedModel: 'Product',
        notificationKey: `${doctorId}_DHPP_LOW_STOCK_${todayStr}`,
        isRead: false
      }
    ]);

    console.log('[Seed] Demo data successfully populated!');
  } catch (err) {
    console.error('[Seed] Error populating seed data:', err.message);
  }
};

module.exports = { seedDemoData };
