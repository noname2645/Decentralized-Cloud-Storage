import React from "react";
import "../Stylesheets/landing.css"; // Ensure this file exists and is properly linked

const LandingPage = () => {
  return (
    <div>
      <div className="blur-background"></div>

      <h1>Decentralized Cloud Storage</h1>
      <p>Experience the next generation of data security with blockchain-powered cloud storage!</p>

      <div className="buttons">
        <a href="#" className="btn">Register</a>
        <a href="#" className="btn">Login</a>
      </div>
    </div>
  );
};

export default LandingPage;
