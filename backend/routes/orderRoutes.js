import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  reorder
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(createOrder)
  .get(admin, getAllOrders); // Only admin can fetch all orders via /api/orders

router.get('/my-orders', getMyOrders);
router.post('/:id/reorder', reorder);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', admin, updateOrderStatus); // Only admin can update statuses

export default router;
