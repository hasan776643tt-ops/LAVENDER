// src/api/endpoints.js


// ===============================
// LAVENDER API Endpoints
// ===============================


// Base Resources

const endpoints = {


  // =============================
  // Farm
  // =============================

  farms:
    "/farms",



  // =============================
  // Field
  // =============================

  fields:
    "/fields",



  // =============================
  // Crops
  // =============================

  crops:
    "/crops",



  // =============================
  // Irrigation
  // =============================

  irrigation:
    "/irrigation",



  // =============================
  // Fertilizer
  // =============================

  fertilizers:
    "/fertilizers",



  // =============================
  // Pesticide
  // =============================

  pesticides:
    "/pesticides",



  // =============================
  // Diseases
  // =============================

  diseases:
    "/diseases",



  // =============================
  // Harvest
  // =============================

  harvests:
    "/harvests",



  // =============================
  // Inventory
  // =============================

  inventory:
    "/inventory",



  // =============================
  // Expenses
  // =============================

  expenses:
    "/expenses",



  // =============================
  // Users
  // =============================

  users:
    "/users",



  // =============================
  // Engineers
  // =============================

  engineers:
    "/engineers",



  // =============================
  // Reports
  // =============================

  reports:
    "/reports",



  // =============================
  // Weather External API
  // =============================

  weather:
    "/weather",



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
