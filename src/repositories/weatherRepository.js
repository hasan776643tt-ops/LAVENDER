// src/repositories/weatherRepository.js

import * as weatherApi from "../api/weatherApi.js";


class WeatherRepository {


  constructor() {

    this.cache = new Map();


    this.cacheDuration =
      10 * 60 * 1000;

  }





  async getCurrentWeather(location) {


    try {


      this.validateLocation(
        location
      );



      const cacheKey =
        this.createCacheKey(
          location
        );



      const cached =
        this.cache.get(
          cacheKey
        );



      if (
        cached &&
        !this.isCacheExpired(
          cached.timestamp
        )
      ) {

        return cached.data;

      }





      const weather =
        await weatherApi.getCurrentWeather(
          location
        );





      if (!weather) {

        throw new Error(
          "Weather data unavailable"
        );

      }





      this.cache.set(

        cacheKey,

        {
          data: weather,

          timestamp:
            Date.now()

        }

      );





      return weather;




    } catch(error) {


      throw new Error(

        `Weather repository get failed: ${error.message}`

      );


    }


  }








  async refreshWeather(location) {


    try {


      this.validateLocation(
        location
      );



      const cacheKey =
        this.createCacheKey(
          location
        );



      const weather =
        await weatherApi.getCurrentWeather(
          location
        );



      if (!weather) {

        throw new Error(
          "Weather data unavailable"
        );

      }



      this.cache.set(

        cacheKey,

        {

          data: weather,

          timestamp:
            Date.now()

        }

      );



      return weather;



    } catch(error) {


      throw new Error(

        `Weather repository refresh failed: ${error.message}`

      );


    }


  }







  clearCache() {


    this.cache.clear();


  }







  removeFromCache(location) {


    this.validateLocation(
      location
    );


    const cacheKey =
      this.createCacheKey(
        location
      );



    this.cache.delete(
      cacheKey
    );


  }







  getCacheStats() {


    return {

      size:
        this.cache.size,


      keys:
        Array.from(
          this.cache.keys()
        )


    };


  }







  validateLocation(location) {


    if (!location) {


      throw new Error(
        "Location is required"
      );


    }



    if (

      typeof location !== "object" ||

      location.latitude == null ||

      location.longitude == null

    ) {


      throw new Error(
        "Invalid location"
      );


    }


    return true;


  }







  createCacheKey(location) {


    return `${location.latitude},${location.longitude}`;


  }







  isCacheExpired(timestamp) {


    return (

      Date.now()
      -
      timestamp

    >
      this.cacheDuration

    );


  }



}





export default Object.freeze(

  new WeatherRepository()

);
