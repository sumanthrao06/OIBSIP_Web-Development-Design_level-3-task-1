import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'baking', 'out_for_delivery', 'delivered'],
    default: 'placed'
  },
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  statusTimeline: [
    {
      status: {
        type: String,
        enum: ['placed', 'confirmed', 'preparing', 'baking', 'out_for_delivery', 'delivered']
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
