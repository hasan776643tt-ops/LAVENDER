// src/api/irrigationApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Irrigation API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.irrigation

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Irrigation id is required."

    );


  }



  return apiClient.get(

    `${endpoints.irrigation}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Irrigation data is required."

    );


  }



  return apiClient.post(

    endpoints.irrigation,

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

      "Irrigation id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Irrigation data is required."

    );


  }



  return apiClient.put(

    `${endpoints.irrigation}/${id}`,

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

      "Irrigation id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.irrigation}/${id}`

  );


};






const irrigationApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default irrigationApi;
