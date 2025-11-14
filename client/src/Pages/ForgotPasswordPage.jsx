import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ForgotPassword from "../components/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="fp-page-container">
      <Navbar />

      <main className="fp-main-page">
        <ForgotPassword />
      </main>

      <Footer />
    </div>
  );
}
