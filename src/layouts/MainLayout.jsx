// src/layouts/MainLayout.jsx

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";


// =========================================================
// LAVENDER — Main Layout
// =========================================================
// Farms is the application's full-screen entry page.
// Header / Sidebar / Footer are hidden there.
// =========================================================

export default function MainLayout({
  children
}) {

  const location = useLocation();

  // Farms is the first screen of the application.
  // It can be reached through "/" or "/farms".
  const isFarmsScreen =
    location.pathname === "/" ||
    location.pathname === "/farms";


  // =======================================================
  // FULL SCREEN FARMS MODE
  // =======================================================

  if (isFarmsScreen) {

    return (

      <div className="app-layout farms-fullscreen">

        <main
          className="app-content farms-fullscreen-content"
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
