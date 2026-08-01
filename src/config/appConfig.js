const appConfig = {
  appName: "LAVENDER",
  fullName: "LAVENDER Smart Farm",
  appDescription: "Smart Farm Management System",

  version: "1.0.0",

  language: "ar",

  api: {
    baseURL: "",
    timeout: 10000
  },

  storage: {
    prefix: "lavender_"
  },

  brand: {
    primary: "green",
    secondary: "lavender"
  },

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
    engineer: true,
    harvest: true,
    inventory: true,
    expenses: true
  }
};

export default appConfig;
