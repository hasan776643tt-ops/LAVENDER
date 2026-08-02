// src/routes/weatherRoutes.js


import {
  lazy
} from "react";


const weatherRoutes = [

  {
    path: "/weather",

    element: lazy(
      () =>
        import("../pages/Weather.jsx")
    )

  }

];


export default Object.freeze(
  weatherRoutes
);
