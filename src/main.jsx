import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import { FarmProvider } from "./context/FarmContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";

import "./App.css";


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <SettingsProvider>

      <FarmProvider>

        <App />

      </FarmProvider>

    </SettingsProvider>

  </React.StrictMode>

);
