// src/pages/Home.js
import React from "react";
import '../styles/Home.css'; // Should match the file name
import { Link } from "react-router-dom"; // Import Link for navigation

function Home() {
  return (
    <div className="container">
      <h1>Welcome to Digital Image Processing</h1>
      <p>Unleash the power of image processing</p>
      <div className="project-info">
        <h2>Developed by</h2>
        <ul>
          <li>20100294 - Youssef Mohamed Badreldin</li>
          <li>22101014 - Ahmed Hazem Mohamed Abdelhady</li>
          <li>22101140 - Ahmed Abdallah Mawad</li>
          <li>22101140 - Mahmoud Eid Khamis</li>
          <li>22101283 - Fatma Elzahraa Abdelmenam</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
