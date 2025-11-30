import React from "react";
import ReactDOM from "react-dom/client";
import PostDetail from "./components/PostDetail";

const App = () => <PostDetail postId="1" />;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
