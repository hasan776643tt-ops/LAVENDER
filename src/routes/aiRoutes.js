// src/routes/aiRoutes.js

import { lazy } from "react";

const AI = lazy(
  () => import("../pages/AI.jsx")
);

const aiRoutes = Object.freeze([
  Object.freeze({
    id: "ai",
    path: "/ai",
    element: AI,
    module: "ai",
    protected: true
  })
]);

export default aiRoutes;
