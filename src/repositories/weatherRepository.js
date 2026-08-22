// src/repositories/weatherRepository.js

import {
  storageService
} from "../storage";

import {
  createError
} from "../utils/errorHandler.js";


class WeatherRepository {

  constructor() {

    this.key =
      "weather";

  }


  // =========================
  // Get Current Weather
  // =========================

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


    const key =

      `${location.latitude},${location.longitude}`;


    return (

      weather.find(

        item =>

          item.location === key

      )

      ??

      null

    );

  }


  // =========================
  // Save Weather
  // =========================

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


  // =========================
  // Delete Weather
  // =========================

  async deleteWeather(location) {

    if (!location) {

      return false;

    }


    const key =

      typeof location === "object"

        ? `${location.latitude},${location.longitude}`

        : location;


    const weather =

      await storageService.load(

        this.key,

        []

      );


    const filtered =

      weather.filter(

        item =>

          item.location !== key

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


  // =========================
  // Exists
  // =========================

  async exists(location) {

    return Boolean(

      await this.getCurrentWeather(

        location

      )

    );

  }


  // =========================
  // Count
  // =========================

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
