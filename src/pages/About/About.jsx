import "./About.css";

function About() {
  return (
    <main className="about-page">
      <header className="about-header">
        <span className="about-eyebrow">
          About Stock Dashboard
        </span>
        <h1>
          Making market data
          <br />
          easier to understand.
        </h1>
        <p>
          Stock Dashboard is a learning project designed to make
          financial market information easier to explore, analyse
          and understand.
        </p>
      </header>
      <section className="about-section">
        <h2>What is Stock Dashboard?</h2>
        <p>
          Financial markets generate enormous amounts of data every
          day. Stock Dashboard brings some of that information
          together in a simple interface, allowing users to explore
          companies, historical prices and technical indicators.
        </p>
        <p>
          The project is being developed with a focus on simplicity,
          usability and learning modern web development technologies.
        </p>
      </section>
      <section className="about-section">
        <h2>Built with</h2>
        <p>
          The application combines a React frontend with a Node.js
          backend and external financial market data.
        </p>
        <div className="about-tech-grid">
          <div className="about-tech-card">
            <span className="about-tech-icon">⚛</span>
            <div>
              <h3>React</h3>
              <p>
                Used to build the interactive frontend
                application.
              </p>
            </div>
          </div>
          <div className="about-tech-card">
            <span className="about-tech-icon">◈</span>
            <div>
              <h3>Vite</h3>
              <p>
                Provides a fast development environment
                for the React application.
              </p>
            </div>
          </div>
          <div className="about-tech-card">
            <span className="about-tech-icon">JS</span>
            <div>
              <h3>Node.js</h3>
              <p>
                Provides the backend layer for retrieving
                financial data.
              </p>
            </div>
          </div>
          <div className="about-tech-card">
            <span className="about-tech-icon">↗</span>
            <div>
              <h3>Yahoo Finance</h3>
              <p>
                Provides historical stock market data
                used by the application.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="about-section">
        <h2>What can you analyse?</h2>
        <div className="about-features">
          <div>
            <strong>Historical Prices</strong>
            <p>
              Explore historical daily stock prices and
              market performance.
            </p>
          </div>
          <div>
            <strong>Moving Averages</strong>
            <p>
              Analyse 20, 50, 100 and 200-day moving
              averages.
            </p>
          </div>
          <div>
            <strong>RSI</strong>
            <p>
              Use the Relative Strength Index as another
              technical analysis tool.
            </p>
          </div>
        </div>
      </section>
      <div className="about-disclaimer">
        <strong>Important:</strong>
        <span>
          Stock Dashboard is an educational project and
          is not intended to provide financial advice or
          investment recommendations.
        </span>
      </div>
    </main>
  );
}

export default About;