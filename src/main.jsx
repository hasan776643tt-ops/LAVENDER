// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { FarmProvider } from "./context/FarmContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";


// =========================================================
// Global Styles
// =========================================================

import "./App.css";

import "./styles/farms.css";
import "./styles/sidebar.css";


// =========================================================
// Render
// =========================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <SettingsProvider>

        <FarmProvider>

          <App />

        </FarmProvider>

      </SettingsProvider>

    </BrowserRouter>

  </React.StrictMode>

);
