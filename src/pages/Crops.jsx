// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import mapService from "../services/mapService.js";
import cropService from "../services/cropService.js";


// =========================================================
// LAVENDER — CROPS PAGE
// =========================================================
//
// العلاقة:
// Farm.id
//    ↓
// Location.farmId
//    ↓
// latitude / longitude / boundary
//    ↓
// Smart Recommendations
//
// قواعد:
// - Farm تُسجل مرة واحدة.
// - Crop يحتفظ بـ farmId.
// - Location كيان مستقل.
// - الإحداثيات هي الحقيقة الجغرافية.
// - Reverse Geocoding معلومات وصفية فقط.
// - mapLocation في localStorage ليس مصدر الحقيقة.
// - لا نجلب جميع Locations ثم نعمل filter.
// - نستعمل getLocationByFarmId(farmId).
//
// =========================================================


const EMPTY = Object.freeze({
  farmId: "",
  cultivationType: "field",

  name: "",
  seedType: "",
  seedVariety: "",
  seedQuality: "",
  seedQuantity: "",

  treeType: "",
  treeVariety: "",

  plantingDate: "",

  fertilizerType: "",
  fertilizerQuantity: "",

  harvestDate: "",
  expectedProduction: "",

  latitude: "",
  longitude: "",
  boundary: [],

  climate: "",
  recommendedSeeds: [],

  notes: "",
});


// =========================================================
// HELPERS
// =========================================================

function getFarmId(farm) {
  return (
    farm?.id ??
    farm?._id ??
    farm?.farmId ??
    ""
  );
}


function getFarmName(farm) {
  return (
    farm?.name ??
    farm?.farmName ??
    farm?.title ??
    "مزرعة"
  );
}


function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function normalizePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(point => {
      if (Array.isArray(point)) {
        const latitude = getNumber(point[0]);
        const longitude = getNumber(point[1]);

        return (
          latitude !== null &&
          longitude !== null
            ? { latitude, longitude }
            : null
        );
      }

      if (
        point &&
        typeof point === "object"
      ) {
        const latitude =
          getNumber(
            point.latitude ??
            point.lat
          );

        const longitude =
          getNumber(
            point.longitude ??
            point.lng
          );

        return (
          latitude !== null &&
          longitude !== null
            ? { latitude, longitude }
            : null
        );
      }

      return null;
    })
    .filter(Boolean);
}


function normalizeLocation(location) {
  if (!location) {
    return null;
  }

  const points =
    normalizePoints(
      location.points
    );

  const boundary =
    normalizePoints(
      location.boundary
    );

  const safeBoundary =
    boundary.length > 0
      ? boundary
      : points;

  const latitude =
    getNumber(
      location.latitude ??
      location.lat
    );

  const longitude =
    getNumber(
      location.longitude ??
      location.lng
    );

  if (
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  return {
    ...location,

    latitude,
    longitude,

    points,

    boundary:
      safeBoundary,
  };
}


function hasCoordinates(location) {
  const latitude =
    getNumber(
      location?.latitude ??
      location?.lat
    );

  const longitude =
    getNumber(
      location?.longitude ??
      location?.lng
    );

  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}


function getLocationName(location) {
  if (!location) {
    return "";
  }

  return (
    location.village ||
    location.town ||
    location.city ||
    location.district ||
    location.region ||
    location.governorate ||
    location.province ||
    location.country ||
    ""
  );
}


function getLocationDescription(location) {
  if (!location) {
    return "";
  }

  return (
    location.locationDescription ||
    location.displayName ||
    location.placeName ||
    ""
  );
}


function calculateAge(date) {
  if (!date) {
    return "";
  }

  const start = new Date(date);
  const now = new Date();

  if (
    Number.isNaN(
      start.getTime()
    )
  ) {
    return "";
  }

  if (start > now) {
    return "لم تبدأ الزراعة بعد";
  }

  let years =
    now.getFullYear() -
    start.getFullYear();

  let months =
    now.getMonth() -
    start.getMonth();

  let days =
    now.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

    days +=
      previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years} سنة و${months} شهر و${days} يوم`;
  }

  if (months > 0) {
    return `${months} شهر و${days} يوم`;
  }

  return `${days} يوم`;
}


// =========================================================
// PAGE
// =========================================================

export default function Crops() {
  const {
    farms = [],
    loading: farmsLoading,
  } = useFarms();

  const {
    crops = [],
    loading,
    error,
    loadCrops,
    addCrop,
    deleteCrop,
  } = useCrops();


  const [form, setForm] =
    useState(() => ({
      ...EMPTY,
      boundary: [],
      recommendedSeeds: [],
    }));

  const [message, setMessage] =
    useState("");

  const [mapLocation, setMapLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");


  // =======================================================
  // LOAD CROPS
  // =======================================================

  useEffect(() => {
    loadCrops().catch(() => {});
  }, [loadCrops]);


  // =======================================================
  // FARM ID FROM URL
  // =======================================================

  const farmIdFromUrl =
    useMemo(() => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      return (
        params.get("farmId") || ""
      );
    }, []);


  // =======================================================
  // APPLY FARM FROM URL
  // =======================================================

  useEffect(() => {
    if (!farmIdFromUrl) {
      return;
    }

    const exists =
      farms.some(
        farm =>
          String(
            getFarmId(farm)
          ) ===
          String(farmIdFromUrl)
      );

    if (!exists) {
      return;
    }

    setForm(current => {
      if (
        String(current.farmId) ===
        String(farmIdFromUrl)
      ) {
        return current;
      }

      return {
        ...current,
        farmId: farmIdFromUrl,
      };
    });
  }, [
    farmIdFromUrl,
    farms,
  ]);


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            String(
              getFarmId(farm)
            ) ===
            String(form.farmId)
        ) || null,
      [
        farms,
        form.farmId,
      ]
    );


  // =======================================================
  // LOAD LOCATION DIRECTLY BY FARM ID
  // =======================================================
  //
  // لا:
  // getAllLocations() → filter()
  //
  // نعم:
  // getLocationByFarmId(farmId)
  //
  // =======================================================

  useEffect(() => {
    let active = true;

    const loadSelectedFarmLocation =
      async () => {
        setMapLocation(null);
        setLocationError("");

        if (!form.farmId) {
          setLocationLoading(false);
          return;
        }

        setLocationLoading(true);

        try {
          const location =
            await mapService.getLocationByFarmId(
              form.farmId
            );

          if (!active) {
            return;
          }

          const normalized =
            normalizeLocation(
              location
            );

          setMapLocation(
            normalized
          );

          if (!normalized) {
            setLocationError(
              "لا يوجد موقع محفوظ لهذه المزرعة."
            );
          }
        } catch (err) {
          if (!active) {
            return;
          }

          console.error(
            "Crops farm location loading failed:",
            err
          );

          setMapLocation(null);

          setLocationError(
            "تعذر تحميل موقع المزرعة."
          );
        } finally {
          if (active) {
            setLocationLoading(false);
          }
        }
      };

    loadSelectedFarmLocation();

    return () => {
      active = false;
    };
  }, [
    form.farmId,
  ]);


  // =======================================================
  // LOCATION FOR RECOMMENDATIONS
  // =======================================================

  const locationForRecommendation =
    useMemo(() => {
      if (
        !hasCoordinates(
          mapLocation
        )
      ) {
        return null;
      }

      return {
        latitude:
          mapLocation.latitude,

        longitude:
          mapLocation.longitude,

        boundary:
          Array.isArray(
            mapLocation.boundary
          )
            ? mapLocation.boundary
            : [],
      };
    }, [
      mapLocation,
    ]);


  // =======================================================
  // SMART RECOMMENDATIONS
  // =======================================================

  const smartRecommendations =
    useMemo(() => {
      if (
        !locationForRecommendation
      ) {
        return null;
      }

      try {
        return cropService.getSmartRecommendations(
          locationForRecommendation
        );
      } catch (err) {
        console.error(
          "Smart recommendations failed:",
          err
        );

        return null;
      }
    }, [
      locationForRecommendation,
    ]);


  const climate =
    smartRecommendations?.climate ||
    "";


  const recommendedSeeds =
    Array.isArray(
      smartRecommendations?.crops
    )
      ? smartRecommendations.crops
          .map(
            crop =>
              crop?.name
          )
          .filter(Boolean)
      : [];


  // =======================================================
  // PLANT AGE
  // =======================================================

  const plantAge =
    calculateAge(
      form.plantingDate
    );


  // =======================================================
  // FARM CHANGE
  // =======================================================

  const change = event => {
    const {
      name,
      value,
    } = event.target;

    setMessage("");

    if (name === "farmId") {
      setMapLocation(null);
      setLocationError("");
    }

    setForm(current => ({
      ...current,
      [name]: value,
    }));
  };


  // =======================================================
  // OPEN MAP
  // =======================================================

  const chooseMapLocation = () => {
    if (!form.farmId) {
      setMessage(
        "اختر المزرعة أولًا."
      );

      return;
    }

    window.location.href =
      `/map?return=crops&farmId=${encodeURIComponent(
        String(form.farmId)
      )}`;
  };


  // =======================================================
  // REFRESH LOCATION
  // =======================================================

  const refreshMapLocation =
    async () => {
      setMessage("");
      setLocationError("");

      if (!form.farmId) {
        setMessage(
          "اختر المزرعة أولًا."
        );

        return;
      }

      setLocationLoading(true);

      try {
        const location =
          await mapService.getLocationByFarmId(
            form.farmId
          );

        const normalized =
          normalizeLocation(
            location
          );

        setMapLocation(
          normalized
        );

        setMessage(
          normalized
            ? "تم تحديث موقع الأرض من الخريطة."
            : "لا يوجد موقع محفوظ لهذه المزرعة."
        );

        if (!normalized) {
          setLocationError(
            "حدد موقع الأرض من الخريطة ثم احفظه."
          );
        }
      } catch (err) {
        console.error(
          "Crops location refresh failed:",
          err
        );

        setMapLocation(null);

        setLocationError(
          "تعذر تحديث موقع الأرض."
        );
      } finally {
        setLocationLoading(false);
      }
    };


  // =======================================================
  // SAVE
  // =======================================================

  const save =
    async event => {
      event.preventDefault();

      setMessage("");

      if (!form.farmId) {
        setMessage(
          "يرجى اختيار المزرعة."
        );

        return;
      }

      if (!selectedFarm) {
        setMessage(
          "المزرعة المختارة غير موجودة."
        );

        return;
      }

      const cropName =
        String(
          form.name || ""
        ).trim();

      if (!cropName) {
        setMessage(
          "يرجى كتابة ماذا زرعت."
        );

        return;
      }


      /*
       * نعيد جلب Location من المصدر
       * المرتبط بالمزرعة مباشرة قبل الحفظ.
       *
       * هذا يمنع حفظ Location قديمة
       * موجودة في حالة الواجهة.
       */

      let freshLocation = null;

      try {
        const location =
          await mapService.getLocationByFarmId(
            form.farmId
          );

        freshLocation =
          normalizeLocation(
            location
          );
      } catch (err) {
        console.error(
          "Fresh farm location loading failed:",
          err
        );
      }


      if (
        !hasCoordinates(
          freshLocation
        )
      ) {
        setMessage(
          "لم يتم العثور على موقع أرض محفوظ لهذه المزرعة. افتح الخريطة وحدد الأرض ثم احفظ الموقع."
        );

        return;
      }


      const recommendations =
        cropService.getSmartRecommendations(
          {
            latitude:
              freshLocation.latitude,

            longitude:
              freshLocation.longitude,

            boundary:
              Array.isArray(
                freshLocation.boundary
              )
                ? freshLocation.boundary
                : [],
          }
        );


      try {
        await addCrop({
          ...form,

          farmId:
            String(
              getFarmId(
                selectedFarm
              )
            ),

          cultivationType:
            "field",

          name:
            cropName,

          seedQuantity:
            Number(
              form.seedQuantity || 0
            ),

          fertilizerQuantity:
            Number(
              form.fertilizerQuantity || 0
            ),

          expectedProduction:
            Number(
              form.expectedProduction || 0
            ),

          latitude:
            freshLocation.latitude,

          longitude:
            freshLocation.longitude,

          boundary:
            Array.isArray(
              freshLocation.boundary
            )
              ? freshLocation.boundary
              : [],

          climate:
            recommendations?.climate ||
            "",

          recommendedSeeds:
            Array.isArray(
              recommendations?.crops
            )
              ? recommendations.crops
                  .map(
                    crop =>
                      crop?.name
                  )
                  .filter(Boolean)
              : [],
        });


        setMessage(
          "✅ تم حفظ المحصول بنجاح."
        );


        setForm({
          ...EMPTY,

          farmId:
            form.farmId,

          cultivationType:
            "field",

          boundary: [],

          recommendedSeeds: [],
        });


        /*
         * نحافظ على Location الخاصة
         * بالمزرعة المختارة في الواجهة.
         */
        setMapLocation(
          freshLocation
        );
      } catch (err) {
        console.error(
          "Crop save failed:",
          err
        );

        setMessage(
          err?.message ||
          "تعذر حفظ المحصول."
        );
      }
    };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main
      dir="rtl"
      style={pageStyle}
    >

      <header>
        <h1>
          🌱 المحاصيل
        </h1>

        <p style={mutedStyle}>
          تسجيل وإدارة المحاصيل
          المرتبطة بالمزرعة وموقع الأرض.
        </p>
      </header>


      {(message || error) && (
        <div style={messageStyle}>
          {message ||
            error?.message ||
            "حدث خطأ."}
        </div>
      )}


      {locationError && (
        <div style={messageStyle}>
          {locationError}
        </div>
      )}


      <form onSubmit={save}>

        {/* =================================================
            1. FARM
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            1. المزرعة
          </h2>

          <select
            name="farmId"
            value={form.farmId}
            onChange={change}
            disabled={farmsLoading}
            style={inputStyle}
          >
            <option value="">
              {farmsLoading
                ? "جاري تحميل المزارع..."
                : "اختر المزرعة"}
            </option>

            {farms.map(farm => {
              const id =
                getFarmId(farm);

              return (
                <option
                  key={String(id)}
                  value={String(id)}
                >
                  {getFarmName(farm)}
                </option>
              );
            })}
          </select>


          {selectedFarm && (
            <div style={farmInfoStyle}>
              🏡 المزرعة المختارة:{" "}
              <strong>
                {getFarmName(
                  selectedFarm
                )}
              </strong>
            </div>
          )}
        </section>


        {/* =================================================
            2. LOCATION
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            2. موقع المزرعة
          </h2>


          {!form.farmId ? (
            <p style={mutedStyle}>
              اختر المزرعة أولًا لاسترجاع
              موقعها المحفوظ.
            </p>
          ) : locationLoading ? (
            <div style={loadingBox}>
              📍 جاري استرجاع موقع
              المزرعة...
            </div>
          ) : hasCoordinates(
              mapLocation
            ) ? (
            <div style={locationBox}>

              <strong>
                📍 موقع الأرض المحفوظ
              </strong>


              {getLocationName(
                mapLocation
              ) && (
                <div>
                  📌 المنطقة:{" "}
                  {getLocationName(
                    mapLocation
                  )}
                </div>
              )}


              {getLocationDescription(
                mapLocation
              ) && (
                <div style={locationDescription}>
                  {getLocationDescription(
                    mapLocation
                  )}
                </div>
              )}


              <div>
                خط العرض:{" "}
                {mapLocation.latitude}
              </div>


              <div>
                خط الطول:{" "}
                {mapLocation.longitude}
              </div>


              {mapLocation.boundary
                ?.length >= 3 && (
                <div>
                  🗺️ حدود الأرض:{" "}
                  {
                    mapLocation.boundary.length
                  }{" "}
                  نقطة
                </div>
              )}


              {mapLocation.area !==
                undefined &&
                mapLocation.area !==
                  null && (
                  <div>
                    📐 المساحة:{" "}
                    {mapLocation.area}
                  </div>
                )}


              {mapLocation.perimeter !==
                undefined &&
                mapLocation.perimeter !==
                  null && (
                  <div>
                    📏 المحيط:{" "}
                    {mapLocation.perimeter}
                  </div>
                )}


              <div style={truthNote}>
                الموقع الجغرافي يعتمد على
                الإحداثيات والحدود المحفوظة
                من الخريطة.
              </div>


              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
                style={
                  secondaryButton
                }
              >
                🗺️ عرض / تعديل الموقع
              </button>


              <button
                type="button"
                onClick={
                  refreshMapLocation
                }
                style={
                  secondaryButton
                }
              >
                🔄 تحديث الموقع
              </button>

            </div>
          ) : (
            <div style={missingLocationBox}>

              <strong>
                ⚠️ لم يتم تحديد موقع
                لهذه المزرعة
              </strong>

              <p>
                يجب تحديد موقع الأرض قبل
                حساب المناخ والتوصيات
                الزراعية.
              </p>

              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
                style={
                  secondaryButton
                }
              >
                🗺️ تحديد موقع الأرض
              </button>

            </div>
          )}

        </section>


        {/* =================================================
            3. CLIMATE + RECOMMENDATIONS
        ================================================= */}

        {hasCoordinates(
          mapLocation
        ) && (
          <section
            style={
              recommendationStyle
            }
          >

            <h2 style={sectionTitle}>
              3. المناخ والتوصية
            </h2>


            <p>
              🌤️ مناخ الموقع:{" "}
              <strong>
                {climate ||
                  "غير محدد"}
              </strong>
            </p>


            {recommendedSeeds.length >
            0 ? (
              <>
                <strong>
                  🌱 محاصيل مناسبة مبدئيًا
                  للموقع:
                </strong>

                <div
                  style={tagsStyle}
                >
                  {recommendedSeeds.map(
                    seed => (
                      <span
                        key={seed}
                        style={tagStyle}
                      >
                        {seed}
                      </span>
                    )
                  )}
                </div>
              </>
            ) : (
              <p>
                لا توجد توصية كافية
                حتى الآن.
              </p>
            )}


            <small>
              التوصية تعتمد على إحداثيات
              الأرض وحدودها المحفوظة،
              وليست على اسم القرية أو
              المحافظة.
            </small>

          </section>
        )}


        {/* =================================================
            4. CROP
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            4. المحصول
          </h2>


          <input
            name="name"
            value={form.name}
            onChange={change}
            placeholder="🌾 ماذا زرعت؟"
            style={inputStyle}
          />


          <input
            name="seedType"
            value={form.seedType}
            onChange={change}
            placeholder="🌱 نوع البذور"
            style={inputStyle}
          />


          <input
            name="seedVariety"
            value={
              form.seedVariety
            }
            onChange={change}
            placeholder="🔖 صنف البذور"
            style={inputStyle}
          />


          <input
            name="seedQuality"
            value={
              form.seedQuality
            }
            onChange={change}
            placeholder="⭐ جودة البذور"
            style={inputStyle}
          />


          <input
            name="seedQuantity"
            type="number"
            min="0"
            value={
              form.seedQuantity
            }
            onChange={change}
            placeholder="⚖️ كمية البذور بالكيلوغرام"
            style={inputStyle}
          />
        </section>


        {/* =================================================
            5. PLANTING
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            5. تاريخ الزراعة والعمر
          </h2>


          <input
            name="plantingDate"
            type="date"
            value={
              form.plantingDate
            }
            onChange={change}
            style={inputStyle}
          />


          {plantAge && (
            <div style={ageBox}>
              🌿 عمر النبات:{" "}
              <strong>
                {plantAge}
              </strong>
            </div>
          )}
        </section>


        {/* =================================================
            6. FERTILIZER + HARVEST
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            6. السماد والحصاد
          </h2>


          <input
            name="fertilizerType"
            value={
              form.fertilizerType
            }
            onChange={change}
            placeholder="🧪 نوع السماد"
            style={inputStyle}
          />


          <input
            name="fertilizerQuantity"
            type="number"
            min="0"
            value={
              form.fertilizerQuantity
            }
            onChange={change}
            placeholder="⚖️ كمية السماد بالكيلوغرام"
            style={inputStyle}
          />


          <input
            name="harvestDate"
            type="date"
            value={
              form.harvestDate
            }
            onChange={change}
            style={inputStyle}
          />


          <input
            name="expectedProduction"
            type="number"
            min="0"
            value={
              form.expectedProduction
            }
            onChange={change}
            placeholder="📦 الإنتاج المتوقع بالكيلوغرام"
            style={inputStyle}
          />
        </section>


        {/* =================================================
            7. NOTES
        ================================================= */}

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            7. ملاحظات
          </h2>


          <textarea
            name="notes"
            value={form.notes}
            onChange={change}
            placeholder="📝 ملاحظات"
            style={{
              ...inputStyle,
              minHeight: 80,
              resize: "vertical",
            }}
          />
        </section>


        {/* =================================================
            SAVE
        ================================================= */}

        <button
          type="submit"
          disabled={
            loading ||
            farmsLoading ||
            !selectedFarm ||
            !hasCoordinates(
              mapLocation
            )
          }
          style={{
            ...saveButton,
            opacity:
              loading ||
              farmsLoading ||
              !selectedFarm ||
              !hasCoordinates(
                mapLocation
              )
                ? 0.55
                : 1,
          }}
        >
          {loading
            ? "جاري الحفظ..."
            : "💾 حفظ المحصول"}
        </button>

      </form>


      {/* ===================================================
          REGISTERED CROPS
      =================================================== */}

      <section>
        <h2 style={sectionTitle}>
          🌾 المحاصيل المسجلة
        </h2>


        {crops.length === 0 && (
          <p style={mutedStyle}>
            لا توجد محاصيل مسجلة بعد.
          </p>
        )}


        {crops.map(crop => {

          const farm =
            farms.find(
              item =>
                String(
                  getFarmId(item)
                ) ===
                String(
                  crop.farmId
                )
            );


          return (
            <article
              key={
                crop.id ??
                `${crop.farmId}-${crop.name}`
              }
              style={cropCard}
            >

              <strong>
                🌱{" "}
                {crop.name ||
                  crop.treeType ||
                  "محصول"}
              </strong>


              <div>
                🏡 المزرعة:{" "}
                {farm
                  ? getFarmName(farm)
                  : "غير معروفة"}
              </div>


              {crop.seedType && (
                <div>
                  🌾 البذور:{" "}
                  {crop.seedType}
                </div>
              )}


              {crop.seedVariety && (
                <div>
                  🔖 الصنف:{" "}
                  {crop.seedVariety}
                </div>
              )}


              {crop.plantingDate && (
                <div>
                  📅 الزراعة:{" "}
                  {crop.plantingDate}
                </div>
              )}


              {crop.plantingDate && (
                <div>
                  ⏳ العمر:{" "}
                  {calculateAge(
                    crop.plantingDate
                  )}
                </div>
              )}


              {crop.climate && (
                <div>
                  🌤️ المناخ:{" "}
                  {crop.climate}
                </div>
              )}


              {hasCoordinates({
                latitude:
                  crop.latitude,

                longitude:
                  crop.longitude,
              }) && (
                <div>
                  📍 موقع الأرض محفوظ
                </div>
              )}


              <button
                type="button"
                onClick={() =>
                  deleteCrop(crop.id)
                }
                style={
                  deleteButton
                }
              >
                🗑️ حذف
              </button>

            </article>
          );
        })}

      </section>

    </main>
  );
}


// =========================================================
// STYLES
// =========================================================

const pageStyle = {
  maxWidth: 720,
  margin: "0 auto",
  padding: 10,
  boxSizing: "border-box",
};


const cardStyle = {
  padding: 10,
  marginBottom: 8,
  borderRadius: 10,
  background: "#ffffff",
  boxShadow:
    "0 2px 8px rgba(0,0,0,.06)",
};


const sectionTitle = {
  margin: "0 0 8px",
  fontSize: 17,
};


const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 10px",
  marginBottom: 7,
  border: "1px solid #ccd5ce",
  borderRadius: 8,
  fontSize: 15,
  background: "#fff",
};


const messageStyle = {
  padding: 9,
  marginBottom: 8,
  borderRadius: 8,
  background: "#fff3cd",
};


const mutedStyle = {
  color: "#66736a",
  fontSize: 13,
};


const farmInfoStyle = {
  marginTop: 8,
  padding: 8,
  borderRadius: 8,
  background: "#f4f8f5",
  fontSize: 13,
};


const secondaryButton = {
  width: "100%",
  padding: "10px",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 8,
  fontSize: 15,
};


const locationBox = {
  marginTop: 8,
  padding: 10,
  borderRadius: 8,
  background: "#eef8ef",
  lineHeight: 1.8,
  fontSize: 13,
};


const missingLocationBox = {
  marginTop: 8,
  padding: 10,
  borderRadius: 8,
  background: "#fff8e6",
  lineHeight: 1.7,
  fontSize: 13,
};


const loadingBox = {
  marginTop: 8,
  padding: 10,
  borderRadius: 8,
  background: "#f4f8f5",
  fontSize: 13,
};


const locationDescription = {
  marginTop: 4,
  fontSize: 12,
  color: "#66736a",
};


const truthNote = {
  marginTop: 7,
  padding: 7,
  borderRadius: 7,
  background: "#ffffff",
  fontSize: 12,
};


const recommendationStyle = {
  padding: 10,
  marginBottom: 8,
  borderRadius: 10,
  background: "#eef8ef",
};


const tagsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 5,
  margin: "8px 0",
};


const tagStyle = {
  padding: "5px 8px",
  borderRadius: 15,
  background: "#ffffff",
  fontSize: 13,
};


const ageBox = {
  padding: 8,
  borderRadius: 8,
  background: "#eef8ef",
  fontSize: 14,
};


const saveButton = {
  width: "100%",
  padding: "11px",
  marginBottom: 14,
  border: 0,
  borderRadius: 9,
  cursor: "pointer",
  fontSize: 16,
};


const cropCard = {
  padding: 9,
  marginBottom: 7,
  borderRadius: 9,
  background: "#f5f5f5",
  lineHeight: 1.8,
  fontSize: 14,
};


const deleteButton = {
  marginTop: 6,
  padding: "6px 9px",
  border: 0,
  borderRadius: 7,
  cursor: "pointer",
};
