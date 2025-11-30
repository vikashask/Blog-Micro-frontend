import { Suspense, lazy, useEffect, useState } from "react";
import "./PostDetail.css";

const CommentThread = lazy(() => import("comments/CommentThread"));

const mockPost = {
  id: "1",
  title: "Getting Started with React Microfrontends",
  content: `
    <p>Microfrontends are a way to break up large frontend applications into smaller, more manageable pieces. This architectural pattern allows teams to work independently on different parts of the application.</p>
    
    <h2>What are Microfrontends?</h2>
    <p>Microfrontends extend the concepts of microservices to the frontend world. Instead of having a single monolithic frontend application, you break it down into smaller applications that can be developed, tested, and deployed independently.</p>
    
    <h2>Benefits</h2>
    <ul>
      <li>Independent deployment</li>
      <li>Team autonomy</li>
      <li>Technology flexibility</li>
      <li>Easier maintenance</li>
    </ul>
    
    <h2>Implementation with Module Federation</h2>
    <p>Webpack 5's Module Federation makes it easy to implement microfrontends by allowing you to dynamically load code from other applications at runtime.</p>
  `,
  author: {
    id: "author-1",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  publishedAt: "2024-01-15",
  tags: ["react", "microfrontends", "architecture"],
  coverImage: "https://picsum.photos/1200/400?random=1",
};

const PostDetail = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost);
      setLoading(false);
    }, 500);
  }, [postId]);

  if (loading) {
    return <div className="post-detail-loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="post-detail-error">Post not found</div>;
  }

  return (
    <article className="post-detail">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="post-detail-cover"
        />
      )}

      <div className="post-detail-container">
        <header className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-meta">
            <div className="post-detail-author">
              <img src={post.author.avatar} alt={post.author.name} />
              <span>{post.author.name}</span>
            </div>
            <time>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {post.tags && (
            <div className="post-detail-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-detail-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="post-detail-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-detail-comments">
          <h2>Comments</h2>
          <Suspense fallback={<div>Loading comments...</div>}>
            <CommentThread postId={postId} />
          </Suspense>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
