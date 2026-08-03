// src/config/index.js


import appConfig from "./appConfig.js";



const config = Object.freeze({

  app: appConfig,


  name:
    appConfig.appName,


  version:
    appConfig.version,


  environment:
    import.meta.env.MODE || "development",


  isDevelopment:
    import.meta.env.DEV,


  isProduction:
    import.meta.env.PROD,


  api:
    appConfig.api,


  storage:
    appConfig.storage,


  brand:
    appConfig.brand,


  modules:
    appConfig.modules

});



export {

  appConfig

};



export default config;
