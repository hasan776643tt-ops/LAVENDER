// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";

import menuConfig from "../config/menuConfig.js";
import { translate } from "../utils/translation.js";
import { useSettings } from "../context/SettingsContext.jsx";


const englishNames = {

  dashboard: "Dashboard",
  farms: "Farms",
  fields: "Fields",
  crops: "Crops",
  irrigation: "Irrigation",
  fertilizers: "Fertilizers",
  pesticides: "Pesticides",
  diseases: "Diseases",
  weather: "Weather",
  map: "Map",
  ai: "AI Advisor",
  engineer: "Agricultural Engineer",
  reports: "Reports",
  harvest: "Harvest",
  inventory: "Inventory",
  expenses: "Expenses",
  users: "Users",
  settings: "Settings",

};


export default function Sidebar() {

  const { settings } = useSettings();

  const language =
    settings?.language || "ar";


  return (

    <aside
      className="sidebar"
      aria-label="القائمة الرئيسية"
    >

      <div className="sidebar-brand">

        <div className="sidebar-brand-logo">
          🌱
        </div>

        <h2>
          LAVENDER
        </h2>

        <p>
          المزرعة الذكية
        </p>

        <span className="sidebar-brand-en">
          Smart Farm
        </span>

      </div>


      <nav
        className="sidebar-nav"
        aria-label="التنقل الرئيسي"
      >

        <ul>

          {menuConfig
            .filter((item) => item.enabled)
            .map((item) => (

              <li key={item.id}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "sidebar-link active"
                      : "sidebar-link"
                  }
                  end={
                    item.path === "/dashboard"
                  }
                >

                  <span
                    className="sidebar-icon"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>


                  <span className="sidebar-link-text">

                    <span className="sidebar-title-ar">

                      {translate(
                        item.titleKey,
                        language
                      )}

                    </span>


                    <span className="sidebar-title-en">

                      {englishNames[item.id] || item.id}

                    </span>

                  </span>

                </NavLink>

              </li>

            ))}

        </ul>

      </nav>

    </aside>

  );

}
