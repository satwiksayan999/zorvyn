import express from 'express';
import { protect } from '../middleware/auth.js';
import { likeVideo, incrementViews, subscribe } from '../controllers/engagementController.js';

const router = express.Router();

router.post('/like', protect, likeVideo);
router.put('/views/:id', incrementViews);
router.post('/subscribe', protect, subscribe);

export default router;
