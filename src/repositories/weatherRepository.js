// src/hooks/useWeather.js

import {
  useState,
  useCallback
} from "react";

import weatherService
  from "../services/weatherService.js";


export default function useWeather() {

  const [weather, setWeather] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);



  // =========================
  // Get Current Weather
  // =========================

  const getWeather = useCallback(

    async (location) => {

      try {

        setLoading(true);

        setError(null);


        const data =
          await weatherService.getCurrentWeather(
            location
          );


        setWeather(data);


        return data;


      } catch (err) {

        setError(err);


        throw err;


      } finally {

        setLoading(false);

      }

    },

    []

  );



  // =========================
  // Refresh Weather
  // =========================

  const refreshWeather = useCallback(

    async (location) => {

      try {

        setLoading(true);

        setError(null);


        const data =
          await weatherService.refreshWeather(
            location
          );


        setWeather(data);


        return data;


      } catch (err) {

        setError(err);


        throw err;


      } finally {

        setLoading(false);

      }

    },

    []

  );



  // =========================
  // Forecast
  // =========================

  const getForecast = useCallback(

    async (location) => {

      try {

        setLoading(true);

        setError(null);


        const data =
          await weatherService.getForecast(
            location
          );


        return data;


      } catch (err) {

        setError(err);


        throw err;


      } finally {

        setLoading(false);

      }

    },

    []

  );



  // =========================
  // Agricultural Advice
  // =========================

  const farmAdvice = useCallback(

    () => {

      if (!weather) {

        return null;

      }


      const {
        humidity,
        rainChance,
        temperature
      } = weather;



      if (
        humidity != null &&
        humidity < 30
      ) {

        return (
          "💧 الرطوبة منخفضة، يفضل فحص الري."
        );

      }



      if (
        rainChance != null &&
        rainChance > 70
      ) {

        return (
          "🌧️ احتمال أمطار مرتفع، راقب عمليات الري."
        );

      }



      if (
        temperature != null &&
        temperature >= 35
      ) {

        return (
          "⚠️ الحرارة مرتفعة، يفضل زيادة مراقبة الري."
        );

      }



      return (
        "✅ الظروف الجوية مناسبة."
      );

    },

    [weather]

  );



  // =========================
  // Clear Weather
  // =========================

  const clearWeather = useCallback(

    () => {

      setWeather(null);

      setError(null);

    },

    []

  );



  return {

    weather,

    loading,

    error,

    getWeather,

    refreshWeather,

    getForecast,

    farmAdvice,

    clearWeather

  };

}
