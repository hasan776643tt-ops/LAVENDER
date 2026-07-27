import { NavLink } from "react-router-dom";

export default function Sidebar() {

  const menuItems = [

    {
      title: "الرئيسية",
      path: "/",
      icon: "🏠"
    },

    {
      title: "لوحة التحكم",
      path: "/dashboard",
      icon: "📊"
    },

    {
      title: "إدارة المزرعة",
      path: "/farms",
      icon: "🚜"
    },

    {
      title: "الحقول",
      path: "/fields",
      icon: "📍"
    },

    {
      title: "المحاصيل",
      path: "/crops",
      icon: "🌱"
    },

    {
      title: "الري",
      path: "/irrigation",
      icon: "💧"
    },

    {
      title: "الأسمدة",
      path: "/fertilizers",
      icon: "🧪"
    },

    {
      title: "المبيدات",
      path: "/pesticides",
      icon: "🛡️"
    },

    {
      title: "الأمراض",
      path: "/diseases",
      icon: "🦠"
    },

    {
      title: "الطقس",
      path: "/weather",
      icon: "☀️"
    },

    {
      title: "الخريطة",
      path: "/map",
      icon: "🗺️"
    },

    {
      title: "المصاريف",
      path: "/expenses",
      icon: "💰"
    },

    {
      title: "التقارير",
      path: "/reports",
      icon: "📈"
    },

    {
      title: "الذكاء الاصطناعي",
      path: "/ai",
      icon: "🤖"
    },

    {
      title: "المهندس الزراعي",
      path: "/engineer",
      icon: "👨‍🌾"
    },

    {
      title: "المستخدمون",
      path: "/users",
      icon: "👥"
    },

    {
      title: "الإعدادات",
      path: "/settings",
      icon: "⚙️"
    }

  ];


  return (

    <aside className="sidebar">

      <h2>
        🌱 LAVENDER
      </h2>


      <nav>

        <ul>

          {menuItems.map((item) => (

            <li key={item.path}>

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >

                <span>
                  {item.icon}
                </span>

                {item.title}

              </NavLink>

            </li>

          ))}

        </ul>

      </nav>

    </aside>

  );
}
