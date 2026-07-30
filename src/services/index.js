// src/services/index.js

import storageService
  from "./storageService.js";

import cacheService
  from "./cacheService.js";

import authService
  from "./authService.js";

import userService
  from "./userService.js";

import farmService
  from "./farmService.js";

import fieldService
  from "./fieldService.js";

import cropService
  from "./cropService.js";



const services = {

  storage: storageService,

  cache: cacheService,

  auth: authService,

  user: userService,

  farm: farmService,

  field: fieldService,

  crop: cropService

};



export default Object.freeze(
  services
);
