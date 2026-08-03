// src/routes/pesticideRoutes.js


import {
  lazy
} from "react";



const Pesticides = lazy(
  () =>
    import("../pages/Pesticides.jsx")
);



const pesticideRoutes = Object.freeze([


  Object.freeze({

    id: "pesticides",

    path: "/pesticides",

    element: Pesticides,

    module: "pesticides",

    protected: true

  })


]);



export default pesticideRoutes;
