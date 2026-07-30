// src/controllers/index.js

import cropController from "./cropController.js";
import farmController from "./farmController.js";
import fieldController from "./fieldController.js";
import userController from "./userController.js";
import fertilizerController from "./fertilizerController.js";
import weatherController from "./weatherController.js";
import reportController from "./reportController.js";
import engineerController from "./engineerController.js";
import diseaseController from "./diseaseController.js";


// Central Controllers Registry

const controllers = {

  crop: cropController,

  farm: farmController,

  field: fieldController,

  user: userController,

  fertilizer: fertilizerController,

  weather: weatherController,

  report: reportController,

  engineer: engineerController,

  disease: diseaseController

};


export default Object.freeze(controllers);
