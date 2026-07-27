import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">

      <div className="brand">

        <Link to="/">
          🌱 LAVENDER Smart Farm
        </Link>

      </div>


      <nav className="header-nav">

        <Link to="/dashboard">
          لوحة التحكم
        </Link>

        <Link to="/login">
          تسجيل الدخول
        </Link>

        <Link to="/register">
          إنشاء حساب
        </Link>

      </nav>

    </header>
  );
}
