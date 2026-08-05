// src/api/userApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// User API
// ===============================


const getAll = async () => {


  return apiClient.get(

    endpoints.users

  );


};






const getById = async (

  id

) => {


  if(
    !id
  ) {


    throw new Error(

      "User id is required."

    );


  }



  return apiClient.get(

    `${endpoints.users}/${id}`

  );


};






const create = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "User data is required."

    );


  }



  return apiClient.post(

    endpoints.users,

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

      "User id is required."

    );


  }



  if(
    !data
  ) {


    throw new Error(

      "User data is required."

    );


  }



  return apiClient.put(

    `${endpoints.users}/${id}`,

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

      "User id is required."

    );


  }



  return apiClient.delete(

    `${endpoints.users}/${id}`

  );


};






// ===============================
// Authentication
// ===============================


const login = async (

  credentials

) => {


  if(
    !credentials
  ) {


    throw new Error(

      "Login credentials are required."

    );


  }



  return apiClient.post(

    endpoints.auth.login,

    credentials

  );


};






const register = async (

  data

) => {


  if(
    !data
  ) {


    throw new Error(

      "Registration data is required."

    );


  }



  return apiClient.post(

    endpoints.auth.register,

    data

  );


};






const logout = async () => {


  return apiClient.post(

    endpoints.auth.logout

  );


};






const getProfile = async () => {


  return apiClient.get(

    endpoints.auth.profile

  );


};






const userApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:

    remove,


  login,

  register,

  logout,

  getProfile

});



export default userApi;
