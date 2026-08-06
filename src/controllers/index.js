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

import authController
from "./authController.js";



const controllers = Object.freeze({

  auth: authController,

  user: userController,


  farm: farmController,

  field: fieldController,

  crop: cropController,


  irrigation: irrigationController,

  fertilizer: fertilizerController,

  pesticide: pesticideController,

  disease: diseaseController,


  expense: expenseController,

  harvest: harvestController,

  inventory: inventoryController,


  weather: weatherController,

  engineer: engineerController,

  report: reportController

});



export default controllers;
