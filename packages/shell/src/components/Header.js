import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>📝 Blog</h1>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="header-link">
            Home
          </Link>
          <Link to="/posts" className="header-link">
            Posts
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
