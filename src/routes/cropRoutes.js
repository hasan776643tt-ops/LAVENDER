// src/routes/cropRoutes.js


import {
  lazy
} from "react";


const cropRoutes = [

  {
    path: "/crops",

    element: lazy(
      () =>
        import("../pages/Crops.jsx")
    )

  }

];


export default Object.freeze(
  cropRoutes
);
