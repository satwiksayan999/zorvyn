import cloudinary from '../config/cloudinary.js';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

const VIDEO_FOLDER = 'zorvyn/videos';

function uploadVideoStream(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: VIDEO_FOLDER, chunk_size: 6000000 },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

function buildThumbnailUrl(publicId) {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    start_offset: '1',
    width: 640,
    height: 360,
    crop: 'scale',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
}

function parseTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return tags?.split(',').map((tag) => tag.trim()).filter(Boolean) || [];
}

export async function getUploadSignature(req, res) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    folder: VIDEO_FOLDER,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: VIDEO_FOLDER,
    resourceType: 'video',
    timestamp,
    signature,
  });
}

export async function createVideoFromCloudinary(req, res) {
  const { title, description, tags, publicId, videoUrl } = req.body;

  if (!title?.trim() || !publicId || !videoUrl) {
    return res.status(400).json({ message: 'Title, public ID, and video URL are required' });
  }

  const video = await Video.create({
    title: title.trim(),
    description,
    videoUrl,
    thumbnailUrl: buildThumbnailUrl(publicId),
    uploader: req.user._id,
    tags: parseTags(tags),
  });

  res.status(201).json(video);
}

export async function uploadVideo(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Video file is required' });
  }

  const { title, description, tags } = req.body;
  try {
    const result = await uploadVideoStream(req.file.buffer);

    const video = await Video.create({
      title,
      description,
      videoUrl: result.secure_url,
      thumbnailUrl: buildThumbnailUrl(result.public_id),
      uploader: req.user._id,
      tags: parseTags(tags),
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
