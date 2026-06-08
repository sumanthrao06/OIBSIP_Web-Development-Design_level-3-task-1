import express from 'express';
import {
  getFavorites,
  saveFavorite,
  deleteFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all favorite routes

router.route('/')
  .get(getFavorites)
  .post(saveFavorite);

router.delete('/:id', deleteFavorite);

export default router;
