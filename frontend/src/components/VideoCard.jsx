import { Link } from 'react-router-dom';

export default function VideoCard({ video, onDelete, deleting = false }) {
  return (
    <article className="card">
      <Link to={`/watch/${video._id}`}>
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
      </Link>
      <div className="card-content">
        <h3 className="card-title">{video.title}</h3>
        <p className="meta-text">{video.uploader?.username || 'Creator'} - {video.views} views</p>
        {onDelete && (
          <button
            className="button-danger"
            type="button"
            onClick={() => onDelete(video._id)}
            disabled={deleting}
            style={{ marginTop: '0.75rem' }}
          >
            {deleting ? 'Removing...' : 'Remove'}
          </button>
        )}
      </div>
    </article>
  );
}
