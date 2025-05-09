// src/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Ensure this path is correct
import Logo from "../assets/HOR_LOGO.png"; // Ensure this path is correct

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track the dropdown menu
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" className="navbar-logo-image" />
        </Link>
      </div>
      
      {/* Hamburger icon for mobile */}
      <div className="navbar-hamburger" onClick={toggleMenu}>
        &#9776; {/* Unicode hamburger icon */}
      </div>

      {/* Links that will show up on mobile in dropdown */}
      <ul className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
        <li>
          <Link to="/signin">
            <button className="navbar-button">Sign In</button>
          </Link>
        </li>
        <li>
          <Link to="/signup">
            <button className="navbar-button">Sign Up</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
