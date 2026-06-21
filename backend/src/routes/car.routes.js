import { Router } from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/car.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { uploadCarImages } from '../middlewares/upload.middleware.js';

const router = Router();

// Public
router.get('/', getCars);
router.get('/:id', getCarById);

// Admin (JWT protected). `uploadCarImages` parses multipart + image files.
router.post('/', authMiddleware, uploadCarImages, createCar);
router.put('/:id', authMiddleware, uploadCarImages, updateCar);
router.delete('/:id', authMiddleware, deleteCar);

export default router;
