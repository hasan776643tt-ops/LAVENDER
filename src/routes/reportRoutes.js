// src/routes/reportRoutes.js


import {
  lazy
} from "react";


const reportRoutes = [

  {
    path: "/reports",

    element: lazy(
      () =>
        import("../pages/Reports.jsx")
    )

  }

];


export default Object.freeze(
  reportRoutes
);
