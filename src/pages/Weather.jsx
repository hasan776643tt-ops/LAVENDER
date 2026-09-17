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

function getLocationFarmName(location) {
  if (!location) {
    return "";
  }

  return clean(
    location.farmName ??
      location.farm?.name ??
      location.farm?.farmName ??
      location.name ??
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

function getLocationTime(location) {
  if (!location) {
    return 0;
  }

  const value =
    location.updatedAt ??
    location.createdAt ??
    location.savedAt ??
    0;

  const time = Date.parse(value);

  return Number.isFinite(time)
    ? time
    : 0;
}

// =========================================================
// Find best location for selected farm
// =========================================================

function findFarmLocation(
  locationList,
  farmId,
  farmName
) {
  if (!Array.isArray(locationList)) {
    return null;
  }

  const selectedId = clean(farmId);
  const selectedName = clean(farmName);

  if (!selectedId && !selectedName) {
    return null;
  }

  // -------------------------------------------------------
  // 1. المطابقة الصحيحة والأساسية: farmId
  // -------------------------------------------------------

  const byFarmId = locationList
    .filter((location) => {
      return (
        getLocationFarmId(location) ===
        selectedId
      );
    })
    .filter(hasValidCoordinates)
    .sort(
      (a, b) =>
        getLocationTime(b) -
        getLocationTime(a)
    );

  if (byFarmId.length > 0) {
    return byFarmId[0];
  }

  // -------------------------------------------------------
  // 2. سجل قديم بدون farmId
  // -------------------------------------------------------

  const legacyByName = locationList
    .filter((location) => {
      const locationId =
        getLocationFarmId(location);

      return (
        !locationId &&
        selectedName &&
        getLocationFarmName(location) ===
          selectedName
      );
    })
    .filter(hasValidCoordinates)
    .sort(
      (a, b) =>
        getLocationTime(b) -
        getLocationTime(a)
    );

  if (legacyByName.length > 0) {
    return legacyByName[0];
  }

  // -------------------------------------------------------
  // 3. توافق مع سجل قديم فيه farmName
  //    حتى لو كان farmId قديمًا/غير متطابق
  //
  //    نستخدمه فقط إذا لم نجد أي farmId مطابق.
  // -------------------------------------------------------

  const sameName = locationList
    .filter((location) => {
      return (
        selectedName &&
        getLocationFarmName(location) ===
          selectedName
      );
    })
    .filter(hasValidCoordinates)
    .sort(
      (a, b) =>
        getLocationTime(b) -
        getLocationTime(a)
    );

  if (sameName.length === 1) {
    return sameName[0];
  }

  // -------------------------------------------------------
  // 4. إذا كان هناك أكثر من سجل بنفس الاسم،
  //    لا نختار عشوائيًا.
  // -------------------------------------------------------

  if (sameName.length > 1) {
    const withoutFarmId =
      sameName.filter(
        (location) =>
          !getLocationFarmId(location)
      );

    if (withoutFarmId.length === 1) {
      return withoutFarmId[0];
    }
  }

  return null;
}

// =========================================================
// Weather Page
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

  // =======================================================
  // Selected farm
  // =======================================================

  const selectedFarmObject = useMemo(() => {
    const selectedId =
      clean(selectedFarm);

    if (!selectedId) {
      return null;
    }

    return (
      farms.find(
        (farm) =>
          getFarmId(farm) ===
          selectedId
      ) || null
    );
  }, [farms, selectedFarm]);

  const selectedFarmName = useMemo(() => {
    return (
      getFarmName(selectedFarmObject) ||
      ""
    );
  }, [selectedFarmObject]);

  // =======================================================
  // Location from Context
  // =======================================================

  const farmLocation = useMemo(() => {
    return findFarmLocation(
      locations,
      selectedFarm,
      selectedFarmName
    );
  }, [
    locations,
    selectedFarm,
    selectedFarmName,
  ]);

  // =======================================================
  // Get Weather
  // =======================================================

  const handleGetWeather = async () => {
    if (!selectedFarm) {
      alert("اختر المزرعة أولاً");
      return;
    }

    if (!locationActions) {
      alert(
        "نظام مواقع المزارع غير متاح حاليًا"
      );
      return;
    }

    setCheckingLocation(true);

    try {
      let currentFarmLocation = null;

      // ---------------------------------------------------
      // 1. محاولة المصدر المباشر بواسطة farmId
      // ---------------------------------------------------

      if (
        typeof locationActions.getLatestByFarmId ===
        "function"
      ) {
        currentFarmLocation =
          await locationActions.getLatestByFarmId(
            selectedFarm
          );
      }

      // ---------------------------------------------------
      // 2. إذا لم نجد الموقع، حمّل جميع المواقع من التخزين
      // ---------------------------------------------------

      let freshLocations = null;

      if (
        typeof locationActions.load ===
        "function"
      ) {
        freshLocations =
          await locationActions.load();
      }

      // ---------------------------------------------------
      // 3. البحث الشامل
      // ---------------------------------------------------

      if (
        !currentFarmLocation &&
        Array.isArray(freshLocations)
      ) {
        currentFarmLocation =
          findFarmLocation(
            freshLocations,
            selectedFarm,
            selectedFarmName
          );
      }

      // ---------------------------------------------------
      // 4. محاولة أخيرة من Context
      // ---------------------------------------------------

      if (!currentFarmLocation) {
        currentFarmLocation =
          farmLocation;
      }

      // ---------------------------------------------------
      // 5. لم نجد موقعًا
      // ---------------------------------------------------

      if (!currentFarmLocation) {
        alert(
          `لم يتم العثور على موقع GPS للمزرعة "${selectedFarmName || "المختارة"}".\n\nافتح الخريطة وتأكد من حفظ موقع هذه المزرعة.`
        );

        return;
      }

      // ---------------------------------------------------
      // 6. استخراج الإحداثيات
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
      // 7. التحقق من الإحداثيات
      // ---------------------------------------------------

      if (
        latitude === null ||
        longitude === null
      ) {
        console.error(
          "LAVENDER Weather: location found but coordinates missing",
          currentFarmLocation
        );

        alert(
          "تم العثور على موقع المزرعة، لكن إحداثيات GPS غير موجودة أو غير صالحة."
        );

        return;
      }

      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        console.error(
          "LAVENDER Weather: invalid coordinates",
          {
            latitude,
            longitude,
            location:
              currentFarmLocation,
          }
        );

        alert(
          "إحداثيات GPS المحفوظة غير صحيحة."
        );

        return;
      }

      // ---------------------------------------------------
      // 8. تحميل الطقس
      // ---------------------------------------------------

      console.log(
        "LAVENDER Weather GPS:",
        {
          farmId: selectedFarm,
          farmName: selectedFarmName,
          latitude,
          longitude,
          location:
            currentFarmLocation,
        }
      );

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
          <p>
            🏡 المزرعة المختارة:{" "}
            <strong>
              {selectedFarmName ||
                "المزرعة"}
            </strong>
          </p>
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
          {loading || checkingLocation
            ? "جاري تحليل الطقس..."
            : "🌦️ تحليل الطقس"}
        </button>
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
                ✅ تم العثور على موقع محفوظ
                للمزرعة.
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

              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.7,
                }}
              >
                Farm ID:{" "}
                {getLocationFarmId(
                  farmLocation
                ) || "غير موجود"}
              </p>
            </>
          ) : (
            <p>
              ⚠️ لم يتم العثور على موقع مطابق
              حاليًا. سيتم البحث في التخزين عند
              الضغط على تحليل الطقس.
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
