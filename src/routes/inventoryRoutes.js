// src/routes/inventoryRoutes.js


import {
  lazy
} from "react";



const Inventory = lazy(
  () =>
    import("../pages/Inventory.jsx")
);



const inventoryRoutes = Object.freeze([


  Object.freeze({

    id: "inventory",

    path: "/inventory",

    element: Inventory,

    module: "inventory",

    protected: true

  })


]);



export default inventoryRoutes;
