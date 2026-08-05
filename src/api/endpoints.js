// src/api/endpoints.js


// ===============================
// LAVENDER API Endpoints
// ===============================


const endpoints = {


  // =============================
  // Core Resources
  // =============================


  farms:
    "/farms",


  fields:
    "/fields",


  crops:
    "/crops",


  irrigations:
    "/irrigations",


  fertilizers:
    "/fertilizers",


  pesticides:
    "/pesticides",


  diseases:
    "/diseases",


  harvests:
    "/harvests",


  inventory:
    "/inventory",


  expenses:
    "/expenses",




  // =============================
  // Users & Professionals
  // =============================


  users:
    "/users",


  engineers:
    "/engineers",




  // =============================
  // Reports
  // =============================


  reports:
    "/reports",




  // =============================
  // Weather
  // =============================


  weather: {


    current:
      "/weather/current"


  },




  // =============================
  // Authentication
  // =============================


  auth: {


    login:
      "/auth/login",


    register:
      "/auth/register",


    logout:
      "/auth/logout",


    profile:
      "/auth/profile"


  }



};




// Prevent accidental mutation

export default Object.freeze(

  endpoints

);
