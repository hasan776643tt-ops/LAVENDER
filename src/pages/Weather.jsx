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

// =========================================================
// Helpers
// =========================================================

function clean(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function getFarmId(farm) {
  if (!farm) {
    return "";
  }

  return clean(
    farm.id ??
      farm.farmId ??
      farm._id ??
      farm.farm_id ??
      ""
  );
}

function getFarmName(farm) {
  if (!farm) {
    return "";
  }

  return clean(
    farm.name ??
      farm.farmName ??
      farm.title ??
      ""
  );
}

function getLocationFarmId(location) {
  if (!location) {
    return "";
  }

  return clean(
    location.farmId ??
      location.farmID ??
      location.farm_id ??
      location.farm?.id ??
      location.farm?._id ??
      location.farm?.farmId ??
      ""
  );
}

function getLatitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.latitude ??
    location.lat ??
    location.center?.latitude ??
    location.center?.lat ??
    location.coordinates?.latitude ??
    location.coordinates?.lat;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getLongitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.longitude ??
    location.lng ??
    location.lon ??
    location.center?.longitude ??
    location.center?.lng ??
    location.coordinates?.longitude ??
    location.coordinates?.lng;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function hasValidCoordinates(location) {
  const latitude = getLatitude(location);
  const longitude = getLongitude(location);

  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

// =========================================================
// WEATHER PAGE
// =========================================================

export default function Weather() {
  const {
    farms = [],
    locations = [],
    locationActions,
  } = useContext(FarmContext);

  const {
    weather,
    loading,
    error,
    getWeather,
    farmAdvice,
  } = useWeather();

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState("");

  const [
    checkingLocation,
    setCheckingLocation,
  ] = useState(false);

  const [
    currentLocation,
    setCurrentLocation,
  ] = useState(null);

  // =======================================================
  // Selected Farm
  // =======================================================

  const selectedFarmObject = useMemo(() => {
    const wantedId = clean(selectedFarm);

    if (!wantedId) {
      return null;
    }

    return (
      farms.find(
        (farm) =>
          getFarmId(farm) === wantedId
      ) || null
    );
  }, [farms, selectedFarm]);

  const selectedFarmName = useMemo(() => {
    return getFarmName(selectedFarmObject);
  }, [selectedFarmObject]);

  // =======================================================
  // Find location from already loaded locations
  // =======================================================

  const findLoadedLocation = (farmId) => {
    const wantedId = clean(farmId);

    if (!wantedId || !Array.isArray(locations)) {
      return null;
    }

    const matches = locations.filter(
      (location) =>
        getLocationFarmId(location) ===
        wantedId
    );

    if (matches.length === 0) {
      return null;
    }

    const withCoordinates = matches.filter(
      (location) =>
        hasValidCoordinates(location)
    );

    if (withCoordinates.length > 0) {
      return withCoordinates[
        withCoordinates.length - 1
      ];
    }

    return matches[matches.length - 1];
  };

  // =======================================================
  // GET WEATHER
  // =======================================================

  const handleGetWeather = async () => {
    if (!selectedFarm) {
      alert("اختر المزرعة أولاً");
      return;
    }

    setCheckingLocation(true);
    setCurrentLocation(null);

    try {
      const farmId = clean(selectedFarm);
      const farmName = clean(selectedFarmName);

      let location = null;

      // ---------------------------------------------------
      // أولاً:
      // استخدم الموقع المحمّل أصلًا من FarmContext.
      // ---------------------------------------------------

      location = findLoadedLocation(farmId);

      // ---------------------------------------------------
      // ثانيًا:
      // اطلب الموقع من locationActions إذا لم نجده.
      // ---------------------------------------------------

      if (
        !location &&
        locationActions &&
        typeof locationActions.getLatestByFarmId ===
          "function"
      ) {
        location =
          await locationActions.getLatestByFarmId(
            farmId,
            farmName
          );
      }

      // ---------------------------------------------------
      // ثالثًا:
      // محاولة أخيرة من قائمة المواقع الحالية.
      // ---------------------------------------------------

      if (!location) {
        location = findLoadedLocation(farmId);
      }

      console.log(
        "LAVENDER WEATHER — FARM ID:",
        farmId
      );

      console.log(
        "LAVENDER WEATHER — FARM NAME:",
        farmName
      );

      console.log(
        "LAVENDER WEATHER — LOCATION:",
        location
      );

      // ---------------------------------------------------
      // لم نجد موقعًا
      // ---------------------------------------------------

      if (!location) {
        alert(
          `لا يوجد موقع محفوظ لهذه المزرعة.\n\n` +
            `المزرعة: ${
              farmName || "المختارة"
            }\n\n` +
            `Farm ID: ${farmId}\n\n` +
            `افتح الخريطة، اختر هذه المزرعة، ` +
            `واحفظ موقعها أولاً.`
        );

        return;
      }

      // ---------------------------------------------------
      // استخراج الإحداثيات
      // ---------------------------------------------------

      const latitude = getLatitude(location);
      const longitude = getLongitude(location);

      console.log(
        "LAVENDER WEATHER — COORDINATES:",
        {
          farmId,
          latitude,
          longitude,
          location,
        }
      );

      // ---------------------------------------------------
      // التحقق من الإحداثيات
      // ---------------------------------------------------

      if (
        latitude === null ||
        longitude === null ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        alert(
          "تم العثور على موقع المزرعة، لكن إحداثيات GPS المحفوظة غير صحيحة."
        );

        return;
      }

      // ---------------------------------------------------
      // عرض الموقع المستخدم
      // ---------------------------------------------------

      setCurrentLocation({
        ...location,
        farmId:
          getLocationFarmId(location) ||
          farmId,
        farmName:
          clean(location.farmName) ||
          farmName,
        latitude,
        longitude,
      });

      // ---------------------------------------------------
      // إرسال الإحداثيات إلى نظام الطقس
      // ---------------------------------------------------

      const result = await getWeather({
        latitude,
        longitude,
      });

      if (!result) {
        console.error(
          "LAVENDER WEATHER — EMPTY WEATHER RESULT"
        );
      }
    } catch (err) {
      console.error(
        "LAVENDER WEATHER ERROR:",
        err
      );

      alert(
        err?.message ||
          "تعذر تحميل بيانات الطقس"
      );
    } finally {
      setCheckingLocation(false);
    }
  };

  // =======================================================
  // RENDER
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
      <h1>
        ☀️ نظام الطقس الزراعي الذكي
      </h1>

      <p>
        تحليل الطقس اعتمادًا على الموقع
        المحفوظ للمزرعة من نظام الخريطة.
      </p>

      {/* =================================================
          FARM
      ================================================= */}

      <Card>
        <h2>🏡 اختيار المزرعة</h2>

        <select
          value={selectedFarm}
          onChange={(event) => {
            setSelectedFarm(
              event.target.value
            );
            setCurrentLocation(null);
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm, index) => {
            const farmId =
              getFarmId(farm);

            const farmName =
              getFarmName(farm) ||
              "مزرعة بدون اسم";

            return (
              <option
                key={
                  farmId ||
                  `farm-${index}`
                }
                value={farmId}
              >
                {farmName}
              </option>
            );
          })}
        </select>

        {selectedFarm && (
          <div>
            <p>
              🏡 المزرعة المختارة:{" "}
              <strong>
                {selectedFarmName ||
                  "المزرعة"}
              </strong>
            </p>

            <p
              style={{
                fontSize: "13px",
                opacity: 0.7,
              }}
            >
              Farm ID: {selectedFarm}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGetWeather}
          disabled={
            loading ||
            checkingLocation
          }
          style={{
            width: "100%",
            padding: "13px 16px",
            fontSize: "16px",
            cursor:
              loading ||
              checkingLocation
                ? "not-allowed"
                : "pointer",
            opacity:
              loading ||
              checkingLocation
                ? 0.7
                : 1,
          }}
        >
          {loading ||
          checkingLocation
            ? "جاري تحليل الطقس..."
            : "🌦️ تحليل الطقس"}
        </button>
      </Card>

      {/* =================================================
          LOCATION
      ================================================= */}

      {selectedFarm && (
        <Card>
          <h3>
            📍 موقع المزرعة المستخدم
          </h3>

          {!currentLocation && (
            <p>
              سيتم استخدام الموقع المحفوظ
              لهذه المزرعة من نظام الخريطة.
            </p>
          )}

          {currentLocation && (
            <>
              <p>
                ✅ تم العثور على الموقع
                المحفوظ للمزرعة.
              </p>

              <p>
                📌 خط العرض:{" "}
                {getLatitude(
                  currentLocation
                )}
              </p>

              <p>
                📌 خط الطول:{" "}
                {getLongitude(
                  currentLocation
                )}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.7,
                }}
              >
                Farm ID:{" "}
                {clean(
                  currentLocation.farmId
                ) || selectedFarm}
              </p>

              {clean(
                currentLocation.farmName
              ) && (
                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.7,
                  }}
                >
                  اسم المزرعة:{" "}
                  {clean(
                    currentLocation.farmName
                  )}
                </p>
              )}
            </>
          )}
        </Card>
      )}

      {/* =================================================
          ERROR
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
          WEATHER
      ================================================= */}

      {weather && (
        <Card>
          <h2>🌤️ حالة الطقس</h2>

          {weather.location && (
            <p>
              📍 الإحداثيات المستخدمة:{" "}
              {weather.location.latitude ??
                weather.location.lat ??
                "--"}{" "}
              ,{" "}
              {weather.location.longitude ??
                weather.location.lng ??
                "--"}
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
              "--"}
            %
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
          ADVICE
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
          INFORMATION
      ================================================= */}

      <Card>
        <h2>
          📡 مصدر بيانات الموقع
        </h2>

        <p>
          يستخدم نظام الطقس إحداثيات الموقع
          المحفوظة في الخريطة للمزرعة
          المختارة.
        </p>

        <p>
          لا يطلب نظام الطقس موقع GPS جديدًا
          من الهاتف.
        </p>

        <p>
          المزرعة يتم تحديدها بواسطة
          <strong> Farm ID </strong>
          وليس بواسطة اسم المزرعة.
        </p>
      </Card>
    </div>
  );
}
