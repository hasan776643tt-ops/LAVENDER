// src/routes/weatherRoutes.js


import {
  lazy
} from "react";



const Weather = lazy(
  () =>
    import("../pages/Weather.jsx")
);



const weatherRoutes = Object.freeze([


  Object.freeze({

    id: "weather",

    path: "/weather",

    element: Weather,

    module: "weather",

    protected: true

  })


]);



export default weatherRoutes;
