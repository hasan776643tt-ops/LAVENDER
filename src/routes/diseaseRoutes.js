// src/routes/diseaseRoutes.js


import {
  lazy
} from "react";



const Diseases = lazy(
  () =>
    import("../pages/Diseases.jsx")
);



const diseaseRoutes = Object.freeze([


  Object.freeze({

    id: "diseases",

    path: "/diseases",

    element: Diseases,

    module: "diseases",

    protected: true

  })


]);



export default diseaseRoutes;
