import express from 'express';
import {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} from '../controllers/pizzaController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllPizzas)
  .post(protect, admin, createPizza);

router.route('/:id')
  .get(getPizzaById)
  .put(protect, admin, updatePizza)
  .delete(protect, admin, deletePizza);

export default router;
