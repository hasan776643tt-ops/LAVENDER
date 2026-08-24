// src/layouts/MainLayout.jsx

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";


// =========================================================
// LAVENDER — Main Layout
// Mobile App Layout
// =========================================================

export default function MainLayout({
  children
}) {

  return (

    <div className="app-layout">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />


      {/* =================================================
          APP BODY
      ================================================= */}

      <div className="app-body">

        {/* =================================================
            SIDEBAR
            Desktop:
            شريط جانبي

            Mobile:
            يتحول إلى Bottom Navigation بواسطة sidebar.css
        ================================================= */}

        <Sidebar />


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          className="app-content"
          role="main"
        >

          {children}

        </main>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>

  );

}
