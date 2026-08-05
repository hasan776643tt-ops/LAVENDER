// src/utils/storage.js


import logger
from "./logger.js";



// ===============================
// LAVENDER Storage Manager
// ===============================


const PREFIX =
  "lavender_";





function isStorageAvailable() {


  return (

    typeof window !== "undefined"

    &&

    typeof window.localStorage !== "undefined"

  );


}





function createKey(
  key
) {


  return (

    PREFIX +

    key

  );


}





export function saveData(
  key,
  data
) {


  try {


    if(
      !isStorageAvailable()
    ) {


      return false;


    }



    window.localStorage.setItem(

      createKey(key),

      JSON.stringify(data)

    );



    return true;



  } catch(error) {


    logger.error(

      "Storage save error",

      {

        key,

        error

      }

    );



    return false;


  }


}






export function getData(
  key,
  defaultValue = null
) {


  try {


    if(
      !isStorageAvailable()
    ) {


      return defaultValue;


    }



    const storedData =

      window.localStorage.getItem(

        createKey(key)

      );



    if(
      storedData === null
    ) {


      return defaultValue;


    }



    return JSON.parse(
      storedData
    );



  } catch(error) {


    logger.error(

      "Storage read error",

      {

        key,

        error

      }

    );



    return defaultValue;


  }


}






export function removeData(
  key
) {


  if(
    !isStorageAvailable()
  ) {


    return false;


  }



  window.localStorage.removeItem(

    createKey(key)

  );



  return true;


}






export function clearStorage() {


  if(
    !isStorageAvailable()
  ) {


    return false;


  }



  Object.keys(

    window.localStorage

  )

  .filter(

    key =>

      key.startsWith(
        PREFIX
      )

  )

  .forEach(

    key =>

      window.localStorage.removeItem(
        key
      )

  );



  return true;


}






export function updateData(
  key,
  callback
) {


  const currentData =

    getData(

      key,

      []

    );



  const updatedData =

    callback(
      currentData
    );



  saveData(

    key,

    updatedData

  );



  return updatedData;


}






export function hasData(
  key
) {


  if(
    !isStorageAvailable()
  ) {


    return false;


  }



  return (

    window.localStorage.getItem(

      createKey(key)

    ) !== null

  );


}






export default {


  saveData,

  getData,

  removeData,

  clearStorage,

  updateData,

  hasData


};
