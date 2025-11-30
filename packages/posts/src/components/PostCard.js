import "./PostCard.css";

const PostCard = ({ post, onClick }) => {
  return (
    <article className="post-card" onClick={onClick} tabIndex={0}>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="post-card-image"
          loading="lazy"
        />
      )}
      <div className="post-card-content">
        <h2 className="post-card-title">{post.title}</h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-meta">
          <span className="post-card-author">{post.author.name}</span>
          <time className="post-card-date">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
          {post.readTime && (
            <span className="post-card-read-time">
              {post.readTime} min read
            </span>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
