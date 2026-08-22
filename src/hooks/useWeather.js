// src/hooks/useWeather.js

import {
  useState,
  useCallback,
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


  const getWeather = useCallback(

    async (
      latitude,
      longitude
    ) => {

      try {

        setLoading(true);

        setError(null);


        const data =
          await weatherService.getCurrentWeather({

            latitude,

            longitude,

          });


        setWeather(data);


        return data;


      } catch (err) {

        setError(
          err?.message ||
          "حدث خطأ أثناء جلب بيانات الطقس."
        );

        throw err;


      } finally {

        setLoading(false);

      }

    },

    []

  );


  const farmAdvice = useCallback(

    () => {

      if (!weather) {

        return null;

      }


      const {
        temperature,
        humidity,
        rainChance,
      } = weather;


      if (
        temperature != null &&
        temperature >= 35
      ) {

        return "⚠️ الحرارة مرتفعة، يفضل زيادة مراقبة الري.";

      }


      if (
        humidity != null &&
        humidity < 30
      ) {

        return "💧 الرطوبة منخفضة، يفضل فحص الري.";

      }


      if (
        rainChance != null &&
        rainChance > 70
      ) {

        return "🌧️ احتمال الأمطار مرتفع، راقب عمليات الري.";

      }


      if (
        rainChance != null &&
        rainChance < 20
      ) {

        return "🌱 الأمطار قليلة، راجع خطة الري.";

      }


      return "✅ الظروف الجوية مناسبة.";

    },

    [weather]

  );


  return {

    weather,

    loading,

    error,

    getWeather,

    farmAdvice,

  };

}
