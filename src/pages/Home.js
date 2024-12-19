// src/pages/Home.js
import React from "react";
import '../styles/Home.css'; // Should match the file name
import { Link } from "react-router-dom"; // Import Link for navigation

function Home() {
  return (
    <div className="container">
      <h1>Welcome to</h1>
      <h1>Digital Image Processing</h1>
      <p>Unleash the power of image processing</p>
    </div>
  );
}

export default Home;
