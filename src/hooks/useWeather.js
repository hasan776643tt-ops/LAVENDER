// =========================================================
// LAVENDER — WEATHER HOOK
// src/hooks/useWeather.js
// =========================================================

import {
  useCallback,
  useState,
} from "react";

import weatherService from "../services/weatherService.js";

export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =======================================================
  // Get weather
  // Supports:
  // getWeather({ latitude, longitude })
  // and old:
  // getWeather(latitude, longitude)
  // =======================================================

  const getWeather = useCallback(
    async (
      locationOrLatitude,
      maybeLongitude
    ) => {
      setLoading(true);
      setError(null);

      try {
        let latitude;
        let longitude;

        if (
          locationOrLatitude &&
          typeof locationOrLatitude === "object"
        ) {
          latitude =
            locationOrLatitude.latitude ??
            locationOrLatitude.lat;

          longitude =
            locationOrLatitude.longitude ??
            locationOrLatitude.lng;
        } else {
          latitude = locationOrLatitude;
          longitude = maybeLongitude;
        }

        const result =
          await weatherService.getCurrentWeather({
            latitude,
            longitude,
          });

        setWeather(result);

        return result;
      } catch (err) {
        console.error(
          "LAVENDER Weather error:",
          err
        );

        setError(
          err?.message ||
            "تعذر تحميل بيانات الطقس"
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =======================================================
  // Farm advice
  // =======================================================

  const farmAdvice = useCallback(() => {
    if (!weather) {
      return [];
    }

    const advice = [];

    const temperature =
      Number(
        weather.temperature ??
        weather.temp ??
        0
      );

    const humidity =
      Number(
        weather.humidity ?? 0
      );

    const rainChance =
      Number(
        weather.rainChance ??
        weather.rainProbability ??
        0
      );

    if (temperature >= 35) {
      advice.push(
        "الحرارة مرتفعة، راقب رطوبة التربة ووقت الري."
      );
    } else if (temperature <= 5) {
      advice.push(
        "الحرارة منخفضة، راقب احتمال تأثر النبات بالبرد."
      );
    }

    if (humidity >= 80) {
      advice.push(
        "الرطوبة مرتفعة، راقب الأمراض الفطرية."
      );
    } else if (humidity <= 30) {
      advice.push(
        "الرطوبة منخفضة، راقب احتياج النبات للماء."
      );
    }

    if (rainChance >= 70) {
      advice.push(
        "احتمال المطر مرتفع، راجع قرار الري قبل تشغيله."
      );
    }

    if (advice.length === 0) {
      advice.push(
        "الظروف الحالية لا تتطلب تنبيهًا زراعيًا خاصًا."
      );
    }

    return advice;
  }, [weather]);

  return {
    weather,
    loading,
    error,
    getWeather,
    farmAdvice: farmAdvice(),
  };
}
