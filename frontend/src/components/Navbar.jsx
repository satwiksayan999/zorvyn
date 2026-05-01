import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const currentUserId = user?._id || user?.id;

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="navbar">
      <Link className="site-title" to="/">Zorvyn</Link>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search videos, creators, tags"
        />
      </form>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link className="button-secondary" to="/upload">Upload</Link>
        {user ? (
          <>
            <Link className="button-secondary" to={`/channel/${currentUserId}`}>{user.username}</Link>
            <button type="button" className="button-secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link className="button" to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
