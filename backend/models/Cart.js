import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza'
  },
  name: {
    type: String,
    required: true
  },
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
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
