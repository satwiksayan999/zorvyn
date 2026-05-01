import Video from '../models/Video.js';
import User from '../models/User.js';

export async function searchVideos(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }

  const regex = new RegExp(query, 'i');
  const creators = await User.find({ username: regex }).select('_id');

  const videos = await Video.find({
    $or: [
      { title: regex },
      { description: regex },
      { tags: regex },
      { uploader: { $in: creators.map((user) => user._id) } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate('uploader', 'username subscribersCount');

  res.json(videos);
}
