import React from "react";
import ReactDOM from "react-dom/client";
import PostList from "./components/PostList";

const App = () => (
  <PostList onPostClick={(id) => console.log("Post clicked:", id)} />
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
