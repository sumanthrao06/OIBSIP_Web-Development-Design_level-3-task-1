import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Offer description is required']
  },
  code: {
    type: String,
    required: [true, 'Offer coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required']
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Offer banner image is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  }
}, {
  timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
