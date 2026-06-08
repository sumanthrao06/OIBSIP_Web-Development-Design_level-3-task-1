import express from 'express';
import {
  getPizzaReviews,
  addReview,
  editReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to view pizza reviews
router.get('/pizza/:pizzaId', getPizzaReviews);

// Protected routes to write/modify reviews
router.use(protect);
router.post('/', addReview);
router.route('/:id')
  .put(editReview)
  .delete(deleteReview);

export default router;
