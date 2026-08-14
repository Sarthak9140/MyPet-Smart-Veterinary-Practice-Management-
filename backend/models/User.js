const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    clinicName: {
      type: String,
      default: 'MyPet Veterinary Clinic'
    },
    clinicAddress: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    profileImage: {
      type: String,
      default: ''
    },
    notificationPreferences: {
      daysBefore: {
        type: [Number],
        default: [2, 1, 0] // Notify 2 days before, 1 day before, and on due date
      },
      emailAlerts: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
