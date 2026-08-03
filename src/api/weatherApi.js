// src/api/weatherApi.js


import appConfig
  from "../config/appConfig.js";



const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";



const getApiKey = () =>

  appConfig?.weather?.apiKey
  ||
  "YOUR_WEATHER_API_KEY";



const validateLocation = (
  location
) => {


  if (

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



  return true;

};



const getCurrentWeather = async (
  location
) => {


  try {


    validateLocation(
      location
    );



    const apiKey =
      getApiKey();



    const response =
      await fetch(

        `${WEATHER_URL}`

        +

        `?lat=${location.latitude}`

        +

        `&lon=${location.longitude}`

        +

        `&appid=${apiKey}`

        +

        `&units=metric`

        +

        `&lang=ar`

      );



    if (!response.ok) {

      throw new Error(
        "Weather request failed."
      );

    }



    const data =
      await response.json();



    return {

      location,

      temperature:
        data.main?.temp ?? null,


      feelsLike:
        data.main?.feels_like ?? null,


      humidity:
        data.main?.humidity ?? null,


      windSpeed:
        data.wind?.speed ?? null,


      condition:
        data.weather?.[0]?.description
        || null,


      icon:
        data.weather?.[0]?.icon
        || null,


      raw:
        data,


      updatedAt:
        new Date().toISOString()

    };



  } catch (error) {


    console.error(
      "Weather API Error:",
      error.message
    );


    return null;

  }


};



const weatherApi = Object.freeze({

  getCurrentWeather

});



export default weatherApi;
