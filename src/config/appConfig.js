const appConfig = {
  appName: "LAVENDER",
  appDescription: "Smart Farm Management System",

  version: "1.0.0",

  api: {
    baseURL: ""
  },

  language: "ar",

  modules: {
    farms: true,
    fields: true,
    crops: true,
    irrigation: true,
    fertilizers: true,
    pesticides: true,
    diseases: true,
    weather: true,
    map: true,
    reports: true,
    ai: true,
    engineer: true
  }
};

export default appConfig;
