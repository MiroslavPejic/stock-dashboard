import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">↗</span>
            Stock Dashboard
          </Link>
          <p>
            Simple tools for exploring and analysing
            financial market data.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/stocks">Stocks</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-column">
            <h3>Project</h3>
            <span>React</span>
            <span>Node.js</span>
            <span>Yahoo Finance</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © 2026 Stock Dashboard
        </span>
        <span>
          Built for learning &amp; exploration
        </span>
      </div>
    </footer>
  );
}

export default Footer;