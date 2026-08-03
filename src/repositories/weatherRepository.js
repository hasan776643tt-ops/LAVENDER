// src/repositories/weatherRepository.js

import * as weatherApi from "../api/weatherApi.js";


class WeatherRepository {


  async getCurrentWeather(location) {

    if (!location) {
      throw new Error(
        "Location is required."
      );
    }


    return await weatherApi.getCurrentWeather(
      location
    );

  }


  async refreshWeather(location) {

    if (!location) {
      throw new Error(
        "Location is required."
      );
    }


    return await weatherApi.getCurrentWeather(
      location
    );

  }


}


export default Object.freeze(
  new WeatherRepository()
);
