// src/components/Header.jsx

import { Link } from "react-router-dom";

import { translate } from "../utils/translation.js";
import { useSettings } from "../context/SettingsContext.jsx";


const menuItems = Object.freeze([
  {
    id: "dashboard",
    path: "/dashboard",
    titleKey: "menu.dashboard",
  },
  {
    id: "farms",
    path: "/farms",
    titleKey: "menu.farms",
  },
  {
    id: "reports",
    path: "/reports",
    titleKey: "menu.reports",
  },
  {
    id: "login",
    path: "/login",
    titleKey: "home.login",
  },
]);


export default function Header() {

  const { settings } =
    useSettings();

  const language =
    settings?.language || "ar";


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

        {menuItems.map(item => (

          <Link
            key={item.id}
            to={item.path}
          >

            {item.id === "login"
              ? `🔐 ${translate(
                  item.titleKey,
                  language
                )}`
              : translate(
                  item.titleKey,
                  language
                )}

          </Link>

        ))}

      </nav>

    </header>

  );

}
