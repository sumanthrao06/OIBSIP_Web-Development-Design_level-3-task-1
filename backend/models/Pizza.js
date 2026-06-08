import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Pizza description is required']
  },
  image: {
    type: String,
    required: [true, 'Pizza image path is required']
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg', 'signature', 'premium', 'cheese-lovers', 'spicy'],
    required: [true, 'Pizza category is required']
  },
  sizePrices: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  ingredients: {
    type: [String],
    default: []
  },
  nutritionalDetails: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 },   // in grams
    fat: { type: Number, default: 0 }      // in grams
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
