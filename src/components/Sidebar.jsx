// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";

import menuConfig from "../config/menuConfig.js";
import { translate } from "../utils/translation.js";
import { useSettings } from "../context/SettingsContext.jsx";


export default function Sidebar() {

  const { settings } = useSettings();

  const language =
    settings?.language || "ar";


  return (

    <aside
      className="sidebar"
      aria-label="القائمة الرئيسية"
    >

      <nav
        className="sidebar-menu"
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

                  {item.icon && (

                    <span
                      className="sidebar-icon"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>

                  )}

                  <span className="sidebar-label">

                    <span className="sidebar-arabic">
                      {translate(
                        item.titleKey,
                        language
                      )}
                    </span>

                    <span className="sidebar-english">
                      {item.id}
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
