// src/controllers/weatherController.js

import * as weatherApi from "../api/weatherApi.js";

class WeatherController {
  async getCurrentWeather(location) {
    try {
      if (!location) {
        throw new Error("Location is required.");
      }

      const weather = await weatherApi.getCurrentWeather(location);

      return {
        success: true,
        data: weather,
        message: "Weather loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async refreshWeather(location) {
    return this.getCurrentWeather(location);
  }

  validateLocation(location) {
    if (!location) return false;

    if (
      typeof location !== "object" ||
      location.latitude == null ||
      location.longitude == null
    ) {
      return false;
    }

    return true;
  }

  formatWeather(weather) {
    if (!weather) return null;

    return {
      temperature: Number(weather.temperature ?? 0),
      humidity: Number(weather.humidity ?? 0),
      windSpeed: Number(weather.windSpeed ?? 0),
      rainChance: Number(weather.rainChance ?? 0),
      pressure: Number(weather.pressure ?? 0),
      condition: weather.condition ?? "Unknown",
      icon: weather.icon ?? "",
      updatedAt: weather.updatedAt ?? new Date().toISOString(),
    };
  }

  handleError(error) {
    console.error("[WeatherController]", error);

    return {
      success: false,
      data: null,
      message: error.message || "Unexpected weather error.",
    };
  }
}

export default new WeatherController();
