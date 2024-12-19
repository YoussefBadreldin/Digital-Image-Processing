// src/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Adjust the path if needed
import Logo from "../assets/HOR_LOGO.png"; // Ensure this path is correct

function Navbar({ isLoggedIn, username }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="navbar-logo-image"
          />
        </Link>
      </div>
      <ul className="navbar-links">
        {/* Service buttons come first */}
        <li>
          <Link to="/enhance">
            <button className="navbar-button">Enhance a Photo</button>
          </Link>
        </li>
        <li>
          <Link to="/compress">
            <button className="navbar-button">Compress a Photo</button>
          </Link>
        </li>
        <li>
          <Link to="/segment">
            <button className="navbar-button">Segment a Photo</button>
          </Link>
        </li>

        {/* Sign In button if not logged in */}
        {!isLoggedIn && (
          <li>
            <Link to="/signin">
              <button className="navbar-button">Sign In</button>
            </Link>
          </li>
        )}

        {/* Login/Logout button logic */}
        {isLoggedIn && (
          <>
            <li>Welcome, {username}!</li>
            <li>
              <Link to="/logout">
                <button className="navbar-button">Logout</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
