// src/routes/index.js

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import farmRoutes from "./farmRoutes.js";
import fieldRoutes from "./fieldRoutes.js";
import cropRoutes from "./cropRoutes.js";
import reportRoutes from "./reportRoutes.js";
import engineerRoutes from "./engineerRoutes.js";
import weatherRoutes from "./weatherRoutes.js";



const routes = {


  auth: authRoutes,


  user: userRoutes,


  farm: farmRoutes,


  field: fieldRoutes,


  crop: cropRoutes,


  report: reportRoutes,


  engineer: engineerRoutes,


  weather: weatherRoutes


};



export default Object.freeze(
  routes
);
