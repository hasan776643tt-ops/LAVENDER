// src/routes/fertilizerRoutes.js


import {
  lazy
} from "react";



const Fertilizers = lazy(
  () =>
    import("../pages/Fertilizers.jsx")
);



const fertilizerRoutes = Object.freeze([


  Object.freeze({

    id: "fertilizers",

    path: "/fertilizers",

    element: Fertilizers,

    module: "fertilizers",

    protected: true

  })


]);



export default fertilizerRoutes;
