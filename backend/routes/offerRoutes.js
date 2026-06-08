import express from 'express';
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from '../controllers/offerController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllOffers)
  .post(protect, admin, createOffer);

router.route('/:id')
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

export default router;
