const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Vaccine', 'Medicine', 'Supplement', 'Pet Care', 'Medical Supply', 'Other'],
      default: 'Medicine'
    },
    brand: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      default: 'Vials', // Vials, Tablets, Bottles, Packs, Boxes
      trim: true
    },
    minimumStock: {
      type: Number,
      default: 5,
      min: [0, 'Minimum stock cannot be negative']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    supplier: {
      type: String,
      default: ''
    },
    expiryDate: {
      type: Date
    },
    batchNumber: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Virtual for dynamic stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) {
    return 'Out of Stock';
  } else if (this.quantity <= this.minimumStock) {
    return 'Low Stock';
  } else {
    return 'In Stock';
  }
});

// Virtual for dynamic expiry status
productSchema.virtual('expiryStatus').get(function () {
  if (!this.expiryDate) return 'Valid';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(this.expiryDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Expired';
  } else if (diffDays <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Valid';
  }
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
