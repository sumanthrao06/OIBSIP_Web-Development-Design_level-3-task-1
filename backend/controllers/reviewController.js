import Review from '../models/Review.js';

// @desc    Get all reviews for a specific pizza
// @route   GET /api/reviews/pizza/:pizzaId
// @access  Public
export const getPizzaReviews = async (req, res, next) => {
  const { pizzaId } = req.params;

  try {
    const reviews = await Review.find({ pizza: pizzaId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a pizza
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  const { pizzaId, rating, comment } = req.body;

  try {
    // Check if user already reviewed this pizza
    const existingReview = await Review.findOne({ user: req.user.id, pizza: pizzaId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this pizza. You can edit your existing review instead.'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      pizza: pizzaId,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Review added successfully', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit user review
// @route   PUT /api/reviews/:id
// @access  Private
export const editReview = async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({ _id: id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save(); // triggers pre/post save ratings calculation hook

    res.status(200).json({ success: true, message: 'Review updated successfully', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({ _id: id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    }

    await review.deleteOne(); // triggers post delete ratings calculation hook

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
