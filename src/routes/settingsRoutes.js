// src/routes/settingsRoutes.js

import { lazy } from "react";

const Settings = lazy(
  () => import("../pages/Settings.jsx")
);

const settingsRoutes = Object.freeze([
  Object.freeze({
    id: "settings",
    path: "/settings",
    element: Settings,
    module: "settings",
    protected: true
  })
]);

export default settingsRoutes;
