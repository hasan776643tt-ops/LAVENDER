// src/components/Footer.jsx

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="app-footer">

      <div className="footer-name">
        المزرعة الذكية
      </div>

      <div className="footer-lavender">
        LAVENDER
      </div>

      <div className="footer-copy">
        © {currentYear} جميع الحقوق محفوظة
      </div>

    </footer>
  );
}
