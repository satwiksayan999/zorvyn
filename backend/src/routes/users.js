import express from 'express';
import { protect, optionalProtect } from '../middleware/auth.js';
import { getUserProfile, getCurrentUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.get('/:id', optionalProtect, getUserProfile);

export default router;
