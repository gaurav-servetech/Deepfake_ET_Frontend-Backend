import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../stylesheets/upload.css";
import { FiLink2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LinkUpload = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleUrlCheck = async () => {
    setError(null);
    setVideoResult(null);
    setAudioResult(null);
    setFaceResult(null);
    setProgress(0);
    setUploading(true);
    setProcessing(true);

    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += Math.random() * 10;
      if (simulatedProgress < 95) {
        setProgress(Math.min(95, simulatedProgress));
      } else {
        setProgress(95);
      }
    }, 500);

    try {
      const res = await fetch(
        "https://deepfake-check-jpx9.onrender.com/deepfake-check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoUrl }),
        }
      );

      if (!res.ok) throw new Error("URL analysis failed");

      const data = await res.json();

      setFaceResult(data.face_result);
      setAudioResult(data.audio_result);
      setVideoResult(data.face_result);

      setProgress(100);
    } catch (err) {
      setError("Error analyzing URL. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-wrapper upload-wrapper">
        {/* LEFT SIDE */}
        <div className="register-left upload-left">
          <div className="register-intro">
            <h1>Deepfake Link Analysis 🔗</h1>
            <p>
              Paste a video link and instantly check its authenticity using our
              advanced AI.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-right upload-right">
          <div className="register-card upload-card">
            <h2>Paste Video URL</h2>
            <p className="register-sub">
              Works with YouTube, Instagram, Facebook, LinkedIn video links.
            </p>

            {/* URL INPUT CARD */}
            <div className="upload-section-card">
              <div className="url-input-container" style={{ flexDirection: "column", gap: "10px" }}>
                
                {/* CLASSIC PREMIUM INPUT */}
                <input
                  type="url"
                  className="link-paste-box"
                  placeholder="https://your-video-url.com"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />

                {/* CLASSIC PREMIUM BUTTON */}
                <button
                  className="link-upload-submit"
                  onClick={handleUrlCheck}
                  disabled={!videoUrl || uploading || processing}
                >
                  <FiLink2 size={18} style={{ marginRight: "6px" }} />
                  Check Video
                </button>
              </div>

              <p className="file-format-info">
                Supported: YouTube, Instagram, Facebook, LinkedIn video links.
              </p>
            </div>

            {/* ERROR */}
            {error && <p className="error-message">{error}</p>}

            {/* PROGRESS BAR */}
            {(uploading || processing) && (
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="progress-text">
                  {progress >= 100 ? "Completed!" : `${progress.toFixed(0)}%`}
                </div>
              </div>
            )}

            {/* RESULTS */}
            {videoResult && (
              <div className="results-section">
                <h2>Video Analysis Complete</h2>

                <p>
                  <strong>Avg Face Manipulation:</strong>{" "}
                  {videoResult.avg_face}%
                </p>
                <p>
                  <strong>Avg Lips Manipulation:</strong>{" "}
                  {videoResult.avg_lips}%
                </p>
              </div>
            )}

            {/* BACK TO UPLOAD */}
            <div className="upload-button-section" style={{ marginTop: "25px" }}>
              <p className="section-title">Have a Video File?</p>
              <button
                className="link-btn"
                onClick={() => navigate("/upload")}
              >
                Click Here!
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LinkUpload;
