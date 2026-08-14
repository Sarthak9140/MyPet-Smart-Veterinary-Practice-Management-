const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
      index: true
    },
    petName: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      index: true
    },
    petType: {
      type: String,
      required: [true, 'Pet type is required (e.g. Dog, Cat, Bird)'],
      trim: true,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Other']
    },
    breed: {
      type: String,
      default: 'Mixed / Unknown',
      trim: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown'
    },
    dateOfBirth: {
      type: Date
    },
    weight: {
      type: Number, // in kg
      default: 0
    },
    color: {
      type: String,
      default: ''
    },
    petId: {
      type: String, // Clinic registration ID e.g. PET-1002
      required: true,
      unique: false // Unique per doctor handled in business logic or composite
    },
    medicalNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
