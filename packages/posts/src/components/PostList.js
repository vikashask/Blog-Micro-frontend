import { useState } from "react";
import { mockPosts } from "../mockData";
import PostCard from "./PostCard";
import "./PostList.css";

const PostList = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts] = useState(mockPosts);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h1>Blog Posts</h1>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="post-list-search"
        />
      </div>

      <div className="post-list-grid">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick && onPostClick(post.id)}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="post-list-empty">
          No posts found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PostList;
