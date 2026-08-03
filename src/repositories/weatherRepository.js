// src/repositories/weatherRepository.js


import storageService
  from "../services/storageService.js";


class WeatherRepository {


  constructor() {

    this.key =
      "weather";

  }



  async getCurrentWeather(location) {


    if (!location) {

      throw new Error(
        "Location is required."
      );

    }


    const weather =
      storageService.load(
        this.key
      ) || [];


    return (
      weather.find(
        item =>
          item.location === location
      ) || null
    );

  }



  async saveWeather(data) {


    if (!data?.location) {

      throw new Error(
        "Weather location is required."
      );

    }


    const weather =
      storageService.load(
        this.key
      ) || [];


    const filtered =
      weather.filter(
        item =>
          item.location !== data.location
      );


    filtered.push(
      data
    );


    storageService.save(
      this.key,
      filtered
    );


    return data;

  }



  async deleteWeather(location) {


    const weather =
      storageService.load(
        this.key
      ) || [];


    const filtered =
      weather.filter(
        item =>
          item.location !== location
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }


}


export default Object.freeze(
  new WeatherRepository()
);
