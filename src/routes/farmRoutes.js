// src/routes/farmRoutes.js


import {
  lazy
} from "react";


const farmRoutes = [

  {
    path: "/farms",

    element: lazy(
      () =>
        import("../pages/Farms.jsx")
    )

  }

];


export default Object.freeze(
  farmRoutes
);
