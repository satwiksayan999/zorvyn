import express from 'express';
import { protect } from '../middleware/auth.js';
import { addComment, getComments, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/:videoId', getComments);
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;
