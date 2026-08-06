// src/controllers/weatherController.js


import weatherService
  from "../services/weatherService.js";



class WeatherController {


  constructor(service) {

    this.service = service;

  }



  async getCurrentWeather(location) {

    try {

      return await this.service.getCurrentWeather(
        location
      );


    } catch(error) {

      throw new Error(
        `WEATHER_GET_CURRENT_FAILED:${error.message}`
      );

    }

  }



  async refreshWeather(location) {

    try {

      return await this.service.refreshWeather(
        location
      );


    } catch(error) {

      throw new Error(
        `WEATHER_REFRESH_FAILED:${error.message}`
      );

    }

  }


}



const weatherController =
  new WeatherController(
    weatherService
  );



export default Object.freeze(
  weatherController
);
