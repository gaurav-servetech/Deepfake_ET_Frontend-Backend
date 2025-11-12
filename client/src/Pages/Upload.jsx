/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import upload from "../assets/img/Upload.png";
import io from "socket.io-client";
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';
import { FiUpload } from "react-icons/fi";

const Upload = () => {
  const socketRef = useRef(null);
  const chartRef = useRef(null);
  const [file, setFile] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const handleUrlCheck = async () => {
    setError(null);
    setFileName("");
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
      const res = await fetch("https://deepfake-check-jpx9.onrender.com/deepfake-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!res.ok) {
        throw new Error("URL analysis failed");
      }

      const data = await res.json();
      setFaceResult(data.face_result);
      setAudioResult(data.audio_result);
      setVideoResult(data.face_result); // Use face_result as videoResult for consistency
      setProgress(100);
    } catch (err) {
      setError("Error analyzing URL. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProcessing(false);
    }
  };

  useEffect(() => {
    socketRef.current = io("https://proxy-handler-2.onrender.com");
    socketRef.current.on("progress_update", (data) => {
      setProgress(data.progress);
      setProcessing(true);
    });
    return () => socketRef.current.disconnect();
  }, []);

  // Render bar chart for audio segment predictions
  const renderBarChart = (segmentPredictions) => {
    if (!chartRef.current || !segmentPredictions || segmentPredictions.length === 0) return;
    const labels = segmentPredictions.map((seg, i) => `Segment ${i + 1}`);
    const confidences = segmentPredictions.map(seg => seg.confidence);
    const colors = segmentPredictions.map(seg => seg.prediction === 'Fake' ? '#e74c3c' : '#27ae60');
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }
    chartRef.current.chartInstance = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Confidence',
          data: confidences,
          backgroundColor: colors,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 1, title: { display: true, text: 'Confidence (0-1)' } },
          x: { title: { display: true, text: 'Segment' } },
        },
      },
    });
  };

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
      if (simulatedProgress < 95) {
        setProgress(Math.min(95, simulatedProgress));
      } else {
        setProgress(95);
      }
    }, 500);

    try {
      // 1. Send video for face/lips analysis
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      const videoResponse = await fetch("/api1/predict", {
        method: "POST",
        body: videoFormData,
      });

      if (!videoResponse.ok) {
        throw new Error("Video analysis failed");
      }
      const videoData = await videoResponse.json();
      setVideoResult(videoData);

      // 2. Convert video to wav and analyze audio
      try {
        const convertFormData = new FormData();
        convertFormData.append("file", selectedFile);
        const convertResponse = await fetch("/api2/convert", {
          method: "POST",
          body: convertFormData,
          headers: { 'Accept': 'application/json' },
        });

        if (!convertResponse.ok) throw new Error("Video to WAV conversion failed");
        const wavBlob = await convertResponse.blob();

        const audioFormData = new FormData();
        audioFormData.append("file", wavBlob, "audio.wav");
        const audioResponse = await fetch("/api2/predict", {
          method: "POST",
          body: audioFormData,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!audioResponse.ok) throw new Error("Audio analysis failed");
        const audioData = await audioResponse.json();
        setAudioResult(audioData);
      } catch (audioErr) {
        setAudioResult(null);
      }

      setProgress(100);
    } catch (err) {
      setError("Error analyzing file. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (audioResult && audioResult.segment_predictions) {
      renderBarChart(audioResult.segment_predictions);
    }
  }, [audioResult]);



  return (
    <div>
      <div className="upload-page-container">
        <Navbar />
        <div className="upload-page">
          <p className="upload-page-title">
            Verify before you trust! Detect deepfakes now.
          </p>
          <p className="upload-page-sub-title">
            Drop your video to verify authenticity.
          </p>
          <div className="upload-area">
            {/* File Upload Section */}
            <div className="upload-section">
              <h3 className="section-title">Upload video file</h3>
              <div className="input-container upload-btn-container">
                <input
                  type="file"
                  id="fileUpload"
                  className="file-upload"
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileChange}
                />
                <button
                  className="custom-upload-btn"
                  type="button"
                  onClick={() => document.getElementById('fileUpload').click()}
                  disabled={uploading || processing}
                >
                  <FiUpload size={24} style={{ marginRight: '8px' }} />
                  <span className="custom-upload-btn-text">Upload</span>
                </button>
              </div>
              <div className="file-format-info">
                Accepted formats: .mp4, .mov, .avi
              </div>
            </div>
            {/* Direct URL Section */}
            <div className="url-section">
              <h3 className="section-title">Or enter direct video URL</h3>
              <div className="url-input-container">
                <input
                  type="url"
                  className="url-input"
                  placeholder="https://your-video-url.com"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
                <button className="custom-upload-btn" onClick={handleUrlCheck} disabled={!videoUrl || uploading || processing}>
                  <span className="custom-upload-btn-text">Check</span>
                </button>
              </div>
              <div className="file-format-info">
                Accepted links: YouTube, Instagram and LinkedIn videos
              </div>
            </div>
          </div>

          {fileName && <p className="file-name">Selected File: {fileName}</p>}
          {error && <p className="error-message">{error}</p>}

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

          {/* Show face/lips results if videoResult is present and (audioResult is present OR (audioResult is null and not uploading/processing)) */}
          {videoResult && (audioResult || (audioResult === null && !uploading && !processing)) && (
            <div className="results-container video-results-flex">
              <div className="video-results-main">
                <h2>
                  Video Analysis Results:{" "}
                  <span
                    className={videoResult.overall_result.startsWith("Fake") ? "result-fake" : "result-real"}
                  >
                    {videoResult.overall_result.startsWith("Fake")
                      ? `🚨 ${videoResult.overall_result}`
                      : `✅ ${videoResult.overall_result}`}
                  </span>
                </h2>
                <p className="video-fake-clips">
                  Fake clips detected: {videoResult.fake_clip_count}
                </p>

                <p className="video-avg-lips">
                  <strong>Average Lips Manipulation:</strong> {videoResult.avg_lips}%
                </p>
                <p className="video-avg-face">
                  <strong>Average Face Manipulation:</strong> {videoResult.avg_face}%
                </p>

                {Array.isArray(videoResult.segments) && videoResult.segments.length > 0 && (
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Time Range (s)</th>
                        <th>Lips Manipulation (%)</th>
                        <th>Face Manipulation (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoResult.segments.map((row, index) => (
                        <tr key={index}>
                          <td>{row["Time Range (s)"]}</td>
                          <td>{row["lips Manipulation(%)"]}</td>
                          <td>{row["Face Manipulation(%)"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Show audio results only if both are present */}
          {videoResult && audioResult && (
            <div className="results-container audio-results">
              <h2>Audio Analysis Results</h2>
              <div className="audio-results-flex">
                <div className="audio-overall-card">
                  <h3>Overall Analysis</h3>
                  <div className="audio-overall-flex">
                    <div className="audio-overall-main">
                      <div className="audio-fake">
                        Fake Audio({((audioResult.fake_segments / audioResult.segment_count) * 100).toFixed(2)}%)
                      </div>
                    </div>
                    <div className="audio-gauge">
                      {(() => {
                        const fakePercent = (audioResult.fake_segments / audioResult.segment_count) * 100;
                        const gaugeColor = '#EF553B'; // Always red for fake percentage
                        return (
                          <div className="audio-gauge-circle" style={{ background: `conic-gradient(${gaugeColor} ${fakePercent}%, #eee ${fakePercent}%)` }}>
                            <div className="audio-gauge-inner">
                              {fakePercent.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="audio-segments-grid">
                    <div className="audio-segment-stat">
                      <div className="audio-segment-count">{audioResult.segment_count}</div>
                      <div className="audio-segment-label">Total Segments</div>
                    </div>
                    <div className="audio-segment-stat">
                      <div className="audio-segment-fake">{audioResult.fake_segments}</div>
                      <div className="audio-segment-label">Fake Segments</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="audio-segment-details-card">
                <h3>Segment Details</h3>
                <div className="audio-segment-table-wrapper">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Segment</th>
                        <th>Prediction</th>
                        <th>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audioResult.segment_predictions
                        .map((seg, index) => ({ ...seg, index }))
                        .filter(seg => seg.prediction === 'Fake')
                        .map((seg) => (
                          <tr key={seg.index}>
                            <td>{`${seg.index * 2}-${(seg.index + 1) * 2}`}</td>
                            <td className={seg.prediction === 'Fake' ? 'audio-fake' : 'audio-real'}>
                              {seg.prediction}
                            </td>
                            <td>{(seg.confidence * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Show 'no audio' message only if videoResult is present, audioResult is null, and not uploading/processing */}
          {videoResult && audioResult === null && !uploading && !processing && (
            <div className="no-audio-message">
              Video contains no audio.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
