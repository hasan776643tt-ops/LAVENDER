// src/routes/fieldRoutes.js


import {
  lazy
} from "react";


const fieldRoutes = [

  {
    path: "/fields",

    element: lazy(
      () =>
        import("../pages/Fields.jsx")
    )

  }

];


export default Object.freeze(
  fieldRoutes
);
