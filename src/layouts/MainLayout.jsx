// src/layouts/MainLayout.jsx

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";


// =========================================================
// LAVENDER — Main Layout
// =========================================================
// Farms + Farm Services = Full Screen
//
// الصفحة الرئيسية:
// /
// /farms
//
// خدمات المزرعة:
// /crops
// /irrigation
// /fertilizers
// /diseases
// /engineer
// /map
// /harvest
// /expenses
// /weather
// /inventory
// /pesticides
// /reports
//
// هذه الصفحات تظهر محتواها الخاص فقط.
// لا يتم عرض Header / Sidebar / Footer معها.
// =========================================================


const FARM_SERVICE_PATHS = Object.freeze([

  "/crops",
  "/irrigation",
  "/fertilizers",
  "/diseases",
  "/engineer",
  "/map",
  "/harvest",
  "/expenses",
  "/weather",
  "/inventory",
  "/pesticides",
  "/reports",

]);


// =========================================================
// COMPONENT
// =========================================================

export default function MainLayout({
  children
}) {

  const location = useLocation();


  // =======================================================
  // PATH
  // =======================================================

  const pathname =
    location.pathname;


  // =======================================================
  // FARMS SCREEN
  // =======================================================

  const isFarmsScreen =
    pathname === "/" ||
    pathname === "/farms";


  // =======================================================
  // FARM SERVICE SCREEN
  // =======================================================

  const isFarmServiceScreen =
    FARM_SERVICE_PATHS.includes(
      pathname
    );


  // =======================================================
  // FULL SCREEN MODE
  // =======================================================
  //
  // Farms والخدمات الخاصة بالمزرعة
  // لا تعرض Header / Sidebar / Footer.
  //
  // هذا يمنع ظهور القوائم العامة داخل:
  // الطقس
  // الأمراض
  // الأسمدة
  // المصروفات
  // الخريطة
  // الحصاد
  // وغيرها.
  // =======================================================

  if (
    isFarmsScreen ||
    isFarmServiceScreen
  ) {

    return (

      <div
        className={
          isFarmsScreen
            ? "app-layout farms-fullscreen"
            : "app-layout farm-service-fullscreen"
        }
      >

        <main
          className={
            isFarmsScreen
              ? "app-content farms-fullscreen-content"
              : "app-content farm-service-fullscreen-content"
          }
          role="main"
        >

          {children}

        </main>

      </div>

    );

  }


  // =======================================================
  // NORMAL APPLICATION MODE
  // =======================================================
  //
  // الصفحات العامة تبقى كما هي.
  //
  // مثال:
  // Dashboard
  // Users
  // Settings
  // Login
  // وغيرها.
  // =======================================================

  return (

    <div className="app-layout">

      {/* HEADER */}

      <Header />


      {/* APP BODY */}

      <div className="app-body">

        {/* SIDEBAR */}

        <Sidebar />


        {/* MAIN CONTENT */}

        <main
          className="app-content"
          role="main"
        >

          {children}

        </main>

      </div>


      {/* FOOTER */}

      <Footer />

    </div>

  );

}
