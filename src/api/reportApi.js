// src/api/reportApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Report API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.reports

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Report id is required."

    );


  }



  return apiClient.get(

    `${endpoints.reports}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Report data is required."

    );


  }



  return apiClient.post(

    endpoints.reports,

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

      "Report id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Report data is required."

    );


  }



  return apiClient.put(

    `${endpoints.reports}/${id}`,

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

      "Report id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.reports}/${id}`

  );


};






const reportApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default reportApi;
