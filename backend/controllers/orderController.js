import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const { items, deliveryAddress, paymentMethod, couponCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  try {
    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // Handle coupon code discount if applicable
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: Date.now() }
      });

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'fixed') {
          discount = coupon.discountValue;
        }
      }
    }

    // 5% Tax Calculation
    const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
    const grandTotal = Math.max(0, Math.round((subtotal - discount + tax) * 100) / 100);

    // Generate Order ID (SC-XXXXXX)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SC-${randomNum}`;

    // Create Order
    const order = await Order.create({
      orderId,
      user: req.user.id,
      items,
      subtotal,
      tax,
      discount,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed', // UPI/Card mock completes payment
      deliveryAddress,
      statusTimeline: [{ status: 'placed', timestamp: new Date() }]
    });

    // Clear user cart in DB
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Access check: User must own the order or be an admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  const { search, status } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  try {
    let query = Order.find(filter).populate('user', 'name email');

    const orders = await query.sort({ createdAt: -1 });

    // In-memory search fallback for searching by Order ID or User name/email
    let filteredOrders = orders;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = orders.filter(o => 
        o.orderId.toLowerCase().includes(searchLower) ||
        (o.user && o.user.name.toLowerCase().includes(searchLower)) ||
        (o.user && o.user.email.toLowerCase().includes(searchLower))
      );
    }

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['placed', 'confirmed', 'preparing', 'baking', 'out_for_delivery', 'delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    
    // Add entry to statusTimeline
    order.statusTimeline.push({
      status,
      timestamp: new Date()
    });

    if (status === 'delivered') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder a previous order
// @route   POST /api/orders/:id/reorder
// @access  Private
export const reorder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to copy this order' });
    }

    // Extract items to push to user's cart
    const reorderItems = order.items.map(item => ({
      pizza: item.pizza,
      name: item.name,
      size: item.size,
      crust: item.crust,
      sauce: item.sauce,
      cheese: item.cheese,
      vegToppings: item.vegToppings,
      nonVegToppings: item.nonVegToppings,
      extras: item.extras,
      quantity: item.quantity,
      price: item.price
    }));

    // Find and update user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: reorderItems });
    } else {
      cart.items = [...cart.items, ...reorderItems];
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Items from past order added to cart successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};
