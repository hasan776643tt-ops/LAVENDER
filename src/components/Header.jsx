import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>

      <h1>
        🌱 Smart Farm Management
      </h1>

      <nav>

        <Link to="/login">
          تسجيل الدخول
        </Link>

        {" | "}

        <Link to="/register">
          إنشاء حساب
        </Link>

      </nav>

    </header>
  );
}
