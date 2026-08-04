// src/controllers/weatherController.js


import weatherService
  from "../services/weatherService.js";



class WeatherController {



  constructor(service) {

    this.service =
      service;

  }



  async getCurrentWeather(location) {

    return this.service.getCurrentWeather(
      location
    );

  }



  async refreshWeather(location) {

    return this.service.refreshWeather(
      location
    );

  }


}



const weatherController =
  new WeatherController(
    weatherService
  );



export default Object.freeze(
  weatherController
);
