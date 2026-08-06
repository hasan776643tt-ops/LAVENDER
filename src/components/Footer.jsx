// src/components/Footer.jsx

const currentYear = new Date().getFullYear();


export default function Footer() {


  return (

    <footer className="app-footer">


      <div className="footer-brand">

        🌱 LAVENDER Smart Farm

      </div>



      <div className="footer-description">

        نظام إدارة المزارع الذكية

        <br />

        إدارة المحاصيل والري والتقارير الزراعية

      </div>



      <div className="footer-copy">

        © {currentYear} جميع الحقوق محفوظة

      </div>



    </footer>

  );

}
