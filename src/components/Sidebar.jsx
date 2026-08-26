 // src/components/Sidebar.jsx

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import menuConfig from "../config/menuConfig.js";

import {
  translate,
} from "../utils/translation.js";

import {
  useSettings,
} from "../context/SettingsContext.jsx";


// =========================================================
// LAVENDER — RESPONSIVE NAVIGATION
//
// FARMS SCREEN:
// /       → لا Sidebar ولا Bottom Navigation
// /farms  → لا Sidebar ولا Bottom Navigation
//
// باقي الصفحات:
// Desktop → Sidebar
// Mobile  → Bottom Navigation
// =========================================================

export default function Sidebar() {

  const {
    settings,
  } = useSettings();


  const location =
    useLocation();


  const language =
    settings?.language || "ar";


  // =======================================================
  // FARMS FULL-SCREEN PAGE
  //
  // الصفحة الرئيسية للتطبيق هي Farms.
  // سواء دخل المستخدم من "/" أو "/farms"
  // لا نعرض أي Navigation.
  // =======================================================

  const isFarmsPage =
    location.pathname === "/" ||
    location.pathname === "/farms";


  if (isFarmsPage) {

    return null;

  }


  // =======================================================
  // DESKTOP MENU
  // =======================================================

  const menuItems =
    menuConfig.filter(
      (item) =>
        item.enabled
    );


  // =======================================================
  // MOBILE BOTTOM NAVIGATION
  // =======================================================

  const mobileIds = [
    "dashboard",
    "farms",
    "fields",
    "reports",
    "settings",
  ];


  const mobileItems =
    mobileIds
      .map(
        (id) =>
          menuItems.find(
            (item) =>
              item.id === id
          )
      )
      .filter(Boolean);


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <aside
      className="sidebar"
      aria-label="القائمة الرئيسية"
    >

      {/* ===================================================
          DESKTOP NAVIGATION
      =================================================== */}

      <div
        className="sidebar-desktop"
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

        </header>


        {/* =================================================
            DESKTOP MENU
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

          <span
            aria-hidden="true"
          >
            🌱
          </span>

          <span>
            LAVENDER
          </span>

        </footer>

      </div>


      {/* ===================================================
          MOBILE BOTTOM NAVIGATION
      =================================================== */}

      <nav
        className="mobile-bottom-nav"
        aria-label="التنقل السريع"
      >

        <ul>

          {
            mobileItems.map(
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
                          ? "mobile-nav-link active"
                          : "mobile-nav-link"
                    }

                    end={
                      item.path ===
                      "/dashboard"
                    }
                  >

                    <span
                      className="mobile-nav-icon"
                      aria-hidden="true"
                    >
                      {
                        item.icon
                      }
                    </span>


                    <span
                      className="mobile-nav-label"
                    >
                      {
                        translate(
                          item.titleKey,
                          language
                        )
                      }
                    </span>

                  </NavLink>

                </li>

              )
            )
          }

        </ul>

      </nav>

    </aside>

  );

}
