// src/controllers/index.js

import {
  cropController
} from "./cropController.js";

import {
  farmController
} from "./farmController.js";

import {
  fieldController
} from "./fieldController.js";

import {
  userController
} from "./userController.js";


// Central Controllers Registry

export const controllers = {

  crop: cropController,

  farm: farmController,

  field: fieldController,

  user: userController

};
