// src/components/Header.jsx

import {
  Link
} from "react-router-dom";


export default function Header(){


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


        <Link to="/dashboard">

          📊 لوحة التحكم

        </Link>



        <Link to="/farms">

          🌾 المزارع

        </Link>



        <Link to="/reports">

          📈 التقارير

        </Link>



        <Link to="/login">

          🔐 الدخول

        </Link>



      </nav>


    </header>

  );

}
