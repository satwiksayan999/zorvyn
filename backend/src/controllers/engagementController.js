import Video from '../models/Video.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

export async function likeVideo(req, res) {
  const { videoId } = req.body;
  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const liked = video.likes.some((id) => id.equals(req.user._id));
  if (liked) {
    video.likes = video.likes.filter((id) => !id.equals(req.user._id));
  } else {
    video.likes.push(req.user._id);
  }

  await video.save();
  res.json({ likes: video.likes.length, liked: !liked });
}

export async function incrementViews(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  video.views += 1;
  await video.save();
  res.json({ views: video.views });
}

export async function subscribe(req, res) {
  const { channelId } = req.body;
  if (req.user._id.equals(channelId)) {
    return res.status(400).json({ message: 'Cannot subscribe to yourself' });
  }

  const channel = await User.findById(channelId);
  if (!channel) return res.status(404).json({ message: 'Channel not found' });

  const existing = await Subscription.findOne({ subscriber: req.user._id, channel: channelId });
  if (existing) {
    await existing.deleteOne();
    channel.subscribersCount = Math.max(0, channel.subscribersCount - 1);
    await channel.save();
    return res.json({ subscribed: false, subscribersCount: channel.subscribersCount });
  }

  await Subscription.create({ subscriber: req.user._id, channel: channelId });
  channel.subscribersCount += 1;
  await channel.save();
  res.json({ subscribed: true, subscribersCount: channel.subscribersCount });
}
