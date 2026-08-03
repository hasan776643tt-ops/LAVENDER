// src/routes/expenseRoutes.js


import {
  lazy
} from "react";



const Expenses = lazy(
  () =>
    import("../pages/Expenses.jsx")
);



const expenseRoutes = Object.freeze([


  Object.freeze({

    id: "expenses",

    path: "/expenses",

    element: Expenses,

    module: "expenses",

    protected: true

  })


]);



export default expenseRoutes;
