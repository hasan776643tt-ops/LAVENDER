// src/routes/cropRoutes.js


import {
  lazy
} from "react";



const Crops = lazy(
  () =>
    import("../pages/Crops.jsx")
);



const cropRoutes = Object.freeze([


  Object.freeze({

    id: "crops",

    path: "/crops",

    element: Crops,

    module: "crops",

    protected: true

  })


]);



export default cropRoutes;
