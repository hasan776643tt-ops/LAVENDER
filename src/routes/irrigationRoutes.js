// src/routes/irrigationRoutes.js


import {
  lazy
} from "react";



const Irrigation = lazy(
  () =>
    import("../pages/Irrigation.jsx")
);



const irrigationRoutes = Object.freeze([


  Object.freeze({

    id: "irrigation",

    path: "/irrigation",

    element: Irrigation,

    module: "irrigation",

    protected: true

  })


]);



export default irrigationRoutes;
