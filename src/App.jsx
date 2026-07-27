import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

// Farm Management
import Farms from "./pages/Farms";
import Fields from "./pages/Fields";
import Crops from "./pages/Crops";

// Agriculture Systems
import Irrigation from "./pages/Irrigation";
import Fertilizers from "./pages/Fertilizers";
import Pesticides from "./pages/Pesticides";
import Diseases from "./pages/Diseases";

// Smart Features
import AI from "./pages/AI";
import Engineer from "./pages/Engineer";
import Weather from "./pages/Weather";
import Map from "./pages/Map";

// Reports & Finance
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";

// Temporary 404 Page
function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404</h1>
      <p>الصفحة غير موجودة</p>
    </div>
  );
}

export default function App() {
  return (
    <MainLayout>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />

        {/* Farms */}
        <Route path="/farms" element={<Farms />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/crops" element={<Crops />} />

        {/* Agriculture */}
        <Route path="/irrigation" element={<Irrigation />} />
        <Route path="/fertilizers" element={<Fertilizers />} />
        <Route path="/pesticides" element={<Pesticides />} />
        <Route path="/diseases" element={<Diseases />} />

        {/* Smart Systems */}
        <Route path="/ai" element={<AI />} />
        <Route path="/engineer" element={<Engineer />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/map" element={<Map />} />

        {/* Reports */}
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </MainLayout>
  );
}
