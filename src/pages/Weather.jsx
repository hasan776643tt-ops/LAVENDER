// =========================================================
// LAVENDER — WEATHER PAGE
// src/pages/Weather.jsx
// =========================================================

import {
  useContext,
  useMemo,
  useState,
} from "react";

import { FarmContext } from "../context/FarmContext.jsx";
import useWeather from "../hooks/useWeather.js";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export default function Weather() {
  // =======================================================
  // Context
  // =======================================================

  const {
    farms = [],
    locations = [],
    locationActions,
  } = useContext(FarmContext);

  // =======================================================
  // Weather hook
  // =======================================================

  const {
    weather,
    loading,
    error,
    getWeather,
    farmAdvice,
  } = useWeather();

  // =======================================================
  // Selected farm
  // =======================================================

  const [selectedFarm, setSelectedFarm] =
    useState("");

  // =======================================================
  // Current location from context
  // =======================================================

  const farmLocation = useMemo(() => {
    if (!selectedFarm) {
      return null;
    }

    return (
      locations.find(
        (location) =>
          String(location.farmId) ===
          String(selectedFarm)
      ) || null
    );
  }, [locations, selectedFarm]);

  // =======================================================
  // Get selected farm name
  // =======================================================

  const selectedFarmName = useMemo(() => {
    const farm = farms.find(
      (item) =>
        String(item.id) ===
        String(selectedFarm)
    );

    return (
      farm?.name ||
      farm?.farmName ||
      "المزرعة"
    );
  }, [farms, selectedFarm]);

  // =======================================================
  // Load weather
  // =======================================================

  const handleGetWeather = async () => {
    if (!selectedFarm) {
      alert("اختر المزرعة أولاً");
      return;
    }

    try {
      // تحميل أحدث المواقع من خلال Context
      // حتى لا نعتمد على بيانات قديمة في الذاكرة.
      const freshLocations =
        await locationActions.load();

      const currentFarmLocation =
        freshLocations.find(
          (location) =>
            String(location.farmId) ===
            String(selectedFarm)
        ) || null;

      if (!currentFarmLocation) {
        alert(
          "لا يوجد موقع GPS مرتبط بهذه المزرعة"
        );
        return;
      }

      const latitude =
        currentFarmLocation.latitude ??
        currentFarmLocation.lat;

      const longitude =
        currentFarmLocation.longitude ??
        currentFarmLocation.lng;

      if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
      ) {
        alert(
          "الموقع موجود، لكن إحداثيات GPS غير صالحة"
        );
        return;
      }

      await getWeather({
        latitude,
        longitude,
      });
    } catch (err) {
      console.error(
        "LAVENDER Weather page error:",
        err
      );

      alert(
        err?.message ||
          "تعذر تحميل موقع المزرعة"
      );
    }
  };

  // =======================================================
  // Render
  // =======================================================

  return (
    <div
      dir="rtl"
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>🌤️ طقس المزرعة</h1>

      <p>
        اختر المزرعة لعرض حالة الطقس حسب موقعها
        الجغرافي.
      </p>

      {/* =================================================
          Farm selection
      ================================================= */}

      <Card>
        <h2>🏡 اختيار المزرعة</h2>

        <select
          value={selectedFarm}
          onChange={(event) => {
            setSelectedFarm(
              event.target.value
            );
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name ||
                farm.farmName ||
                "مزرعة بدون اسم"}
            </option>
          ))}
        </select>

        {selectedFarm && (
          <p>
            🏡 المزرعة المختارة:{" "}
            <strong>
              {selectedFarmName}
            </strong>
          </p>
        )}

        <Button
          onClick={handleGetWeather}
          disabled={loading}
        >
          {loading
            ? "جاري تحميل الطقس..."
            : "🌤️ عرض الطقس"}
        </Button>
      </Card>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <Card>
          <p>
            ⚠️{" "}
            {error?.message ||
              error ||
              "حدث خطأ أثناء تحميل الطقس"}
          </p>
        </Card>
      )}

      {/* =================================================
          Weather
      ================================================= */}

      {weather && (
        <Card>
          <h2>
            🌤️ حالة الطقس
          </h2>

          {weather.location && (
            <p>
              📍 الموقع:{" "}
              {weather.location.latitude ??
                weather.location.lat}{" "}
              ,{" "}
              {weather.location.longitude ??
                weather.location.lng}
            </p>
          )}

          <p>
            🌡️ الحرارة:{" "}
            {weather.temperature ??
              weather.temp ??
              "--"}
            °C
          </p>

          <p>
            💧 الرطوبة:{" "}
            {weather.humidity ?? "--"}%
          </p>

          <p>
            🌧️ احتمال المطر:{" "}
            {weather.rainChance ??
              weather.rainProbability ??
              "--"}%
          </p>

          {weather.description && (
            <p>
              ☁️ الحالة:{" "}
              {weather.description}
            </p>
          )}
        </Card>
      )}

      {/* =================================================
          Farm advice
      ================================================= */}

      {weather &&
        Array.isArray(farmAdvice) &&
        farmAdvice.length > 0 && (
          <Card>
            <h2>
              🌱 نصائح للمزرعة
            </h2>

            <ul>
              {farmAdvice.map(
                (advice, index) => (
                  <li key={index}>
                    {advice}
                  </li>
                )
              )}
            </ul>
          </Card>
        )}

      {/* =================================================
          Location status
      ================================================= */}

      {selectedFarm && (
        <Card>
          <h3>
            📍 حالة موقع المزرعة
          </h3>

          {farmLocation ? (
            <p>
              ✅ يوجد موقع GPS محفوظ لهذه
              المزرعة.
            </p>
          ) : (
            <p>
              ⚠️ لم يتم العثور على موقع محفوظ
              لهذه المزرعة.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
