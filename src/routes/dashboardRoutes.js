// src/routes/dashboardRoutes.js

import { lazy } from "react";

const Dashboard = lazy(
  () => import("../pages/Dashboard.jsx")
);

const dashboardRoutes = Object.freeze([
  Object.freeze({
    id: "dashboard",
    path: "/dashboard",
    element: Dashboard,
    module: "dashboard",
    protected: true
  })
]);

export default dashboardRoutes;
