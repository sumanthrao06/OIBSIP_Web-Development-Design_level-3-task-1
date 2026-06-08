import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for your favorite configuration'],
    trim: true
  },
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza'
  },
  configuration: {
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: true
    },
    crust: {
      type: String,
      enum: ['thin', 'hand-tossed', 'cheese-burst', 'stuffed-crust', 'whole-wheat'],
      required: true
    },
    sauce: {
      type: String,
      enum: ['tomato', 'bbq', 'garlic-parmesan', 'pesto', 'arrabbiata'],
      required: true
    },
    cheese: {
      type: String,
      enum: ['mozzarella', 'cheddar', 'parmesan', 'vegan'],
      required: true
    },
    vegToppings: {
      type: [String],
      default: []
    },
    nonVegToppings: {
      type: [String],
      default: []
    },
    extras: {
      type: [String],
      default: []
    }
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Unique favorites per user by configuration name
favoriteSchema.index({ user: 1, name: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
