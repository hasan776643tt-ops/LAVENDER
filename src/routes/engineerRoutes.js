// src/routes/engineerRoutes.js


import {
  lazy
} from "react";


const engineerRoutes = [

  {
    path: "/engineer",

    element: lazy(
      () =>
        import("../pages/Engineer.jsx")
    )

  }

];


export default Object.freeze(
  engineerRoutes
);
