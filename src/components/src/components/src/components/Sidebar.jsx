import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside>

      <h2>
        🌱 القائمة الرئيسية
      </h2>

      <nav>

        <ul>

          <li>
            <Link to="/">
              🏠 الرئيسية
            </Link>
          </li>

          <li>
            <Link to="/dashboard">
              📊 لوحة التحكم
            </Link>
          </li>

          <li>
            <Link to="/users">
              👤 المستخدمين
            </Link>
          </li>

          <li>
            <Link to="/farms">
              🌾 المزارع
            </Link>
          </li>

          <li>
            <Link to="/fields">
              🌱 الحقول
            </Link>
          </li>

          <li>
            <Link to="/crops">
              🌿 المحاصيل
            </Link>
          </li>

          <li>
            <Link to="/irrigation">
              💧 الري
            </Link>
          </li>

          <li>
            <Link to="/fertilizers">
              🌾 الأسمدة
            </Link>
          </li>

          <li>
            <Link to="/pesticides">
              🧪 المبيدات
            </Link>
          </li>

          <li>
            <Link to="/diseases">
              🦠 الأمراض والآفات
            </Link>
          </li>

          <li>
            <Link to="/expenses">
              💰 المصاريف
            </Link>
          </li>

          <li>
            <Link to="/reports">
              📈 التقارير
            </Link>
          </li>

          <li>
            <Link to="/weather">
              ☁️ الطقس
            </Link>
          </li>

          <li>
            <Link to="/map">
              📍 الخريطة و GPS
            </Link>
          </li>

          <li>
            <Link to="/ai">
              🤖 المساعد الذكي
            </Link>
          </li>

          <li>
            <Link to="/engineer">
              👨‍🌾 استشارة المهندس
            </Link>
          </li>

          <li>
            <Link to="/settings">
              ⚙️ الإعدادات
            </Link>
          </li>

        </ul>

      </nav>

    </aside>
  );
}
