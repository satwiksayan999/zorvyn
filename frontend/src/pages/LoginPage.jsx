import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setError('');
      setSubmitting(true);
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" disabled={submitting} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" disabled={submitting} />
        </div>
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
    </section>
  );
}
