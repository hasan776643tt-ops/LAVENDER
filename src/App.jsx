import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Farms from "./pages/Farms";
import Fields from "./pages/Fields";
import Crops from "./pages/Crops";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Weather from "./pages/Weather";
import Map from "./pages/Map";
import Expenses from "./pages/Expenses";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">الرئيسية</Link>
        {" | "}
        <Link to="/services">الخدمات</Link>
        {" | "}
        <Link to="/contact">تواصل معنا</Link>
        {" | "}
        <Link to="/farms">المزارع</Link>
        {" | "}
        <Link to="/fields">الحقول</Link>
        {" | "}
        <Link to="/crops">المحاصيل</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/map" element={<Map />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </div>
  );
}
