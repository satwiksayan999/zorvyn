import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import VideoPlayer from '../components/VideoPlayer.jsx';
import Comment from '../components/Comment.jsx';
import LikeSubscribeButtons from '../components/LikeSubscribeButtons.jsx';

export default function WatchPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get(`/videos/${id}`)
      .then((response) => setVideo(response.data));
    api.get(`/comments/${id}`)
      .then((response) => setComments(response.data));
    api.put(`/engagement/views/${id}`).catch(() => null);
  }, [id]);

  const handleLike = async () => {
    const response = await api.post('/engagement/like', { videoId: id });
    setLiked(response.data.liked);
    setVideo((prev) => ({ ...prev, likes: response.data.likes }));
  };

  const handleSubscribe = async () => {
    const response = await api.post('/engagement/subscribe', { channelId: video.uploader._id });
    setSubscribed(response.data.subscribed);
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    const response = await api.post('/comments', { videoId: id, text: commentText });
    setComments((current) => [response.data, ...current]);
    setCommentText('');
  };

  return (
    <section className="grid-two-column">
      <div className="video-player-wrapper">
        {video && (
          <>
            <div className="video-player">
              <VideoPlayer videoUrl={video.videoUrl} />
            </div>
            <div className="card-content">
              <h1>{video.title}</h1>
              <p className="meta-text">{video.views} views · {new Date(video.createdAt).toLocaleDateString()}</p>
              <p>{video.description}</p>
              <LikeSubscribeButtons
                likesCount={video.likes?.length ?? 0}
                liked={liked}
                onLike={handleLike}
                subscribed={subscribed}
                onSubscribe={handleSubscribe}
              />
            </div>
            <div className="comments">
              <h2>Comments</h2>
              <form onSubmit={handleComment} className="form-card">
                <div className="form-group">
                  <label htmlFor="comment">Add a comment</label>
                  <textarea
                    id="comment"
                    className="textarea"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Share your thoughts"
                  />
                </div>
                <button className="button" type="submit">Post comment</button>
              </form>
              {comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
            </div>
          </>
        )}
      </div>
      <aside className="sidebar">
        <h2>Recommended</h2>
        {video?.tags?.map((tag) => (
          <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="button-secondary" style={{ display: 'inline-block', margin: '0.25rem' }}>
            #{tag}
          </Link>
        ))}
      </aside>
    </section>
  );
}
