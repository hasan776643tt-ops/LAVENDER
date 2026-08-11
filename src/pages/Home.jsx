// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext.jsx";
import { translate } from "../utils/translation.js";

export default function Home() {
  const { settings } = useSettings();

  const language = settings?.language || "ar";

  return (
    <div>
      <h1>
        🌱 {translate("home.title", language)}
      </h1>

      <p>
        {translate("home.description", language)}
      </p>

      <div>
        <Link to="/register">
          <button type="button">
            {translate("home.start", language)}
          </button>
        </Link>

        <Link to="/login">
          <button type="button">
            {translate("home.login", language)}
          </button>
        </Link>

        <Link to="/dashboard">
          <button type="button">
            {translate("menu.dashboard", language)}
          </button>
        </Link>

        <Link to="/services">
          <button type="button">
            {translate("home.services", language)}
          </button>
        </Link>
      </div>
    </div>
  );
}
