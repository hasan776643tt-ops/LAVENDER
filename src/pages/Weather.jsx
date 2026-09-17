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

// =========================================================
// Helpers
// =========================================================

function getFarmId(farm) {
  if (!farm) {
    return "";
  }

  return String(
    farm.id ??
      farm.farmId ??
      farm._id ??
      ""
  );
}

function getFarmName(farm) {
  if (!farm) {
    return "";
  }

  return String(
    farm.name ??
      farm.farmName ??
      farm.title ??
      ""
  ).trim();
}

function getLocationFarmId(location) {
  if (!location) {
    return "";
  }

  return String(
    location.farmId ??
      location.farmID ??
      location.farm_id ??
      location.farm?.id ??
      location.farm?._id ??
      location.farm?.farmId ??
      ""
  );
}

function getLocationFarmName(location) {
  if (!location) {
    return "";
  }

  return String(
    location.farmName ??
      location.farm?.name ??
      location.farm?.farmName ??
      ""
  ).trim();
}

function getLatitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.latitude ??
    location.lat ??
    location.center?.latitude ??
    location.center?.lat;

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
    location.center?.lng;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

// =========================================================
// Weather Page
// =========================================================

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

  const [
    checkingLocation,
    setCheckingLocation,
  ] = useState(false);

  // =======================================================
  // Selected farm object
  // =======================================================

  const selectedFarmObject = useMemo(() => {
    return (
      farms.find(
        (farm) =>
          getFarmId(farm) ===
          String(selectedFarm)
      ) || null
    );
  }, [farms, selectedFarm]);

  // =======================================================
  // Selected farm name
  // =======================================================

  const selectedFarmName = useMemo(() => {
    return (
      getFarmName(selectedFarmObject) ||
      "المزرعة"
    );
  }, [selectedFarmObject]);

  // =======================================================
  // Location currently in Context
  // =======================================================

  const farmLocation = useMemo(() => {
    if (!selectedFarm) {
      return null;
    }

    const selectedId =
      String(selectedFarm);

    // -----------------------------------------------------
    // 1. البحث حسب farmId
    // -----------------------------------------------------

    const byFarmId =
      locations.find(
        (location) =>
          getLocationFarmId(location) ===
          selectedId
      );

    if (byFarmId) {
      return byFarmId;
    }

    // -----------------------------------------------------
    // 2. البحث القديم حسب farmName
    // -----------------------------------------------------

    if (selectedFarmName) {
      const byFarmName =
        locations.find(
          (location) =>
            !getLocationFarmId(location) &&
            getLocationFarmName(location) ===
              selectedFarmName
        );

      if (byFarmName) {
        return byFarmName;
      }
    }

    return null;
  }, [
    locations,
    selectedFarm,
    selectedFarmName,
  ]);

  // =======================================================
  // Get weather
  // =======================================================

  const handleGetWeather = async () => {
    if (!selectedFarm) {
      alert("اختر المزرعة أولاً");
      return;
    }

    if (
      !locationActions ||
      typeof locationActions
        .getLatestByFarmId !==
        "function"
    ) {
      alert(
        "نظام مواقع المزارع غير متاح حاليًا"
      );
      return;
    }

    setCheckingLocation(true);

    try {
      let currentFarmLocation = null;

      // ---------------------------------------------------
      // 1. البحث حسب farmId ثم farmName
      // ---------------------------------------------------

      currentFarmLocation =
        await locationActions.getLatestByFarmId(
          selectedFarm,
          selectedFarmName
        );

      // ---------------------------------------------------
      // 2. إذا لم نجده، نعيد تحميل المواقع
      //    ثم نبحث حسب farmId
      //    ثم farmName للسجلات القديمة
      // ---------------------------------------------------

      if (!currentFarmLocation) {
        const freshLocations =
          await locationActions.load();

        if (
          Array.isArray(freshLocations)
        ) {
          // أولًا: farmId
          currentFarmLocation =
            freshLocations.find(
              (location) =>
                getLocationFarmId(
                  location
                ) ===
                String(selectedFarm)
            ) || null;

          // ثانيًا: farmName
          if (
            !currentFarmLocation &&
            selectedFarmName
          ) {
            currentFarmLocation =
              freshLocations.find(
                (location) =>
                  !getLocationFarmId(
                    location
                  ) &&
                  getLocationFarmName(
                    location
                  ) === selectedFarmName
              ) || null;
          }
        }
      }

      // ---------------------------------------------------
      // 3. محاولة أخيرة من المواقع الموجودة في Context
      // ---------------------------------------------------

      if (!currentFarmLocation) {
        currentFarmLocation =
          farmLocation || null;
      }

      // ---------------------------------------------------
      // 4. التحقق من وجود الموقع
      // ---------------------------------------------------

      if (!currentFarmLocation) {
        alert(
          "لا يوجد موقع GPS مرتبط بهذه المزرعة. افتح الخريطة واحفظ موقع المزرعة أولاً."
        );
        return;
      }

      // ---------------------------------------------------
      // 5. استخراج الإحداثيات
      // ---------------------------------------------------

      const latitude =
        getLatitude(
          currentFarmLocation
        );

      const longitude =
        getLongitude(
          currentFarmLocation
        );

      // ---------------------------------------------------
      // 6. التحقق من الإحداثيات
      // ---------------------------------------------------

      if (
        latitude === null ||
        longitude === null
      ) {
        console.error(
          "LAVENDER Weather invalid location:",
          currentFarmLocation
        );

        alert(
          "الموقع محفوظ، لكن إحداثيات GPS غير صالحة."
        );

        return;
      }

      // ---------------------------------------------------
      // 7. التحقق من نطاق الإحداثيات
      // ---------------------------------------------------

      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        alert(
          "إحداثيات GPS المحفوظة غير صحيحة."
        );

        return;
      }

      // ---------------------------------------------------
      // 8. تحميل الطقس باستخدام GPS
      // ---------------------------------------------------

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
          "تعذر تحميل بيانات الطقس"
      );
    } finally {
      setCheckingLocation(false);
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
      <h1>
        ☀️ نظام الطقس الزراعي الذكي
      </h1>

      <p>
        تحليل الظروف الجوية وتأثيرها على
        المحاصيل.
      </p>

      {/* =================================================
          Farm Selection
      ================================================= */}

      <Card>
        <h2>
          📍 اختيار المزرعة
        </h2>

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
            fontSize: "16px",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => {
            const farmId =
              getFarmId(farm);

            return (
              <option
                key={farmId}
                value={farmId}
              >
                {getFarmName(farm) ||
                  "مزرعة بدون اسم"}
              </option>
            );
          })}
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
          disabled={
            loading ||
            checkingLocation
          }
        >
          {loading || checkingLocation
            ? "جاري تحليل الطقس..."
            : "🌦️ تحليل الطقس"}
        </Button>
      </Card>

      {/* =================================================
          Location Status
      ================================================= */}

      {selectedFarm && (
        <Card>
          <h3>
            📍 موقع المزرعة
          </h3>

          {farmLocation ? (
            <>
              <p>
                ✅ يوجد موقع محفوظ للمزرعة.
              </p>

              {getLatitude(
                farmLocation
              ) !== null &&
                getLongitude(
                  farmLocation
                ) !== null && (
                  <p>
                    📌 إحداثيات GPS:{" "}
                    {getLatitude(
                      farmLocation
                    )}{" "}
                    ,{" "}
                    {getLongitude(
                      farmLocation
                    )}
                  </p>
                )}
            </>
          ) : (
            <p>
              ⚠️ لم يتم العثور على موقع في
              ذاكرة الصفحة. عند الضغط على
              تحليل الطقس سيتم البحث مباشرة
              في الموقع المحفوظ للمزرعة.
            </p>
          )}
        </Card>
      )}

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
          Weather Result
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
          Farm Advice
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
          Future Development
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
