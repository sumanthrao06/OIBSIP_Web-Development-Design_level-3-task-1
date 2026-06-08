import express from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  deleteUser
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enforce authentication and admin privileges globally for these routes
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

export default router;
