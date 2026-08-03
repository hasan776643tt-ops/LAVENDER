// src/routes/engineerRoutes.js


import {
  lazy
} from "react";



const Engineer = lazy(
  () =>
    import("../pages/Engineer.jsx")
);



const engineerRoutes = Object.freeze([


  Object.freeze({

    id: "engineer",

    path: "/engineer",

    element: Engineer,

    module: "engineer",

    protected: true

  })


]);



export default engineerRoutes;
