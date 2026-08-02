// src/routes/authRoutes.js


import {
  lazy
} from "react";



const authRoutes = [

  {
    path: "/login",

    element: lazy(
      () =>
        import("../pages/Login.jsx")
    )

  },


  {
    path: "/register",

    element: lazy(
      () =>
        import("../pages/Register.jsx")
    )

  }

];


export default Object.freeze(
  authRoutes
);
