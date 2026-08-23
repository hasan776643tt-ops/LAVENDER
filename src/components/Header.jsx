import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <Link to="/" className="brand-link">
          <span className="brand-arabic">
            المزرعة الذكية
          </span>

          <span className="brand-english">
            LAVENDER
          </span>
        </Link>
      </div>
    </header>
  );
}
