import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Manrope, sans-serif",
            borderRadius: "0.5rem",
            background: "#302B3E",
            color: "#F4F0FB",
            fontSize: "0.875rem",
            fontWeight: 600,
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
