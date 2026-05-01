import cloudinary from '../config/cloudinary.js';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

function uploadVideoStream(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'zorvyn/videos', chunk_size: 6000000 },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

export async function uploadVideo(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Video file is required' });
  }

  const { title, description, tags } = req.body;
  try {
    const result = await uploadVideoStream(req.file.buffer);

    const thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: 'video', format: 'jpg', start_offset: '1', width: 640, height: 360, crop: 'scale', quality: 'auto', fetch_format: 'auto', secure: true,
    });

    const video = await Video.create({
      title,
      description,
      videoUrl: result.secure_url,
      thumbnailUrl,
      uploader: req.user._id,
      tags: tags?.split(',').map((tag) => tag.trim()).filter(Boolean) || [],
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
}

export async function getVideos(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const sort = req.query.sort === 'latest' ? { createdAt: -1 } : { views: -1 };

  const videos = await Video.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('uploader', 'username subscribersCount');

  res.json(videos);
}

export async function getVideoById(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id).populate('uploader', 'username subscribersCount');
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }
  res.json(video);
}

export async function deleteVideo(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }
  if (!video.uploader.equals(req.user._id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  await Comment.deleteMany({ video: video._id });
  await video.deleteOne();
  res.json({ message: 'Video removed' });
}
