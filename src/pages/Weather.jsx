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
  if (
    value === null ||
    value === undefined
  ) {
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

  return Number.isFinite(number)
    ? number
    : null;
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

  return Number.isFinite(number)
    ? number
    : null;
}

function hasValidCoordinates(location) {
  const latitude =
    getLatitude(location);

  const longitude =
    getLongitude(location);

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

  const selectedFarmObject =
    useMemo(() => {

      const wantedId =
        clean(selectedFarm);

      if (!wantedId) {
        return null;
      }

      return (
        farms.find(
          farm =>
            getFarmId(farm) ===
            wantedId
        ) || null
      );

    }, [
      farms,
      selectedFarm,
    ]);

  const selectedFarmName =
    useMemo(() => {

      return getFarmName(
        selectedFarmObject
      );

    }, [
      selectedFarmObject,
    ]);

  // =======================================================
  // GET WEATHER
  // =======================================================

  const handleGetWeather =
    async () => {

      if (!selectedFarm) {
        alert(
          "اختر المزرعة أولاً"
        );
        return;
      }

      setCheckingLocation(true);
      setCurrentLocation(null);

      try {

        const farmId =
          clean(selectedFarm);

        const farmName =
          clean(selectedFarmName);

        // -------------------------------------------------
        // التحقق من وجود نظام المواقع في FarmContext
        // -------------------------------------------------

        if (
          !locationActions ||
          typeof locationActions
            .getLatestByFarmId !==
          "function"
        ) {

          console.error(
            "LAVENDER WEATHER — locationActions غير متاحة"
          );

          alert(
            "تعذر الوصول إلى نظام مواقع المزرعة."
          );

          return;
        }

        // -------------------------------------------------
        // المصدر الرسمي لموقع المزرعة
        //
        // farmId هو الأساس.
        // farmName يستخدم فقط لمعالجة البيانات القديمة
        // وفق القواعد الموجودة في FarmContext.
        // -------------------------------------------------

        console.log(
          "LAVENDER WEATHER — FARM ID:",
          farmId
        );

        console.log(
          "LAVENDER WEATHER — FARM:",
          selectedFarmObject
        );

        console.log(
          "LAVENDER WEATHER — FARM NAME:",
          farmName
        );

        const location =
          await locationActions
            .getLatestByFarmId(
              farmId,
              farmName
            );

        console.log(
          "LAVENDER WEATHER — RESOLVED LOCATION:",
          location
        );

        // -------------------------------------------------
        // لم نجد موقعًا
        // -------------------------------------------------

        if (!location) {

          alert(
            `لا يوجد موقع GPS مرتبط بهذه المزرعة.\n\n` +
            `المزرعة: ${
              farmName ||
              "المختارة"
            }\n\n` +
            `Farm ID:\n${farmId}\n\n` +
            `افتح الخريطة لهذه المزرعة وتأكد من حفظ الموقع.`
          );

          return;
        }

        // -------------------------------------------------
        // استخراج GPS
        // -------------------------------------------------

        const latitude =
          getLatitude(location);

        const longitude =
          getLongitude(location);

        console.log(
          "LAVENDER WEATHER — LOCATION DATA:",
          {
            farmId,
            farmName,
            location,
            locationFarmId:
              clean(
                location.farmId
              ),
            locationFarmName:
              clean(
                location.farmName
              ),
            latitude,
            longitude,
          }
        );

        // -------------------------------------------------
        // التحقق من GPS
        // -------------------------------------------------

        if (
          !hasValidCoordinates(
            location
          )
        ) {

          console.error(
            "LAVENDER WEATHER — INVALID OR MISSING GPS:",
            location
          );

          alert(
            "تم العثور على موقع المزرعة، لكن إحداثيات GPS المحفوظة غير موجودة أو غير صحيحة."
          );

          return;
        }

        // -------------------------------------------------
        // حفظ الموقع للعرض
        // -------------------------------------------------

        setCurrentLocation(
          location
        );

        // -------------------------------------------------
        // إرسال GPS إلى نظام الطقس
        // -------------------------------------------------

        console.log(
          "LAVENDER WEATHER — USING GPS:",
          {
            farmId,
            farmName,
            latitude,
            longitude,
          }
        );

        const result =
          await getWeather({
            latitude,
            longitude,
          });

        if (!result) {
          console.error(
            "LAVENDER WEATHER — WEATHER RESULT IS EMPTY"
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
        تحليل الظروف الجوية وتأثيرها على
        المحاصيل.
      </p>

      {/* =================================================
          FARM
      ================================================= */}

      <Card>

        <h2>
          📍 اختيار المزرعة
        </h2>

        <select
          value={selectedFarm}
          onChange={event => {

            setSelectedFarm(
              event.target.value
            );

            setCurrentLocation(
              null
            );

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

          {farms.map(
            (farm, index) => {

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

            }
          )}

        </select>

        {selectedFarm && (
          <div>

            <p>
              🏡 المزرعة المختارة:{" "}
              <strong>
                {
                  selectedFarmName ||
                  "المزرعة"
                }
              </strong>
            </p>

            <p
              style={{
                fontSize: "13px",
                opacity: 0.7,
              }}
            >
              Farm ID:{" "}
              {selectedFarm}
            </p>

          </div>
        )}

        <button
          type="button"
          onClick={
            handleGetWeather
          }
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
            📍 موقع المزرعة
          </h3>

          {!currentLocation && (
            <p>
              اضغط «تحليل الطقس» لجلب موقع
              المزرعة مباشرة من نظام مواقع
              LAVENDER.
            </p>
          )}

          {currentLocation && (
            <>
              <p>
                ✅ تم العثور على موقع GPS
                للمزرعة.
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
                Farm ID المحفوظ:{" "}
                {clean(
                  currentLocation.farmId
                ) ||
                  "غير موجود"}
              </p>

              {currentLocation.farmName && (
                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.7,
                  }}
                >
                  اسم المزرعة في الموقع:{" "}
                  {
                    currentLocation.farmName
                  }
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

          <h2>
            🌤️ حالة الطقس
          </h2>

          {weather.location && (
            <p>
              📍 الموقع:{" "}
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
            {weather.humidity ??
              "--"}
            %
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
        Array.isArray(
          farmAdvice
        ) &&
        farmAdvice.length > 0 && (

          <Card>

            <h2>
              🌱 نصائح للمزرعة
            </h2>

            <ul>

              {farmAdvice.map(
                (
                  advice,
                  index
                ) => (
                  <li
                    key={index}
                  >
                    {advice}
                  </li>
                )
              )}

            </ul>

          </Card>

        )}

      {/* =================================================
          FUTURE
      ================================================= */}

      <Card>

        <h2>
          🚀 جاهزية التطوير المستقبلي
        </h2>

        <p>
          🌍 ربط API طقس عالمي.
        </p>

        <p>
          📡 تحديث تلقائي عبر GPS.
        </p>

        <p>
          🤖 توقع احتياجات الري بالذكاء
          الاصطناعي.
        </p>

        <p>
          🌡️ ربط حساسات التربة والبيوت
          الزراعية.
        </p>

        <p>
          🔔 إرسال تنبيهات للمزارع.
        </p>

      </Card>

    </div>
  );
}

[/writing]

الآن فقط

1. استبدل "src/pages/Weather.jsx" بهذا الكود.
2. احفظ في GitHub.
3. انتظر Vercel حتى ينتهي Deploy.
4. افتح التطبيق.
5. اختر أي مزرعة.
6. اضغط 🌦️ تحليل الطقس.

لا ترسل لي أي ملف آخر الآن.
قل لي فقط ماذا ظهر بعد الضغط: هل ظهر الطقس، أم ما زالت رسالة «لا يوجد موقع GPS»؟
