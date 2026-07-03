
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">الرئيسية</Link>
        {" | "}
        <Link to="/services">الخدمات</Link>
        {" | "}
        <Link to="/contact">تواصل معنا</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
