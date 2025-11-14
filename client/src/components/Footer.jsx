import React from "react";
import "../stylesheets/footer.css";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TbPhoneCall } from "react-icons/tb";
import { LuMail } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="footer">
      <hr className="footer-line" />

      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Contact Info */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Contact Us</h3>
          <p>
            <TbPhoneCall className="footer-icon" />{" "}
            <a href="tel:+919243322064" className="footer-link">
              +91-9243322064
            </a>
          </p>
          <p>
            <LuMail className="footer-icon" />{" "}
            <a href="mailto:support@elevatetrust.ai" className="footer-link">
              support@elevatetrust.ai
            </a>
          </p>
          <p>
            <IoLocationOutline className="footer-icon" />{" "}
            <a
              href="https://www.google.com/maps?q=Pimple+Saudagar,+Pune,+Maharashtra,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Pimple Saudagar, Pune Maharashtra, India
            </a>
          </p>
        </motion.div>

        {/* Follow Us */}
        <motion.div
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3>Follow Us</h3>
          <div className="social-icons">
            <motion.a
              href="https://x.com/ElevateTrustai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon twitter"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <FaXTwitter />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/elevatetrustai/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
              whileHover={{ scale: 1.2, rotate: -5 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="https://linkedin.com/company/elevatetrustai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <FaLinkedin />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom Bar */}
      <motion.div
        className="footer-row"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span>&copy; 2025 ElevateTrust.Ai. All rights reserved.</span>
        <a
          href="https://elevatetrust.ai/privacy-policy"
          className="privacy-policy-url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;
