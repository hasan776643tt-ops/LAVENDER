import { Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

import Farms from "./pages/Farms";
import Fields from "./pages/Fields";
import Crops from "./pages/Crops";

import Irrigation from "./pages/Irrigation";
import Fertilizers from "./pages/Fertilizers";
import Pesticides from "./pages/Pesticides";
import Diseases from "./pages/Diseases";

import Weather from "./pages/Weather";
import Map from "./pages/Map";

import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";

import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Settings from "./pages/Settings";

export default function App() {
  return (
    <div>

      <Header />

      <nav>

        <Link to="/">الرئيسية</Link>
        {" | "}

        <Link to="/dashboard">لوحة التحكم</Link>
        {" | "}

        <Link to="/users">المستخدمون</Link>
        {" | "}

        <Link to="/farms">المزارع</Link>
        {" | "}

        <Link to="/fields">الحقول</Link>
        {" | "}

        <Link to="/crops">المحاصيل</Link>
        {" | "}

        <Link to="/irrigation">الري</Link>
        {" | "}

        <Link to="/fertilizers">التسميد</Link>
        {" | "}

        <Link to="/pesticides">المبيدات</Link>
        {" | "}

        <Link to="/diseases">الأمراض</Link>
        {" | "}

        <Link to="/weather">الطقس</Link>
        {" | "}

        <Link to="/map">الخريطة</Link>
        {" | "}

        <Link to="/expenses">المصاريف</Link>
        {" | "}

        <Link to="/reports">التقارير</Link>
        {" | "}

        <Link to="/services">الخدمات</Link>
        {" | "}

        <Link to="/contact">تواصل معنا</Link>
        {" | "}

        <Link to="/settings">الإعدادات</Link>
        {" | "}

        <Link to="/login">دخول</Link>
        {" | "}

        <Link to="/register">تسجيل</Link>

      </nav>

      <hr />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/users" element={<Users />} />

        <Route path="/farms" element={<Farms />} />

        <Route path="/fields" element={<Fields />} />

        <Route path="/crops" element={<Crops />} />

        <Route path="/irrigation" element={<Irrigation />} />

        <Route path="/fertilizers" element={<Fertilizers />} />

        <Route path="/pesticides" element={<Pesticides />} />

        <Route path="/diseases" element={<Diseases />} />

        <Route path="/weather" element={<Weather />} />

        <Route path="/map" element={<Map />} />

        <Route path="/expenses" element={<Expenses />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/services" element={<Services />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>

    </div>
  );
}
