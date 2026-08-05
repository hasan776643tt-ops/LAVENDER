// src/api/expenseApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Expense API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.expenses

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "Expense id is required."

    );


  }



  return apiClient.get(

    `${endpoints.expenses}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Expense data is required."

    );


  }



  return apiClient.post(

    endpoints.expenses,

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

      "Expense id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "Expense data is required."

    );


  }



  return apiClient.put(

    `${endpoints.expenses}/${id}`,

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

      "Expense id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.expenses}/${id}`

  );


};






const expenseApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove


});



export default expenseApi;
