import { Link } from "react-router-dom";

import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            Simple tools for smarter investing
          </div>

          <h1>
            Make better decisions
            <br />
            with better data.
          </h1>

          <p>
            Stock Dashboard is designed to make market information
            easier to explore, understand and analyse — all in one
            simple platform.
          </p>

          <div className="hero-buttons">
            <Link to="/stocks" className="primary-button">
              Explore Stocks
            </Link>

            <Link to="/about" className="secondary-button">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="introduction">
        <div className="introduction-content">
          <h2>Built for clear market analysis</h2>

          <p>
            Financial markets generate enormous amounts of information.
            Our aim is to make that information easier to access and
            easier to understand.
          </p>

          <p>
            Stock Dashboard brings together the tools and data you need
            to research companies, analyse price trends and make more
            informed investment decisions.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;