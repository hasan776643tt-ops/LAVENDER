// src/api/fertilizerApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Fertilizer API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.fertilizers

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Fertilizer id is required."

    );


  }



  return apiClient.get(

    `${endpoints.fertilizers}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Fertilizer data is required."

    );


  }



  return apiClient.post(

    endpoints.fertilizers,

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

      "Fertilizer id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Fertilizer data is required."

    );


  }



  return apiClient.put(

    `${endpoints.fertilizers}/${id}`,

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

      "Fertilizer id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.fertilizers}/${id}`

  );


};






const fertilizerApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default fertilizerApi;
