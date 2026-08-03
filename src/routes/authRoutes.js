// src/routes/authRoutes.js


import {
  lazy
} from "react";



const Login = lazy(
  () =>
    import("../pages/Login.jsx")
);



const Register = lazy(
  () =>
    import("../pages/Register.jsx")
);



const authRoutes = Object.freeze([


  Object.freeze({

    id: "login",

    path: "/login",

    element: Login,

    module: "auth",

    protected: false

  }),



  Object.freeze({

    id: "register",

    path: "/register",

    element: Register,

    module: "auth",

    protected: false

  })


]);



export default authRoutes;
