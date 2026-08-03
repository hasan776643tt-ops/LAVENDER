// src/routes/reportRoutes.js


import {
  lazy
} from "react";



const Reports = lazy(
  () =>
    import("../pages/Reports.jsx")
);



const reportRoutes = Object.freeze([


  Object.freeze({

    id: "reports",

    path: "/reports",

    element: Reports,

    module: "reports",

    protected: true

  })


]);



export default reportRoutes;
