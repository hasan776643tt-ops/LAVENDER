// src/utils/constants.js


// ===============================
// Application Constants
// ===============================


export const APP_NAME =
  "LAVENDER Smart Farm";



export const APP_VERSION =
  "1.0.0";



// ===============================
// User Roles
// ===============================


export const ROLES = {


  FARMER:
    "Farmer",


  ENGINEER:
    "Engineer",


  ADMIN:
    "Admin"


};



// ===============================
// Storage Constants
// ===============================


export const STORAGE_PREFIX =
  "lavender_";



// ===============================
// System Status
// ===============================


export const STATUS = {


  ACTIVE:
    "active",


  INACTIVE:
    "inactive",


  PENDING:
    "pending",


  COMPLETED:
    "completed",


  ARCHIVED:
    "archived"


};



// ===============================
// API Constants
// ===============================


export const API_CONFIG = {


  DEFAULT_TIMEOUT:
    10000,


  DEFAULT_PAGE_SIZE:
    20


};



// ===============================
// Date Constants
// ===============================


export const DATE_FORMATS = {


  DEFAULT:
    "YYYY-MM-DD",


  DISPLAY:
    "DD/MM/YYYY"


};



// ===============================
// File Constants
// ===============================


export const FILE_LIMITS = {


  MAX_IMAGE_SIZE_MB:
    5,


  MAX_FILE_SIZE_MB:
    10


};



export default {


  APP_NAME,

  APP_VERSION,

  ROLES,

  STORAGE_PREFIX,

  STATUS,

  API_CONFIG,

  DATE_FORMATS,

  FILE_LIMITS


};
