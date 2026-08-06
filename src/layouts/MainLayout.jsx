// src/layouts/MainLayout.jsx

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";


export default function MainLayout({
  children
}) {


  return (

    <div className="app-layout">


      <Header />



      <div className="app-body">


        <Sidebar />



        <main

          className="app-content"

          role="main"

        >

          {children}

        </main>



      </div>



      <Footer />


    </div>

  );

}
