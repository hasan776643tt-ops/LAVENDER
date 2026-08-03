// src/routes/harvestRoutes.js


import {
  lazy
} from "react";



const Harvest = lazy(
  () =>
    import("../pages/Harvest.jsx")
);



const harvestRoutes = Object.freeze([


  Object.freeze({

    id: "harvest",

    path: "/harvest",

    element: Harvest,

    module: "harvest",

    protected: true

  })


]);



export default harvestRoutes;
