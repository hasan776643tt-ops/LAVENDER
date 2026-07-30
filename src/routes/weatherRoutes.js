// src/routes/weatherRoutes.js

import weatherController from "../controllers/weatherController.js";


class WeatherRoutes {


  constructor() {

    this.controller = weatherController;

  }




  async getCurrentWeather(location) {

    try {

      return await this.controller.getCurrentWeather(
        location
      );


    } catch (error) {

      throw new Error(
        `Weather routes get current weather failed: ${error.message}`
      );

    }

  }




  async refreshWeather(location) {

    try {

      return await this.controller.refreshWeather(
        location
      );


    } catch (error) {

      throw new Error(
        `Weather routes refresh failed: ${error.message}`
      );

    }

  }




  async getForecast(location) {

    try {

      return await this.controller.getForecast(
        location
      );


    } catch (error) {

      throw new Error(
        `Weather routes forecast failed: ${error.message}`
      );

    }

  }




  async clearCache() {

    try {

      return await this.controller.clearCache();


    } catch (error) {

      throw new Error(
        `Weather routes clear cache failed: ${error.message}`
      );

    }

  }




  health() {

    return {

      success: true,

      module: "WeatherRoutes",

      version: "1.0.0",

      status: "Ready",

      timestamp:
        new Date().toISOString()

    };

  }


}



export default Object.freeze(
  new WeatherRoutes()
);
