import { useRef, useState } from 'react';
import api from '../services/api.js';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const uploadInProgress = useRef(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setVideoFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (uploadInProgress.current) return;

    if (!videoFile || !title) {
      setMessage('Please provide a video file and title.');
      return;
    }

    uploadInProgress.current = true;
    setUploading(true);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    try {
      setMessage('Uploading...');
      await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
      setMessage('Video uploaded successfully.');
      setProgress(0);
      setTitle('');
      setDescription('');
      setTags('');
      setVideoFile(null);
      setPreviewUrl('');
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      uploadInProgress.current = false;
      setUploading(false);
    }
  };

  return (
    <section className="form-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1>Upload New Video</h1>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Video title" disabled={uploading} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell viewers about your video" disabled={uploading} />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input id="tags" className="input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Separate tags with commas" disabled={uploading} />
        </div>
        <div className="form-group">
          <label htmlFor="video">Video file</label>
          <input id="video" type="file" accept="video/*" onChange={handleFileSelect} disabled={uploading} />
        </div>
        {previewUrl && (
          <div style={{ marginBottom: '1rem' }}>
            <video controls src={previewUrl} style={{ width: '100%', borderRadius: '1rem' }} />
          </div>
        )}
        {progress > 0 && <progress value={progress} max="100">{progress}%</progress>}
        <button className="button" type="submit" style={{ marginTop: '1rem' }} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </section>
  );
}
