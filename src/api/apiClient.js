// src/api/apiClient.js


import logger
from "../utils/logger.js";


import {
  handleError
}
from "../utils/errorHandler.js";


import appConfig
from "../config/appConfig.js";




// ===============================
// API Client Configuration
// ===============================


const BASE_URL =

  appConfig?.api?.baseUrl

  ||

  "";



const DEFAULT_TIMEOUT =

  appConfig?.api?.timeout

  ||

  10000;






// ===============================
// Get Authentication Token
// ===============================


const getToken = () => {


  if(
    typeof localStorage === "undefined"
  ) {


    return null;


  }



  return localStorage.getItem(

    "lavender_token"

  );


};






// ===============================
// Request Handler
// ===============================


const request = async (

  endpoint,

  options = {}

) => {


  const controller =

    new AbortController();



  const timeoutId =

    setTimeout(

      () =>

        controller.abort(),

      DEFAULT_TIMEOUT

    );



  try {


    const token =

      getToken();



    const response =

      await fetch(

        `${BASE_URL}${endpoint}`,

        {


          ...options,


          headers: {


            "Content-Type":

              "application/json",



            Accept:

              "application/json",



            ...(token && {


              Authorization:

                `Bearer ${token}`


            }),



            ...options.headers


          },



          signal:

            controller.signal


        }

      );



    clearTimeout(
      timeoutId
    );



    const data =

      await response.json();



    if(
      !response.ok
    ) {


      throw new Error(

        data?.message

        ||

        `API Error ${response.status}`

      );


    }



    return data;



  } catch(error) {


    clearTimeout(
      timeoutId
    );



    const formattedError =

      handleError(
        error
      );



    logger.error(

      "API Request Failed",

      formattedError

    );



    throw formattedError;


  }


};






// ===============================
// HTTP Methods
// ===============================


const get = (

  endpoint,

  options = {}

) => {


  return request(

    endpoint,

    {


      method:

        "GET",


      ...options


    }

  );


};






const post = (

  endpoint,

  data,

  options = {}

) => {


  return request(

    endpoint,

    {


      method:

        "POST",



      body:

        JSON.stringify(
          data
        ),



      ...options


    }

  );


};






const put = (

  endpoint,

  data,

  options = {}

) => {


  return request(

    endpoint,

    {


      method:

        "PUT",



      body:

        JSON.stringify(
          data
        ),



      ...options


    }

  );


};






const patch = (

  endpoint,

  data,

  options = {}

) => {


  return request(

    endpoint,

    {


      method:

        "PATCH",



      body:

        JSON.stringify(
          data
        ),



      ...options


    }

  );


};






const remove = (

  endpoint,

  options = {}

) => {


  return request(

    endpoint,

    {


      method:

        "DELETE",


      ...options


    }

  );


};






// ===============================
// Export API Client
// ===============================


const apiClient = Object.freeze({

  get,

  post,

  put,

  patch,

  delete:

    remove


});



export default apiClient;
