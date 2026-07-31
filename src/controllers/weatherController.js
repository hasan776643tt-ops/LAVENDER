// src/controllers/weatherController.js


import weatherService
  from "../services/weatherService.js";



class WeatherController {



  async getCurrentWeather(location) {

    try {


      if (!this.validateLocation(location)) {

        throw new Error(
          "Invalid location"
        );

      }



      const weather =
        await weatherService.getCurrentWeather(
          location
        );



      return {

        success:true,

        data:weather,

        message:
          "Weather loaded successfully."

      };



    } catch(error) {


      return this.handleError(error);


    }

  }








  async refreshWeather(location) {

    try {


      if (!this.validateLocation(location)) {

        throw new Error(
          "Invalid location"
        );

      }



      const weather =
        await weatherService.refreshWeather(
          location
        );



      return {

        success:true,

        data:weather,

        message:
          "Weather refreshed successfully."

      };



    } catch(error) {


      return this.handleError(error);


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








  handleError(error) {


    console.error(

      "[WeatherController]",

      error

    );



    return {

      success:false,

      data:null,

      message:

        error.message ||

        "Unexpected weather error."

    };


  }



}



export default Object.freeze(

  new WeatherController()

);
