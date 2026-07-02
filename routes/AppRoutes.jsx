import { Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Dashboard</h1>} />
      <Route path="/farmers" element={<h1>Farmers</h1>} />
      <Route path="/farms" element={<h1>Farms</h1>} />
      <Route path="/crops" element={<h1>Crops</h1>} />
      <Route path="/irrigation" element={<h1>Irrigation</h1>} />
    </Routes>
  );
}
