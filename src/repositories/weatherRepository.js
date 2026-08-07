// src/repositories/weatherRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class WeatherRepository {


  constructor() {

    this.key =
      "weather";

  }





  async getCurrentWeather(location) {


    if (!location) {


      throw createError(

        "Weather location is required",

        "WEATHER_LOCATION_REQUIRED"

      );


    }



    const weather =

      await storageService.load(

        this.key,

        []

      );



    return (

      weather.find(

        item =>

          item.location === location

      )

      ??

      null

    );


  }





  async saveWeather(data) {


    if (

      !data ||

      !data.location

    ) {


      throw createError(

        "Weather data with location is required",

        "WEATHER_DATA_REQUIRED"

      );


    }



    const weather =

      await storageService.load(

        this.key,

        []

      );



    const filtered =

      weather.filter(

        item =>

          item.location !== data.location

      );



    const weatherItem = {


      id:

        data.id ??

        crypto.randomUUID(),


      ...data,


      updatedAt:

        new Date().toISOString()


    };



    filtered.push(

      weatherItem

    );



    await storageService.save(

      this.key,

      filtered

    );



    return weatherItem;


  }





  async deleteWeather(location) {


    if (!location) {


      return false;


    }



    const weather =

      await storageService.load(

        this.key,

        []

      );



    const filtered =

      weather.filter(

        item =>

          item.location !== location

      );



    const deleted =

      filtered.length !== weather.length;



    if (deleted) {


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(location) {


    return Boolean(

      await this.getCurrentWeather(

        location

      )

    );


  }





  async count() {


    const weather =

      await storageService.load(

        this.key,

        []

      );



    return weather.length;


  }


}





const weatherRepository =

  new WeatherRepository();



export default Object.freeze(

  weatherRepository

);
