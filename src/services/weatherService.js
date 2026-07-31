// src/services/weatherService.js


import weatherRepository
  from "../repositories/weatherRepository.js";



class WeatherService {



  constructor() {

    this.repository =
      weatherRepository;

  }





  async getCurrentWeather(location) {

    try {


      if (!location) {

        throw new Error(
          "Location is required"
        );

      }



      return await this.repository.getCurrentWeather(
        location
      );



    } catch(error) {


      throw new Error(

        `WeatherService getCurrentWeather failed: ${error.message}`

      );


    }

  }







  async refreshWeather(location) {

    try {


      if (!location) {

        throw new Error(
          "Location is required"
        );

      }



      return await this.repository.refreshWeather(
        location
      );



    } catch(error) {


      throw new Error(

        `WeatherService refreshWeather failed: ${error.message}`

      );


    }

  }







  validateLocation(location) {


    if (!location) {

      return false;

    }



    if (

      typeof location !== "object" ||

      location.latitude == null ||

      location.longitude == null

    ) {

      return false;

    }



    return true;


  }



}



export default Object.freeze(

  new WeatherService()

);
