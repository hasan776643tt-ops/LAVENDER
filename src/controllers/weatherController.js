// src/controllers/weatherController.js


import weatherService
  from "../services/weatherService.js";





class WeatherController {



  constructor(){


    this.service =
      weatherService;


  }








  async getCurrentWeather(location){


    try{


      return await this.service.getCurrentWeather(

        location

      );



    }catch(error){


      throw new Error(

        `WeatherController getCurrentWeather failed: ${error.message}`

      );


    }


  }








  async refreshWeather(location){


    try{


      return await this.service.refreshWeather(

        location

      );



    }catch(error){


      throw new Error(

        `WeatherController refreshWeather failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new WeatherController()

);
