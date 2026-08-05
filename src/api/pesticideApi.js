// src/api/pesticideApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Pesticide API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.pesticides

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Pesticide id is required."

    );


  }



  return apiClient.get(

    `${endpoints.pesticides}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Pesticide data is required."

    );


  }



  return apiClient.post(

    endpoints.pesticides,

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

      "Pesticide id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Pesticide data is required."

    );


  }



  return apiClient.put(

    `${endpoints.pesticides}/${id}`,

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

      "Pesticide id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.pesticides}/${id}`

  );


};






const pesticideApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default pesticideApi;
