// src/routes/contactRoutes.js

import { lazy } from "react";

const Contact = lazy(
  () => import("../pages/Contact.jsx")
);

const contactRoutes = Object.freeze([
  Object.freeze({
    id: "contact",
    path: "/contact",
    element: Contact,
    module: "contact",
    protected: false
  })
]);

export default contactRoutes;
