export default function LikeSubscribeButtons({ likesCount, liked, onLike, subscribed, onSubscribe }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <button className="button-secondary" type="button" onClick={onLike}>
        {liked ? 'Unlike' : 'Like'} ({likesCount})
      </button>
      <button className="button" type="button" onClick={onSubscribe}>
        {subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  );
}
