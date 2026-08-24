// src/components/Header.jsx

import { Link } from "react-router-dom";


// =========================================================
// LAVENDER — Mobile Header
// =========================================================

export default function Header() {

  return (

    <header
      className="app-header"
      dir="rtl"
    >

      <div className="header-inner">

        {/* =================================================
            BRAND
        ================================================= */}

        <Link
          to="/"
          className="brand-link"
          aria-label="المزرعة الذكية LAVENDER"
        >

          <span
            className="brand-symbol"
            aria-hidden="true"
          >
            🌿
          </span>


          <span className="brand">

            <span className="brand-arabic">
              المزرعة الذكية
            </span>

            <span className="brand-english">
              LAVENDER
            </span>

          </span>

        </Link>


        {/* =================================================
            HEADER STATUS
        ================================================= */}

        <div
          className="header-status"
          aria-hidden="true"
        >

          <span className="header-status-dot" />

          <span>
            ذكي
          </span>

        </div>

      </div>

    </header>

  );

}
