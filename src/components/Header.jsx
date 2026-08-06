// src/components/Header.jsx

import { Link } from "react-router-dom";


const menuItems = Object.freeze([
  {
    id: "dashboard",
    path: "/dashboard",
    label: "📊 لوحة التحكم",
  },
  {
    id: "farms",
    path: "/farms",
    label: "🌾 المزارع",
  },
  {
    id: "reports",
    path: "/reports",
    label: "📈 التقارير",
  },
  {
    id: "login",
    path: "/login",
    label: "🔐 الدخول",
  },
]);


export default function Header() {

  return (

    <header className="app-header">


      <div className="brand">

        <Link to="/">

          <span className="brand-icon">
            🌱
          </span>


          <span>
            LAVENDER Smart Farm
          </span>


        </Link>

      </div>




      <nav className="header-nav">

        {
          menuItems.map(item => (

            <Link

              key={item.id}

              to={item.path}

            >

              {item.label}

            </Link>

          ))
        }

      </nav>


    </header>

  );

}
