// src/routes/farmRoutes.js


import {
  lazy
} from "react";



const Farms = lazy(
  () =>
    import("../pages/Farms.jsx")
);



const farmRoutes = Object.freeze([


  Object.freeze({

    id: "farms",

    path: "/farms",

    element: Farms,

    module: "farms",

    protected: true

  })


]);



export default farmRoutes;
