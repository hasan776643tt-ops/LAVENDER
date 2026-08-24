// src/components/Footer.jsx

import { useSettings } from "../context/SettingsContext.jsx";
import { translate } from "../utils/translation.js";


// =========================================================
// LAVENDER — Mobile Footer
// =========================================================

export default function Footer() {

  const { settings } = useSettings();

  const language =
    settings?.language || "ar";

  const currentYear =
    new Date().getFullYear();


  return (

    <footer
      className="app-footer"
      dir="rtl"
    >

      <div className="footer-inner">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="footer-brand-block">

          <span
            className="footer-symbol"
            aria-hidden="true"
          >
            🌿
          </span>


          <div className="footer-brand-text">

            <span className="footer-brand">
              المزرعة الذكية
            </span>

            <span className="footer-lavender">
              LAVENDER
            </span>

          </div>

        </div>


        {/* =================================================
            COPYRIGHT
        ================================================= */}

        <div className="footer-copy">

          © {currentYear}

          {" "}

          {translate(
            "footer.rights",
            language
          )}

        </div>

      </div>

    </footer>

  );

}
