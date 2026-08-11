// src/routes/homeRoutes.js

import { lazy } from "react";

const Home = lazy(
  () => import("../pages/Home.jsx")
);

const homeRoutes = Object.freeze([
  Object.freeze({
    id: "home",
    path: "/",
    element: Home,
    protected: false
  })
]);

export default homeRoutes;
