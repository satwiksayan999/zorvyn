import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import VideoCard from '../components/VideoCard.jsx';

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Latest', value: 'latest' },
];

function mergeUniqueVideos(currentVideos, newVideos) {
  const existingIds = new Set(currentVideos.map((video) => video._id));
  const uniqueNewVideos = newVideos.filter((video) => !existingIds.has(video._id));
  return [...currentVideos, ...uniqueNewVideos];
}

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('trending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVideos([]);
    setPage(1);
  }, [sort]);

  useEffect(() => {
    let ignoreResponse = false;

    setLoading(true);
    api.get('/videos', { params: { page, limit: 12, sort } })
      .then((response) => {
        if (!ignoreResponse) {
          setVideos((current) => mergeUniqueVideos(current, response.data));
        }
      })
      .finally(() => {
        if (!ignoreResponse) {
          setLoading(false);
        }
      });

    return () => {
      ignoreResponse = true;
    };
  }, [page, sort]);

  const handleScroll = useMemo(() => {
    const listener = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 260 && !loading) {
        setPage((prev) => prev + 1);
      }
    };
    return listener;
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Trending videos</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={sort === option.value ? 'button' : 'button-secondary'}
              type="button"
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid video-grid" style={{ marginTop: '1rem' }}>
        {videos.map((video) => <VideoCard key={video._id} video={video} />)}
      </div>
      {loading && <p style={{ marginTop: '1rem' }}>Loading more videos...</p>}
    </section>
  );
}
