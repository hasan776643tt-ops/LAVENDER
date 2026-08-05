// src/api/harvestApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Harvest API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.harvests

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Harvest id is required."

    );


  }



  return apiClient.get(

    `${endpoints.harvests}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Harvest data is required."

    );


  }



  return apiClient.post(

    endpoints.harvests,

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

      "Harvest id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Harvest data is required."

    );


  }



  return apiClient.put(

    `${endpoints.harvests}/${id}`,

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

      "Harvest id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.harvests}/${id}`

  );


};






const harvestApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default harvestApi;
