const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['REMINDER_2_DAYS', 'REMINDER_1_DAY', 'REMINDER_TODAY', 'OVERDUE', 'INVENTORY_LOW', 'SYSTEM'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel'
    },
    relatedModel: {
      type: String,
      enum: ['Vaccination', 'Product', 'Pet'],
      default: 'Vaccination'
    },
    notificationKey: {
      type: String,
      unique: true, // Prevents duplicate notifications
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
