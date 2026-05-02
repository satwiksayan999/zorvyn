import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  createVideoFromCloudinary,
  deleteVideo,
  getUploadSignature,
  getVideoById,
  getVideos,
  uploadVideo,
} from '../controllers/videoController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1_500_000_000 } });

router.get('/signature', protect, getUploadSignature);
router.post('/complete', protect, createVideoFromCloudinary);
router.post('/', protect, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.delete('/:id', protect, deleteVideo);

export default router;
