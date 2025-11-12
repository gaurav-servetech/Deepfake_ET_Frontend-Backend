import { Link } from "react-router-dom";
import "../stylesheets/hero.css";
import SampleVideo from "./SampleVideo";

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-background">
        <div className="animated-bg"></div>
      </div>
      <div className="hero-content">
        <div className="hero-video-circle">
          <SampleVideo />
        </div>
        <div className="hero-text">
          <h1 className="hero-main-title">
            Upload to <span>Uncover</span>
          </h1>
          <p className="hero-sub-title">AI That Spots the Lies!</p>
          <div className="hero-buttons">
            <Link to="/documentation">
              <button className="hero-button docs-button">
                View Documentation
              </button>
            </Link>
            <Link to="/upload">
              <button className="hero-button upload-button">
                Verify Video
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
