import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import upload from "../assets/img/Upload.png";
import io from "socket.io-client";

const Upload = () => {
  const socketRef = useRef(null); // useRef for persistent socket
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initialize socket connection and listen for progress updates
    socketRef.current = io("https://proxy-handler-2.onrender.com");

    socketRef.current.on("progress_update", (data) => {
      console.log("⬆️ Progress received:", data.progress);
      setProgress(data.progress);
      setProcessing(true);
    });

    return () => socketRef.current.disconnect(); // Clean up on unmount
  }, []);

  // Inside the Upload component...

const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  setFile(selectedFile);
  setFileName(selectedFile.name);

  // Reset previous state
  setResult(null);
  setError(null);
  setProgress(0);
  setUploading(true);
  setProcessing(true);

  const formData = new FormData();
  formData.append("file", selectedFile);

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
    const response = await fetch("https://proxy-handler-2.onrender.com/api/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    setResult(data);
    setProgress(100);
  } catch (err) {
    console.error("Upload error:", err);
    setError("Error uploading file. Please try again.");
  } finally {
    clearInterval(progressInterval);
    setUploading(false);
    setProcessing(false);
  }
};

  return (
    <div className="upload-page-container">
      <Navbar />
      <div className="upload-page">
        <p className="upload-page-title">
          Verify before you trust. Detect deepfakes now.
        </p>
        <p className="upload-page-sub-title">
          Drop your video or enter a link to verify authenticity.
        </p>
        <div className="input-container">
          <input
            type="url"
            className="url-input"
            placeholder="https://www.elevatetrust.ai"
          />
          <label htmlFor="fileUpload" className="upload-icon">
            <img src={upload} alt="Upload" />
          </label>
          <input
            type="file"
            id="fileUpload"
            className="file-upload"
            onChange={handleFileChange}
          />
          
        </div>

        {fileName && <p className="file-name">Selected File: {fileName}</p>}

        {error && <p className="error-message">{error}</p>}

        {(uploading || processing) && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
            ></div>
            <div className="progress-text">
              {progress >= 100 ? "Completed!" : `${progress.toFixed(0)}%`}
            </div>
          </div>
        )}

        {result && (
          <div className="results-container">
            <h2>
              Results:{" "}
              <span
                style={{
                  color: result.overall_result.startsWith("Fake") ? "red" : "green",
                }}
              >
                {result.overall_result.startsWith("Fake")
                  ? `🚨 ${result.overall_result}`
                  : `✅ ${result.overall_result}`}
              </span>
            </h2>

            <p style={{ fontWeight: "bold" }}>
              Fake clips detected: {result.fake_clip_count}
            </p>

            {/* ✅ New Averages */}
            <p style={{ marginTop: "10px" }}>
              <strong>Average Lips Manipulation:</strong> {result.avg_lips}%
            </p>
            <p>
              <strong>Average Face Manipulation:</strong> {result.avg_face}%
            </p>

            {Array.isArray(result.segments) && result.segments.length > 0 && (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Time Range (s)</th>
                    <th>Lips Manipulation (%)</th>
                    <th>Face Manipulation (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.segments.map((row, index) => (
                    <tr key={index}>
                      <td>{row["Time Range (s)"]}</td>
                      <td>{row["lips Manipulation(%)"]}</td>
                      <td>{row["Face Manipulation(%)"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 🔥 New Video Player Section */}
            {result.video_path && (
              <div className="video-player-container" style={{ marginTop: "20px" }}>
                <h3>Uploaded Video:</h3>
                <video
                  src={`https://proxy-handler-2.onrender.com/api/uploads/${result.video_path.split("/").pop()}`}
                  controls
                  style={{ width: "100%", maxWidth: "720px", borderRadius: "10px" }}
                ></video>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
