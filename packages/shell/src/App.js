import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";

const PostList = lazy(() => import("posts/PostList"));
const PostDetail = lazy(() => import("postDetail/PostDetail"));

const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

const PostListPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary remoteName="Posts">
      <Suspense fallback={<LoadingFallback />}>
        <PostList onPostClick={(id) => navigate(`/posts/${id}`)} />
      </Suspense>
    </ErrorBoundary>
  );
};

const PostDetailPage = () => {
  const { id } = useParams();

  return (
    <ErrorBoundary remoteName="Post Detail">
      <Suspense fallback={<LoadingFallback />}>
        <PostDetail postId={id} />
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PostListPage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
