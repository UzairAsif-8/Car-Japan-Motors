import { Router } from 'express';
import { createVideo, getVideos, deleteVideo } from '../controllers/video.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateVideo } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getVideos);
router.post('/', authMiddleware, validateVideo, createVideo);
router.delete('/:id', authMiddleware, deleteVideo);

export default router;
