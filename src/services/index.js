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


import expenseService
from "./expenseService.js";


import harvestService
from "./harvestService.js";


import inventoryService
from "./inventoryService.js";


import aiService
from "./aiService.js";


import analyticsService
from "./analyticsService.js";


import backupService
from "./backupService.js";


import exportService
from "./exportService.js";


import notificationService
from "./notificationService.js";


import syncService
from "./syncService.js";


import logService
from "./logService.js";




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
    weatherService,


  expense:
    expenseService,


  harvest:
    harvestService,


  inventory:
    inventoryService,


  ai:
    aiService,


  analytics:
    analyticsService,


  backup:
    backupService,


  export:
    exportService,


  notification:
    notificationService,


  sync:
    syncService,


  log:
    logService


};



export default Object.freeze(
  services
);
