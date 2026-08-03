// src/routes/index.js


import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import farmRoutes from "./farmRoutes.js";
import fieldRoutes from "./fieldRoutes.js";
import cropRoutes from "./cropRoutes.js";
import reportRoutes from "./reportRoutes.js";
import engineerRoutes from "./engineerRoutes.js";
import weatherRoutes from "./weatherRoutes.js";



const routeGroups = Object.freeze([

  authRoutes,

  userRoutes,

  farmRoutes,

  fieldRoutes,

  cropRoutes,

  reportRoutes,

  engineerRoutes,

  weatherRoutes

]);



const routes = Object.freeze(

  routeGroups.flat()

);



export const publicRoutes = Object.freeze(

  routes.filter(

    route => !route.protected

  )

);



export const protectedRoutes = Object.freeze(

  routes.filter(

    route => route.protected

  )

);



export const routeMap = Object.freeze(

  Object.fromEntries(

    routes.map(

      route => [

        route.id,

        route

      ]

    )

  )

);



export default routes;
