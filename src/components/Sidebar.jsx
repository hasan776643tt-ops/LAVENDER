// src/components/Sidebar.jsx

import {
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import menuConfig from "../config/menuConfig.js";

import {
  translate,
} from "../utils/translation.js";

import {
  useSettings,
} from "../context/SettingsContext.jsx";


// =========================================================
// LAVENDER — MOBILE SIDEBAR
// =========================================================

export default function Sidebar() {

  const {
    settings,
  } = useSettings();


  const language =
    settings?.language || "ar";


  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  const menuItems =
    menuConfig.filter(
      (item) =>
        item.enabled
    );


  const closeMenu = () => {

    setIsOpen(
      false
    );

  };


  return (

    <>

      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() =>
          setIsOpen(true)
        }
        aria-label="فتح القائمة"
        aria-expanded={isOpen}
      >

        <span>
          ☰
        </span>

      </button>


      {/* =================================================
          OVERLAY
      ================================================= */}

      {
        isOpen && (

          <button
            type="button"
            className="sidebar-overlay"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
          />

        )
      }


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={
          isOpen
            ? "sidebar sidebar-open"
            : "sidebar"
        }
        aria-label="القائمة الرئيسية"
      >

        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <header
          className="sidebar-header"
        >

          <div
            className="sidebar-logo"
            aria-hidden="true"
          >
            🌿
          </div>


          <div
            className="sidebar-brand"
          >

            <strong>
              LAVENDER
            </strong>

            <span>
              المزرعة الذكية
            </span>

          </div>


          <button
            type="button"
            className="sidebar-close"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
          >
            ×
          </button>

        </header>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="sidebar-menu"
          aria-label="التنقل الرئيسي"
        >

          <ul>

            {
              menuItems.map(
                (
                  item
                ) => (

                  <li
                    key={
                      item.id
                    }
                  >

                    <NavLink
                      to={
                        item.path
                      }
                      className={
                        ({
                          isActive,
                        }) =>
                          isActive
                            ? "sidebar-link active"
                            : "sidebar-link"
                      }
                      end={
                        item.path ===
                        "/dashboard"
                      }
                      onClick={
                        closeMenu
                      }
                    >

                      {
                        item.icon && (

                          <span
                            className="sidebar-icon"
                            aria-hidden="true"
                          >
                            {
                              item.icon
                            }
                          </span>

                        )
                      }


                      <span
                        className="sidebar-label"
                      >

                        <span
                          className="sidebar-arabic"
                        >
                          {
                            translate(
                              item.titleKey,
                              language
                            )
                          }
                        </span>


                        <span
                          className="sidebar-english"
                        >
                          {
                            item.id
                          }
                        </span>

                      </span>


                      <span
                        className="sidebar-arrow"
                        aria-hidden="true"
                      >
                        ←
                      </span>

                    </NavLink>

                  </li>

                )
              )
            }

          </ul>

        </nav>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <footer
          className="sidebar-footer"
        >

          <span>
            🌱
          </span>

          <span>
            LAVENDER
          </span>

        </footer>

      </aside>

    </>

  );

}
