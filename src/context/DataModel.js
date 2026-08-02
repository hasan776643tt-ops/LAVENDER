// src/models/DataModel.js

/* =================================
   LAVENDER Smart Farm
   Global Data Model
================================= */


// ================================
// ID Generator
// ================================

export const createId = () =>

  `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;





// ================================
// Timestamp Generator
// ================================

export const createTimestamp = () =>

  new Date().toISOString();





// ================================
// Default Data Model
// ================================

export const DataModel =
Object.freeze({


  system: {

    appName:
      "LAVENDER Smart Farm",

    version:
      "1.0.0",

    createdAt:
      createTimestamp(),

    updatedAt:
      createTimestamp()

  },



  users: [],


  farms: [],


  fields: [],


  crops: [],


  irrigations: [],


  fertilizers: [],


  pesticides: [],


  diseases: [],


  weather: [],


  engineers: [],


  consultations: [],


  expenses: [],


  reports: [],



  settings: {

    language:
      "ar",

    theme:
      "light",

    notifications:
      true

  },



  ai: {

    enabled:
      true,

    recommendations: [],

    lastAnalysis:
      ""

  },



  logs: []


});





// ================================
// Add Item
// ================================

export const addItem = (

  collection = [],

  item = {}

)=>{


return [

 ...collection,


 {

   ...item,

   id:
     createId(),


   createdAt:
     createTimestamp()


 }

];


};





// ================================
// Remove Item
// ================================

export const removeItem = (

 collection = [],

 id

)=>{


return collection.filter(

 item =>

 item.id !== id

);


};





// ================================
// Update Item
// ================================

export const updateItem = (

 collection = [],

 id,

 updates = {}

)=>{


return collection.map(

 item =>


 item.id === id


 ?


 {

   ...item,

   ...updates,


   id:
     item.id,


   updatedAt:
     createTimestamp()


 }


 :


 item


);


};
