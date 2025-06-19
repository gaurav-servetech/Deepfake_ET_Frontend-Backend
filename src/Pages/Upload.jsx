/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import upload from "../assets/img/Upload.png";
import io from "socket.io-client";
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';

const Upload = () => {
  const socketRef = useRef(null);
  const chartRef = useRef(null);
  const [file, setFile] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);

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
      const videoResponse = await fetch("http://103.22.140.216:5051//predict", {
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
        const convertResponse = await fetch("http://103.22.140.216:5000/convert", {
          method: "POST",
          body: convertFormData,
          headers: { 'Accept': 'application/json' },
        });

        if (!convertResponse.ok) throw new Error("Video to WAV conversion failed");
        const wavBlob = await convertResponse.blob();

        const audioFormData = new FormData();
        audioFormData.append("file", wavBlob, "audio.wav");
        const audioResponse = await fetch("http://103.22.140.216:5000/predict", {
          method: "POST",
          body: audioFormData,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
            'Origin': 'http://localhost:5174'
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

  function ResultPieChart({ fakePercent, realPercent }) {
    const canvasRef = useRef(null);

    React.useEffect(() => {
      if (!canvasRef.current) return;
      const chart = new Chart(canvasRef.current, {
        type: 'pie',
        data: {
          labels: ['Fake', 'Real'],
          datasets: [
            {
              data: [fakePercent, realPercent],
              backgroundColor: ['#e74c3c', '#27ae60'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#222',
                font: { size: 16, weight: 'bold' },
              },
            },
          },
        },
      });
      return () => chart.destroy();
    }, [fakePercent, realPercent]);

    return <canvas ref={canvasRef} width={220} height={220} />;
  }

  ResultPieChart.propTypes = {
    fakePercent: PropTypes.number.isRequired,
    realPercent: PropTypes.number.isRequired,
  };

  return (
    <div>
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
                style={{ width: `${progress}%` }}
              ></div>
              <div className="progress-text">
                {progress >= 100 ? "Completed!" : `${progress.toFixed(0)}%`}
              </div>
            </div>
          )}

          {videoResult && (
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
              <div className="video-results-pie">
                <ResultPieChart
                  fakePercent={parseFloat(videoResult.overall_result.match(/([\d.]+)/)?.[0] || 0)}
                  realPercent={100 - parseFloat(videoResult.overall_result.match(/([\d.]+)/)?.[0] || 0)}
                />
                <div className="confidence-score-label">
                  Confidence Score
                </div>
              </div>
            </div>
          )}

          {videoResult && audioResult === null && (
            <div className="no-audio-message">
              Video contains no audio.
            </div>
          )}

          {audioResult && (
            <div className="results-container audio-results">
              <h2>Audio Analysis Results</h2>
              <div className="audio-results-flex">
                <div className="audio-overall-card">
                  <h3>Overall Analysis</h3>
                  <div className="audio-overall-flex">
                    <div className="audio-overall-main">
                      <div className="audio-fake">
                        Fake ({((audioResult.fake_segments / audioResult.segment_count) * 100).toFixed(2)}%)
                      </div>
                      <div className="audio-confidence">
                        Average Fake Confidence: {
                          (() => {
                            const fakeSegs = audioResult.segment_predictions.filter(seg => seg.prediction === 'Fake');
                            if (fakeSegs.length === 0) return '0.0%';
                            const avgFakeConf = fakeSegs.reduce((sum, seg) => sum + seg.confidence, 0) / fakeSegs.length;
                            return (avgFakeConf * 100).toFixed(1) + '%';
                          })()
                        }
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
                      {audioResult.segment_predictions.map((seg, index) => (
                        <tr key={index}>
                          <td>{`${index * 2}-${(index + 1) * 2}`}</td>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
