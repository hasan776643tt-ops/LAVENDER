import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>

      <h1>
        🌱 Smart Farm Management
      </h1>


      <nav>

        <Link to="/">
          الرئيسية
        </Link>

        {" | "}

        <Link to="/dashboard">
          لوحة التحكم
        </Link>

        {" | "}

        <Link to="/farms">
          المزارع
        </Link>

        {" | "}

        <Link to="/fields">
          الحقول
        </Link>

        {" | "}

        <Link to="/crops">
          المحاصيل
        </Link>

        {" | "}

        <Link to="/login">
          دخول
        </Link>

      </nav>


    </header>
  );
}
