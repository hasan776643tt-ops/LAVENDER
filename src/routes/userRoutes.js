// src/routes/userRoutes.js


import {
  lazy
} from "react";


const userRoutes = [

  {
    path: "/users",

    element: lazy(
      () =>
        import("../pages/Users.jsx")
    )

  }

];


export default Object.freeze(
  userRoutes
);
