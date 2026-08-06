import { Link } from "react-router-dom";

import {
  FaArrowUp,
  FaHeartPulse,
} from "react-icons/fa6";

import "../styles/footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-section">
            <Link to="/" className="footer-logo">
              <span>
                <FaHeartPulse />
              </span>

              DR.Run
            </Link>

            <p className="footer-description">
              A modern hospital queue management system built to
              simplify patient registration, doctor queues and
              real-time communication.
            </p>

             
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <div className="footer-navigation">
              <a href="#why">About DR.Run</a>
              <a href="#work">How It Works</a>
              <a href="#features">Features</a>
              <a href="#stats">Impact</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Hospital Login</h3>

            <div className="footer-navigation">
              <Link to="/doctor/login">
                Doctor Login
              </Link>

              <Link to="/receptionist/login">
                Receptionist Login
              </Link>

              <Link to="/select-role">
                Select Your Role
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-cta">
          <div>
            <span>Ready to begin?</span>

            <h2>
              Start managing patient queues more efficiently.
            </h2>

            <p>
              Enter the hospital system and choose the appropriate
              dashboard for doctors or receptionists.
            </p>
          </div>

          <Link
            to="/select-role"
            className="footer-start-button"
          >
            Enter DR.Run
          </Link>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} DR.Run. Built for smarter hospital
            queue management.
          </p>

          <button
            type="button"
            className="scroll-top-button"
            onClick={scrollToTop}
            aria-label="Scroll to the top of the page"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;