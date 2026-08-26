// src/routes/homeRoutes.js

import { lazy } from "react";

const Farms = lazy(
  () => import("../pages/Farms.jsx")
);

const homeRoutes = Object.freeze([
  Object.freeze({
    id: "home",
    path: "/",
    element: Farms,
    protected: false
  })
]);

export default homeRoutes;
