import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import VideoCard from '../components/VideoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChannelPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [deletingVideoId, setDeletingVideoId] = useState('');

  const currentUserId = user?._id || user?.id;
  const isOwner = currentUserId === id;

  useEffect(() => {
    api.get(`/users/${id}`)
      .then((response) => setChannel(response.data))
      .catch(() => null);
  }, [id]);

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm('Remove this video from your channel?');
    if (!confirmed) return;

    try {
      setDeletingVideoId(videoId);
      await api.delete(`/videos/${videoId}`);
      setChannel((current) => ({
        ...current,
        videos: current.videos.filter((video) => video._id !== videoId),
      }));
    } finally {
      setDeletingVideoId('');
    }
  };

  return (
    <section>
      <div className="form-card">
        <h1>{channel?.user.username || 'Channel'}</h1>
        <p className="meta-text">{channel?.subscriberCount ?? 0} subscribers</p>
      </div>
      <div className="grid video-grid" style={{ marginTop: '1rem' }}>
        {channel?.videos?.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onDelete={isOwner ? handleDeleteVideo : undefined}
            deleting={deletingVideoId === video._id}
          />
        ))}
      </div>
    </section>
  );
}
