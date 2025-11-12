// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./stylesheets/index.css";
// import "./stylesheets/navbar.css";
// import "./stylesheets/preloader.css";
// import "./stylesheets/hero.css";
// import "./stylesheets/details.css";
// import "./stylesheets/footer.css";
// import "./stylesheets/upload.css";
// import "./stylesheets/documentation.css";
// import "./stylesheets/SampleVideo.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );



import "./stylesheets/index.css";
import "./stylesheets/navbar.css";
import "./stylesheets/preloader.css";
import "./stylesheets/hero.css";
import "./stylesheets/details.css";
import "./stylesheets/footer.css";
import "./stylesheets/upload.css";
import "./stylesheets/documentation.css";
import "./stylesheets/SampleVideo.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./stylesheets/index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
