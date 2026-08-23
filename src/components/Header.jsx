// src/components/Header.jsx

import { Link } from "react-router-dom";


export default function Header() {

  return (

    <header
      className="app-header"
      aria-label="هوية التطبيق"
    >

      <div className="brand">

        <Link
          to="/"
          aria-label="المزرعة الذكية - LAVENDER"
        >

          <span
            className="brand-icon"
            aria-hidden="true"
          >
            🌱
          </span>


          <span className="brand-title">

            <span className="brand-arabic">
              المزرعة الذكية
            </span>

            <span className="brand-english">
              LAVENDER
            </span>

          </span>

        </Link>

      </div>

    </header>

  );

}
