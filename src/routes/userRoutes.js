// src/routes/userRoutes.js


import {
  lazy
} from "react";



const Users = lazy(
  () =>
    import("../pages/Users.jsx")
);



const userRoutes = Object.freeze([


  Object.freeze({

    id: "users",

    path: "/users",

    element: Users,

    module: "users",

    protected: true

  })


]);



export default userRoutes;
