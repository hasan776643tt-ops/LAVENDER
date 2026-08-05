// src/api/inventoryApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Inventory API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.inventory

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Inventory item id is required."

    );


  }



  return apiClient.get(

    `${endpoints.inventory}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Inventory data is required."

    );


  }



  return apiClient.post(

    endpoints.inventory,

    data

  );


};






const update = async (

  id,

  data

) => {


  if(
    !id
  ) {


    throw new Error(

      "Inventory item id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Inventory data is required."

    );


  }



  return apiClient.put(

    `${endpoints.inventory}/${id}`,

    data

  );


};






const remove = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Inventory item id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.inventory}/${id}`

  );


};






const inventoryApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default inventoryApi;
