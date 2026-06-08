import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.pizza');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user cart
// @route   PUT /api/cart
// @access  Private
export const updateCart = async (req, res, next) => {
  const { items } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items });
    } else {
      cart.items = items;
    }

    await cart.save();
    
    // Fetch populated cart to return
    const populatedCart = await Cart.findOne({ user: req.user.id }).populate('items.pizza');

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};
