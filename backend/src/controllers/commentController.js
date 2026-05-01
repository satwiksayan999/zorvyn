import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

export async function addComment(req, res) {
  const { videoId, text } = req.body;
  if (!text || !videoId) {
    return res.status(400).json({ message: 'Comment text and video ID are required' });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    text,
  });

  res.status(201).json(comment);
}

export async function getComments(req, res) {
  const { videoId } = req.params;
  const comments = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .populate('user', 'username');
  res.json(comments);
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (!comment.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
}
