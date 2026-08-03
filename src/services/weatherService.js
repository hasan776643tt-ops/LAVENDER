// src/services/weatherService.js

import weatherRepository
  from "../repositories/weatherRepository.js";


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



  validateLocation(location) {


    if (
      !location ||
      typeof location !== "object"
    ) {

      throw new Error(
        "WEATHER_LOCATION_REQUIRED"
      );

    }



    if (
      location.latitude == null ||
      location.longitude == null
    ) {

      throw new Error(
        "WEATHER_COORDINATES_REQUIRED"
      );

    }



    return true;

  }


}


export default Object.freeze(
  new WeatherService()
);
