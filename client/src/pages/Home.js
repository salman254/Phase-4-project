import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import bgImage from "../assets/startup-bg.jpg";

const Home = () => {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="home-content">
        <h1>🚀 Welcome to the Startup Simulator</h1>
        <p className="lead">
          Create and manage fictional startups, invest in others, and simulate
          real-world startup funding — all in one platform.
        </p>
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-success">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
