/* eslint-disable no-unused-vars */
import React from "react";
import { FaEye, FaWaveSquare } from "react-icons/fa";
import { GiLips } from "react-icons/gi";
import "../stylesheets/details.css";

const Details = () => {
  return (
    <div className="deepfake-detection-modalities">
      <p className="deepfake-detection-modalities-details">
        <span>Expose Deepfakes </span>
        with Cutting-Edge AI
      </p>
      <div className="modality-specs-grid">
        <div className="modality-spec">
          <div className="modality-icon modality-icon-eye">
            <FaEye />
          </div>
          <h3 className="modality-title">Face Analysis</h3>
          <p className="modality-desc">
            Our AI-powered detection system analyzes facial inconsistencies and unnatural movements to uncover deepfakes with precision. It detects micro-expressions, unnatural blinking, and motion anomalies that reveal manipulation.
          </p>
        </div>
        <div className="modality-spec">
          <div className="modality-icon modality-icon-lips">
            <GiLips />
          </div>
          <h3 className="modality-title">Lip Sync Detection</h3>
          <p className="modality-desc">
            Our AI detects lip-sync mismatches by analyzing speech and facial movements frame by frame. It identifies delays, unnatural mouth motions, and discrepancies between audio and lip movements that signal manipulation.
          </p>
        </div>
        <div className="modality-spec">
          <div className="modality-icon modality-icon-audio">
            <FaWaveSquare />
          </div>
          <h3 className="modality-title">Voice Analysis</h3>
          <p className="modality-desc">
            Our system analyzes voice anomalies by comparing speech patterns, tone, and cadence to detect inconsistencies. It identifies unnatural pauses, mismatched intonations, and irregularities that suggest AI manipulation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Details;
