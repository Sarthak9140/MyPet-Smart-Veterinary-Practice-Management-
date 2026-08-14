const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true
    },
    vaccineName: {
      type: String,
      required: [true, 'Vaccine name is required'],
      trim: true,
      index: true
    },
    vaccineType: {
      type: String,
      default: 'Core Vaccine',
      trim: true
    },
    vaccinationDate: {
      type: Date,
      required: [true, 'Vaccination date is required']
    },
    nextVaccinationDate: {
      type: Date,
      required: [true, 'Next vaccination date is required'],
      index: true
    },
    dose: {
      type: String,
      default: '1st Dose'
    },
    batchNumber: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Virtual for dynamic status calculation
vaccinationSchema.virtual('status').get(function () {
  if (!this.nextVaccinationDate) return 'Upcoming';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(this.nextVaccinationDate);
  nextDate.setHours(0, 0, 0, 0);

  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays === 0) {
    return 'Due Today';
  } else if (diffDays <= 2) {
    return 'Due Soon';
  } else {
    return 'Upcoming';
  }
});

vaccinationSchema.set('toJSON', { virtuals: true });
vaccinationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vaccination', vaccinationSchema);
