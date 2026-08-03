// src/routes/fieldRoutes.js


import {
  lazy
} from "react";



const Fields = lazy(
  () =>
    import("../pages/Fields.jsx")
);



const fieldRoutes = Object.freeze([


  Object.freeze({

    id: "fields",

    path: "/fields",

    element: Fields,

    module: "fields",

    protected: true

  })


]);



export default fieldRoutes;
