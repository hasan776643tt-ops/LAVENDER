import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>

      <h1>🌱 إدارة المزارع الذكية</h1>

      <p>
        نظام ذكي لإدارة المزارع والمحاصيل والري والأسمدة.
      </p>

      <div>

        <Link to="/register">
          <button>
            ابدأ الآن
          </button>
        </Link>

        <Link to="/login">
          <button>
            تسجيل دخول
          </button>
        </Link>

        <Link to="/dashboard">
          <button>
            لوحة التحكم
          </button>
        </Link>

        <Link to="/services">
          <button>
            الخدمات
          </button>
        </Link>

      </div>

    </div>
  );
}
