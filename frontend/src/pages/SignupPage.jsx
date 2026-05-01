import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
  const [username, setUsername] = useState('');
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
      const response = await api.post('/auth/register', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign up. Please verify your input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" className="input" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" disabled={submitting} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" disabled={submitting} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" disabled={submitting} />
        </div>
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
    </section>
  );
}
