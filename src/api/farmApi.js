// src/api/farmApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Farm API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.farms

  );


};






const getById = async (
  id
) => {


  if(
    !id
  ) {


    throw new Error(

      "Farm id is required."

    );


  }



  return apiClient.get(

    `${endpoints.farms}/${id}`

  );


};






const create = async (
  data
) => {


  if(
    !data
  ) {


    throw new Error(

      "Farm data is required."

    );


  }



  return apiClient.post(

    endpoints.farms,

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

      "Farm id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Farm data is required."

    );


  }



  return apiClient.put(

    `${endpoints.farms}/${id}`,

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

      "Farm id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.farms}/${id}`

  );


};






const farmApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default farmApi;
