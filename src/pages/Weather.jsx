import {
  useContext,
  useMemo,
  useState,
} from "react";

import { FarmContext } from "../context/FarmContext.jsx";
import useWeather from "../hooks/useWeather.js";

import Card from "../components/ui/Card.jsx";

function valueOf(value) {
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

  return valueOf(
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

  return valueOf(
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

  return valueOf(
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

  return valueOf(
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
    diagnosticLocation,
    setDiagnosticLocation,
  ] = useState(null);

  const selectedFarmObject =
    useMemo(() => {
      return (
        farms.find(
          (farm) =>
            getFarmId(farm) ===
            valueOf(selectedFarm)
        ) || null
      );
    }, [
      farms,
      selectedFarm,
    ]);

  const selectedFarmName =
    getFarmName(
      selectedFarmObject
    );

  const handleGetWeather =
    async () => {
      if (!selectedFarm) {
        alert("اختر المزرعة أولاً");
        return;
      }

      setCheckingLocation(true);

      try {
        let freshLocations = [];

        // =================================================
        // تحميل المواقع مباشرة
        // =================================================

        if (
          locationActions &&
          typeof locationActions.load ===
            "function"
        ) {
          const result =
            await locationActions.load();

          if (Array.isArray(result)) {
            freshLocations = result;
          }
        }

        // =================================================
        // عرض التشخيص
        // =================================================

        console.log(
          "========== LAVENDER WEATHER DIAGNOSTIC =========="
        );

        console.log(
          "Selected Farm:",
          selectedFarmObject
        );

        console.log(
          "Selected Farm ID:",
          selectedFarm
        );

        console.log(
          "Selected Farm Name:",
          selectedFarmName
        );

        console.log(
          "Locations:",
          freshLocations
        );

        console.log(
          "==============================================="
        );

        setDiagnosticLocation(
          freshLocations
        );

        // =================================================
        // البحث عن الموقع
        // =================================================

        let location = null;

        // 1. farmId
        location =
          freshLocations.find(
            (item) =>
              getLocationFarmId(item) ===
              valueOf(selectedFarm)
          ) || null;

        // 2. الاسم
        if (
          !location &&
          selectedFarmName
        ) {
          location =
            freshLocations.find(
              (item) =>
                getLocationFarmName(
                  item
                ) === selectedFarmName
            ) || null;
        }

        // =================================================
        // لم نجد
        // =================================================

        if (!location) {
          alert(
            "لا يوجد موقع GPS مرتبط بهذه المزرعة."
          );

          return;
        }

        // =================================================
        // GPS
        // =================================================

        const latitude =
          getLatitude(location);

        const longitude =
          getLongitude(location);

        if (
          latitude === null ||
          longitude === null
        ) {
          alert(
            "تم العثور على الموقع، لكن إحداثيات GPS غير موجودة."
          );

          return;
        }

        // =================================================
        // Weather
        // =================================================

        await getWeather({
          latitude,
          longitude,
        });
      } catch (err) {
        console.error(
          "LAVENDER WEATHER ERROR:",
          err
        );

        alert(
          err?.message ||
            "حدث خطأ أثناء تحليل الطقس"
        );
      } finally {
        setCheckingLocation(false);
      }
    };

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

            setDiagnosticLocation(
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
              const id =
                getFarmId(farm);

              return (
                <option
                  key={
                    id ||
                    `farm-${index}`
                  }
                  value={id}
                >
                  {getFarmName(
                    farm
                  ) ||
                    "مزرعة بدون اسم"}
                </option>
              );
            }
          )}
        </select>

        {selectedFarmObject && (
          <div
            style={{
              padding: "12px",
              border:
                "1px solid #ddd",
              borderRadius:
                "8px",
              marginBottom:
                "15px",
            }}
          >
            <p>
              🏡 المزرعة:
              <strong>
                {" "}
                {selectedFarmName}
              </strong>
            </p>

            <p>
              🆔 Farm ID:
              <strong>
                {" "}
                {selectedFarm}
              </strong>
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
            padding: "14px",
            fontSize: "16px",
          }}
        >
          {loading ||
          checkingLocation
            ? "جاري التحليل..."
            : "🌦️ تحليل الطقس"}
        </button>
      </Card>

      {/* =================================================
          DIAGNOSTIC
      ================================================= */}

      {Array.isArray(
        diagnosticLocation
      ) && (
        <Card>
          <h2>
            🔎 تشخيص ربط GPS
          </h2>

          <p>
            عدد المواقع المحفوظة:
            <strong>
              {" "}
              {
                diagnosticLocation.length
              }
            </strong>
          </p>

          <hr />

          {diagnosticLocation.length ===
          0 ? (
            <p>
              ❌ لا توجد أي سجلات مواقع
              تصل إلى FarmContext.
            </p>
          ) : (
            diagnosticLocation.map(
              (
                location,
                index
              ) => {
                const id =
                  getLocationFarmId(
                    location
                  );

                const name =
                  getLocationFarmName(
                    location
                  );

                const lat =
                  getLatitude(
                    location
                  );

                const lng =
                  getLongitude(
                    location
                  );

                const selected =
                  id ===
                  valueOf(
                    selectedFarm
                  );

                return (
                  <div
                    key={index}
                    style={{
                      padding:
                        "12px",
                      marginBottom:
                        "10px",
                      border:
                        selected
                          ? "2px solid green"
                          : "1px solid #ddd",
                      borderRadius:
                        "8px",
                    }}
                  >
                    <p>
                      📍 الموقع رقم{" "}
                      {index + 1}
                    </p>

                    <p>
                      🆔 farmId:
                      <strong>
                        {" "}
                        {id ||
                          "غير موجود"}
                      </strong>
                    </p>

                    <p>
                      🏡 farmName:
                      <strong>
                        {" "}
                        {name ||
                          "غير موجود"}
                      </strong>
                    </p>

                    <p>
                      🌐 Latitude:
                      <strong>
                        {" "}
                        {lat ??
                          "غير موجود"}
                      </strong>
                    </p>

                    <p>
                      🌐 Longitude:
                      <strong>
                        {" "}
                        {lng ??
                          "غير موجود"}
                      </strong>
                    </p>

                    {selected && (
                      <p
                        style={{
                          fontWeight:
                            "bold",
                        }}
                      >
                        ✅ هذا الموقع
                        مرتبط بالـ
                        Farm ID المختار.
                      </p>
                    )}
                  </div>
                );
              }
            )
          )}
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
              {weather.location
                .latitude ??
                weather.location
                  .lat ??
                "--"}{" "}
              ,{" "}
              {weather.location
                .longitude ??
                weather.location
                  .lng ??
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

      {error && (
        <Card>
          <p>
            ⚠️{" "}
            {error?.message ||
              error}
          </p>
        </Card>
      )}

      {weather &&
        Array.isArray(
          farmAdvice
        ) &&
        farmAdvice.length >
          0 && (
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
    </div>
  );
}
