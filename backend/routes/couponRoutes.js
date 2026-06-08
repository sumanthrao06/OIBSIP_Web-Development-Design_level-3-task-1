import express from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All coupon endpoints require authentication

router.post('/validate', validateCoupon);

router.route('/')
  .get(getAllCoupons)
  .post(admin, createCoupon);

router.delete('/:id', admin, deleteCoupon);

export default router;
