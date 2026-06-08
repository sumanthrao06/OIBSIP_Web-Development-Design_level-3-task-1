import Pizza from '../models/Pizza.js';

// @desc    Get all pizzas
// @route   GET /api/pizzas
// @access  Public
export const getAllPizzas = async (req, res, next) => {
  const { category, featured } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  try {
    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pizzas.length, pizzas });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pizza details
// @route   GET /api/pizzas/:id
// @access  Public
export const getPizzaById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pizza
// @route   POST /api/pizzas
// @access  Private/Admin
export const createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, message: 'Pizza created successfully', pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pizza
// @route   PUT /api/pizzas/:id
// @access  Private/Admin
export const updatePizza = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pizza = await Pizza.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.status(200).json({ success: true, message: 'Pizza updated successfully', pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pizza
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin
export const deletePizza = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find and delete the pizza. Review average ratings will cascade delete if we implemented hook,
    // but simply deleting the pizza model is fine.
    const pizza = await Pizza.findByIdAndDelete(id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.status(200).json({ success: true, message: 'Pizza deleted successfully' });
  } catch (error) {
    next(error);
  }
};
