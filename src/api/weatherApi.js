// src/api/weatherApi.js


import apiClient
from "./apiClient.js";


import endpoints
from "./endpoints.js";




// ===============================
// Weather API
// ===============================


const getCurrentWeather = async (

  location

) => {


  if(

    !location

    ||

    location.latitude == null

    ||

    location.longitude == null

  ) {


    throw new Error(

      "Valid location is required."

    );


  }



  return apiClient.get(

    endpoints.weather.current,

    {

      params: {

        latitude:
          location.latitude,


        longitude:
          location.longitude

      }

    }

  );


};






const weatherApi = Object.freeze({

  getCurrentWeather

});



export default weatherApi;
