// src/services/weatherService.js

import weatherRepository
from "../repositories/weatherRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class WeatherService {



  constructor() {

    this.repository =
      weatherRepository;

  }





  async getCurrentWeather(location) {


    this.validateLocation(
      location
    );



    return this.repository.getCurrentWeather(
      location
    );


  }





  async refreshWeather(location) {


    this.validateLocation(
      location
    );



    return this.repository.refreshWeather(
      location
    );


  }





  async getForecast(location) {


    this.validateLocation(
      location
    );



    return this.repository.getForecast(
      location
    );


  }





  validateLocation(location) {


    if (
      !location ||
      typeof location !== "object"
    ) {


      throw createError(

        "Weather location is required",

        "WEATHER_LOCATION_REQUIRED"

      );


    }



    const {
      latitude,
      longitude
    } = location;



    if (
      latitude == null ||
      longitude == null
    ) {


      throw createError(

        "Weather coordinates are required",

        "WEATHER_COORDINATES_REQUIRED"

      );


    }





    if (
      Number(latitude) < -90 ||
      Number(latitude) > 90
    ) {


      throw createError(

        "Invalid latitude",

        "INVALID_LATITUDE"

      );


    }





    if (
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {


      throw createError(

        "Invalid longitude",

        "INVALID_LONGITUDE"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new WeatherService()

);
