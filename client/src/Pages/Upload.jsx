import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Chart from "chart.js/auto";
import { FiUpload } from "react-icons/fi";
import "../stylesheets/upload.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Upload = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const chartRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [videoResult, setVideoResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    socketRef.current = io("https://proxy-handler-2.onrender.com");
    socketRef.current.on("progress_update", (data) => {
      setProgress(data.progress);
      setProcessing(true);
    });
    return () => socketRef.current.disconnect();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setVideoResult(null);
    setAudioResult(null);
    setError(null);
    setProgress(0);
    setUploading(true);
    setProcessing(true);

    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += Math.random() * 10;
      if (simulatedProgress < 95) setProgress(Math.min(95, simulatedProgress));
      else setProgress(95);
    }, 500);

    try {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      const videoResponse = await fetch("/api1/predict", {
        method: "POST",
        body: videoFormData,
      });

      if (!videoResponse.ok) throw new Error("Video analysis failed");
      const videoData = await videoResponse.json();
      setVideoResult(videoData);

      try {
        const convertFormData = new FormData();
        convertFormData.append("file", selectedFile);
        const convertResponse = await fetch("/api2/convert", {
          method: "POST",
          body: convertFormData,
          headers: { Accept: "application/json" },
        });

        if (!convertResponse.ok) throw new Error("Video to WAV conversion failed");
        const wavBlob = await convertResponse.blob();

        const audioFormData = new FormData();
        audioFormData.append("file", wavBlob, "audio.wav");
        const audioResponse = await fetch("/api2/predict", {
          method: "POST",
          body: audioFormData,
          mode: "cors",
          credentials: "omit",
          headers: { Accept: "application/json" },
        });

        if (!audioResponse.ok) throw new Error("Audio analysis failed");
        const audioData = await audioResponse.json();
        setAudioResult(audioData);
      } catch {
        setAudioResult(null);
      }

      setProgress(100);
    } catch {
      setError("Error analyzing file. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!chartRef.current || !audioResult?.segment_predictions?.length) return;
    const labels = audioResult.segment_predictions.map((_, i) => `Segment ${i + 1}`);
    const confidences = audioResult.segment_predictions.map((s) => s.confidence);
    const colors = audioResult.segment_predictions.map((s) =>
      s.prediction === "Fake" ? "#e74c3c" : "#27ae60"
    );

    if (chartRef.current.chartInstance)
      chartRef.current.chartInstance.destroy();

    chartRef.current.chartInstance = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Confidence", data: confidences, backgroundColor: colors }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 1, title: { display: true, text: "Confidence (0-1)" } },
          x: { title: { display: true, text: "Segment" } },
        },
      },
    });
  }, [audioResult]);

  return (
    <>
      <Navbar />

      <div className="register-wrapper upload-wrapper">
        {/* LEFT SIDE (same style as register page) */}
        <div className="register-left upload-left">
          <div className="register-intro">
            <h1>Deepfake Detection 🔍</h1>
            <p>
              Upload your video and get instant deepfake analysis powered by advanced AI.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-right upload-right">
          <div className="register-card upload-card">
            <h2>Upload Video</h2>
            <p className="register-sub">
              Verify authenticity with our dual analysis system.
            </p>

            <div className="upload-section-card">
              <div className="input-container upload-btn-container">
                <input
                  type="file"
                  id="fileUpload"
                  className="file-upload"
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileChange}
                />

                <button
                  className="btn-primary upload-btn"
                  type="button"
                  onClick={() => document.getElementById("fileUpload").click()}
                  disabled={uploading || processing}
                >
                  <FiUpload size={22} />
                  <span>Upload File</span>
                </button>
              </div>

              <p className="file-format-info">Formats: .mp4, .mov, .avi</p>

              
              <button
                className="btn-secondary link-btn"
                type="button"
                onClick={() => navigate("/link-upload")}
              >
                Upload Using Link
              </button>

              {fileName && <p className="file-name">Selected File: {fileName}</p>}
              {error && <p className="error-message">{error}</p>}

              {(uploading || processing) && (
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  <div className="progress-text">
                    {progress >= 100 ? "Completed!" : `${progress.toFixed(0)}%`}
                  </div>
                </div>
              )}
            </div>

            {/* VIDEO RESULTS */}
            {videoResult && (
              <div className="results-section">
                <h2>
                  Video Result:{" "}
                  <span
                    className={
                      videoResult.overall_result.startsWith("Fake")
                        ? "result-fake"
                        : "result-real"
                    }
                  >
                    {videoResult.overall_result}
                  </span>
                </h2>

                <p>Fake clips detected: {videoResult.fake_clip_count}</p>
                <p>Avg Lips Manipulation: {videoResult.avg_lips}%</p>
                <p>Avg Face Manipulation: {videoResult.avg_face}%</p>
              </div>
            )}

            {/* AUDIO RESULTS */}
            {videoResult && audioResult && (
              <div className="results-section">
                <h2>Audio Analysis</h2>
                <canvas ref={chartRef}></canvas>
              </div>
            )}

            {videoResult && audioResult === null && !uploading && !processing && (
              <p className="no-audio-message">Video contains no audio.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Upload;
