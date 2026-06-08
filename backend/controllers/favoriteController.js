import Favorite from '../models/Favorite.js';

// @desc    Get all saved favorites for user
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate('pizza');
    res.status(200).json({ success: true, favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a pizza configuration to favorites
// @route   POST /api/favorites
// @access  Private
export const saveFavorite = async (req, res, next) => {
  const { name, pizzaId, configuration, price } = req.body;

  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      name,
      pizza: pizzaId,
      configuration,
      price
    });

    res.status(201).json({
      success: true,
      message: 'Pizza configuration saved to favorites successfully',
      favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a favorite configuration
// @route   DELETE /api/favorites/:id
// @access  Private
export const deleteFavorite = async (req, res, next) => {
  const { id } = req.params;

  try {
    const favorite = await Favorite.findOneAndDelete({ _id: id, user: req.user.id });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found or not authorized' });
    }

    res.status(200).json({ success: true, message: 'Favorite configuration deleted successfully' });
  } catch (error) {
    next(error);
  }
};
