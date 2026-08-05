// src/api/cropApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Crop API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.crops

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Crop id is required."

    );


  }



  return apiClient.get(

    `${endpoints.crops}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Crop data is required."

    );


  }



  return apiClient.post(

    endpoints.crops,

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

      "Crop id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Crop data is required."

    );


  }



  return apiClient.put(

    `${endpoints.crops}/${id}`,

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

      "Crop id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.crops}/${id}`

  );


};






const cropApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default cropApi;
