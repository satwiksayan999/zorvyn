export default function VideoPlayer({ videoUrl }) {
  return (
    <div className="video-player">
      <video controls src={videoUrl} preload="metadata" />
    </div>
  );
}
