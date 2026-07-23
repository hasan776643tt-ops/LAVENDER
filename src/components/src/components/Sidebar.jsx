import { Link } from "react-router-dom";

export default function Sidebar() {

  const menuItems = [
    { name: "الرئيسية", path: "/" },
    { name: "لوحة التحكم", path: "/dashboard" },
    { name: "المزارع", path: "/farms" },
    { name: "الحقول", path: "/fields" },
    { name: "المحاصيل", path: "/crops" },
    { name: "الري", path: "/irrigation" },
    { name: "الأسمدة", path: "/fertilizers" },
    { name: "المبيدات", path: "/pesticides" },
    { name: "الأمراض", path: "/diseases" },
    { name: "الطقس", path: "/weather" },
    { name: "الخريطة", path: "/map" },
    { name: "المصاريف", path: "/expenses" },
    { name: "التقارير", path: "/reports" },
    { name: "الذكاء الاصطناعي", path: "/ai" },
    { name: "المهندس الزراعي", path: "/engineer" },
    { name: "المستخدمون", path: "/users" },
    { name: "الإعدادات", path: "/settings" },
  ];

  return (
    <aside>

      <h2>
        🌱 Smart Farm
      </h2>

      <ul>

        {menuItems.map((item) => (

          <li key={item.path}>
            <Link to={item.path}>
              {item.name}
            </Link>
          </li>

        ))}

      </ul>

    </aside>
  );
}
