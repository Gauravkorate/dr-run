import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHeartPulse,
  FaXmark,
} from "react-icons/fa6";

import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        <span>
          <FaHeartPulse />
        </span>

        DR.Run
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Open navigation menu"
      >
        {menuOpen ? <FaXmark /> : <FaBars />}
      </button>

      <div
        className={`navbar-content ${
          menuOpen ? "navbar-content-open" : ""
        }`}
      >
        <ul>
          <li>
            <a href="#why" onClick={closeMenu}>
              About
            </a>
          </li>

          <li>
            <a href="#work" onClick={closeMenu}>
              How It Works
            </a>
          </li>

          <li>
            <a href="#features" onClick={closeMenu}>
              Features
            </a>
          </li>

          <li>
            <a href="#stats" onClick={closeMenu}>
              Impact
            </a>
          </li>
        </ul>

        <Link
          to="/hospital/register"
          className="registerBtn"
          onClick={closeMenu}
        >
          Register
        </Link>
        <Link
          to="/select-role"
          className="loginBtn"
          onClick={closeMenu}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;