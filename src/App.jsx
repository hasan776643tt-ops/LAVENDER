import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

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

import AI from "./pages/AI";
import Engineer from "./pages/Engineer";

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
    <MainLayout>

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

        <Route path="/ai" element={<AI />} />

        <Route path="/engineer" element={<Engineer />} />

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

    </MainLayout>
  );
}
