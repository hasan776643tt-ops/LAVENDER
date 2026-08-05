// src/api/fieldApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Field API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.fields

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Field id is required."

    );


  }



  return apiClient.get(

    `${endpoints.fields}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Field data is required."

    );


  }



  return apiClient.post(

    endpoints.fields,

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

      "Field id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Field data is required."

    );


  }



  return apiClient.put(

    `${endpoints.fields}/${id}`,

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

      "Field id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.fields}/${id}`

  );


};






const fieldApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default fieldApi;
