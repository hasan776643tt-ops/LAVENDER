// src/api/weatherApi.js


const WEATHER_API_KEY =
  "YOUR_WEATHER_API_KEY";


const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";





export async function getCurrentWeather(location) {


  try {


    if (
      !location ||
      location.latitude == null ||
      location.longitude == null
    ) {

      throw new Error(
        "Invalid location"
      );

    }





    const response =
      await fetch(

        `${WEATHER_URL}` +
        `?lat=${location.latitude}` +
        `&lon=${location.longitude}` +
        `&appid=${WEATHER_API_KEY}` +
        `&units=metric` +
        `&lang=ar`

      );





    if (!response.ok) {

      throw new Error(
        "Weather API request failed"
      );

    }





    const data =
      await response.json();





    return data;



  } catch(error) {


    console.error(
      "Weather API Error:",
      error
    );


    return null;


  }


}
