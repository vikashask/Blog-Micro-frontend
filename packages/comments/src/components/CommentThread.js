import { useState } from "react";
import "./CommentThread.css";

const mockComments = [
  {
    id: "1",
    author: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    content:
      "Great article! This really helped me understand microfrontends better.",
    createdAt: "2024-01-16",
    likes: 5,
  },
  {
    id: "2",
    author: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?img=6",
    content:
      "Could you provide more examples of Module Federation configuration?",
    createdAt: "2024-01-17",
    likes: 2,
  },
  {
    id: "3",
    author: "Carol White",
    avatar: "https://i.pravatar.cc/150?img=7",
    content: "I implemented this in my project and it works perfectly. Thanks!",
    createdAt: "2024-01-18",
    likes: 8,
  },
];

const CommentThread = ({ postId }) => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("newComment", newComment);
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: "You",
        avatar: "https://i.pravatar.cc/150?img=10",
        content: newComment,
        createdAt: new Date().toISOString().split("T")[0],
        likes: 0,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <div className="comment-thread">
      <div className="comment-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
            rows="3"
          />
          <button type="submit" className="comment-submit">
            Post Comment
          </button>
        </form>
      </div>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="comment-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <time className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-actions">
                <button className="comment-like">👍 {comment.likes}</button>
                <button className="comment-reply">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentThread;
