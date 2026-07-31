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


import irrigationService
  from "./irrigationService.js";

import fertilizerService
  from "./fertilizerService.js";

import pesticideService
  from "./pesticideService.js";

import diseaseService
  from "./diseaseService.js";

import weatherService
  from "./weatherService.js";





const services = {


  storage:
    storageService,


  cache:
    cacheService,


  auth:
    authService,



  user:
    userService,


  farm:
    farmService,


  field:
    fieldService,


  crop:
    cropService,



  irrigation:
    irrigationService,


  fertilizer:
    fertilizerService,


  pesticide:
    pesticideService,


  disease:
    diseaseService,


  weather:
    weatherService



};





export default Object.freeze(
  services
);
