// src/routes/mapRoutes.js

import { lazy } from "react";

const Map = lazy(
  () => import("../pages/Map.jsx")
);

const mapRoutes = Object.freeze([
  Object.freeze({
    id: "map",
    path: "/map",
    element: Map,
    module: "map",
    protected: true
  })
]);

export default mapRoutes;
