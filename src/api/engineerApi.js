// src/api/engineerApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Engineer API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.engineers

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Engineer id is required."

    );


  }



  return apiClient.get(

    `${endpoints.engineers}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Engineer data is required."

    );


  }



  return apiClient.post(

    endpoints.engineers,

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

      "Engineer id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Engineer data is required."

    );


  }



  return apiClient.put(

    `${endpoints.engineers}/${id}`,

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

      "Engineer id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.engineers}/${id}`

  );


};






const engineerApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default engineerApi;
