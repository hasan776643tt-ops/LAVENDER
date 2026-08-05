// src/api/diseaseApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Disease API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.diseases

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Disease id is required."

    );


  }



  return apiClient.get(

    `${endpoints.diseases}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Disease data is required."

    );


  }



  return apiClient.post(

    endpoints.diseases,

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

      "Disease id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Disease data is required."

    );


  }



  return apiClient.put(

    `${endpoints.diseases}/${id}`,

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

      "Disease id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.diseases}/${id}`

  );


};






const diseaseApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default diseaseApi;
