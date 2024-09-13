import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// const { VITE_GOOGLE_CLIENT_ID } = import.meta.env;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="750369764342-i5ei32p0rhtb50glvmce06nglg845s8q.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
);
