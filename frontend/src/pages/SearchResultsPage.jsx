import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import VideoCard from '../components/VideoCard.jsx';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) return;
    api.get('/search', { params: { query } })
      .then((response) => setResults(response.data));
  }, [query]);

  return (
    <section>
      <h1>Search results for “{query}”</h1>
      {results.length === 0 ? (
        <p>No videos found yet.</p>
      ) : (
        <div className="grid video-grid" style={{ marginTop: '1rem' }}>
          {results.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </section>
  );
}
