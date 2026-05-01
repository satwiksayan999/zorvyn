export default function Comment({ comment }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{comment.user?.username || 'Anonymous'}</p>
      <p style={{ margin: '0.25rem 0 0', color: '#cbd5e1' }}>{comment.text}</p>
      <p className="meta-text">{new Date(comment.createdAt).toLocaleString()}</p>
    </div>
  );
}
