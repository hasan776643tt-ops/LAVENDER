// src/routes/cropRoutes.js

import { lazy } from "react";


// =========================================================
// CROPS PAGE
// =========================================================
//
// Route definition only.
//
// Business/data operations belong to:
// Hooks → Services → Controllers → Repositories
//
// This file is responsible only for registering
// the Crops page inside the application router.
// =========================================================

const Crops = lazy(
  () => import("../pages/Crops.jsx")
);


// =========================================================
// CROP ROUTES
// =========================================================

const cropRoutes = Object.freeze([

  Object.freeze({

    // Unique route identifier.
    id: "crops",

    // Browser URL.
    path: "/crops",

    // Page component.
    element: Crops,

    // Feature/module identifier.
    module: "crops",

    // Authentication requirement.
    protected: true,

  }),

]);


// =========================================================
// EXPORT
// =========================================================

export default cropRoutes;
