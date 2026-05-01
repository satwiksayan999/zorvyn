import User from '../models/User.js';
import Video from '../models/Video.js';
import Subscription from '../models/Subscription.js';

export async function getUserProfile(req, res) {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const videos = await Video.find({ uploader: id }).sort({ createdAt: -1 });
  const subscriberCount = user.subscribersCount;
  const subscribed = req.user ? await Subscription.exists({ subscriber: req.user._id, channel: id }) : false;

  res.json({
    user,
    videos,
    subscriberCount,
    subscribed: Boolean(subscribed),
  });
}

export async function getCurrentUser(req, res) {
  res.json(req.user);
}
