// src/controllers/index.js

import cropController
from "./cropController.js";

import farmController
from "./farmController.js";

import fieldController
from "./fieldController.js";

import userController
from "./userController.js";


import fertilizerController
from "./fertilizerController.js";

import irrigationController
from "./irrigationController.js";

import pesticideController
from "./pesticideController.js";

import diseaseController
from "./diseaseController.js";

import weatherController
from "./weatherController.js";


import reportController
from "./reportController.js";

import engineerController
from "./engineerController.js";


import expenseController
from "./expenseController.js";

import harvestController
from "./harvestController.js";

import inventoryController
from "./inventoryController.js";

import consultationController
from "./consultationController.js";

import authController
from "./authController.js";



const controllers = {


  crop: cropController,

  farm: farmController,

  field: fieldController,

  user: userController,


  fertilizer: fertilizerController,

  irrigation: irrigationController,

  pesticide: pesticideController,

  disease: diseaseController,


  weather: weatherController,

  report: reportController,

  engineer: engineerController,


  expense: expenseController,

  harvest: harvestController,

  inventory: inventoryController,

  consultation: consultationController,

  auth: authController


};



export default Object.freeze(
  controllers
);
