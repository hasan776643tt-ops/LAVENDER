// src/pages/Crops.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import mapService from "../services/mapService.js";
import cropService from "../services/cropService.js";

const EMPTY = {
  farmId: "",
  // يبقى داخليًا للتوافق مع البيانات والخدمة.
  // لا يظهر للمستخدم.
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
};


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


function getLocationFarmId(location) {
  return (
    location?.farmId ??
    location?.farm?.id ??
    location?.farm?._id ??
    location?.farm?.farmId ??
    ""
  );
}


function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function normalizeLocation(location = {}) {
  const points =
    Array.isArray(location.points)
      ? location.points
      : [];

  const boundary =
    Array.isArray(location.boundary)
      ? location.boundary
      : points;

  const latitude =
    location.latitude ??
    location.lat ??
    points[0]?.latitude ??
    points[0]?.lat ??
    "";

  const longitude =
    location.longitude ??
    location.lng ??
    points[0]?.longitude ??
    points[0]?.lng ??
    "";

  return {
    ...location,
    latitude,
    longitude,
    boundary,
    points,
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


function calculateAge(date) {
  if (!date) {
    return "";
  }

  const start = new Date(date);
  const now = new Date();

  if (Number.isNaN(start.getTime())) {
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
    useState(EMPTY);

  const [message, setMessage] =
    useState("");

  const [locations, setLocations] =
    useState([]);

  const [locationsLoading, setLocationsLoading] =
    useState(false);

  const [locationsError, setLocationsError] =
    useState("");


  // =======================================================
  // LOAD LOCATIONS
  // =======================================================

  const loadMapLocations =
    useCallback(async () => {
      try {
        setLocationsLoading(true);
        setLocationsError("");

        const data =
          await mapService.getAllLocations();

        const safe =
          Array.isArray(data)
            ? data
            : [];

        setLocations(safe);

        return safe;
      } catch (err) {
        console.error(
          "Crops map locations loading failed:",
          err
        );

        setLocations([]);

        setLocationsError(
          "تعذر تحميل مواقع الخريطة."
        );

        return [];
      } finally {
        setLocationsLoading(false);
      }
    }, []);


  // =======================================================
  // LOAD CROPS
  // =======================================================

  useEffect(() => {
    loadCrops().catch(() => {});
  }, [loadCrops]);


  useEffect(() => {
    loadMapLocations();
  }, [loadMapLocations]);


  // =======================================================
  // REFRESH WHEN RETURNING FROM MAP
  // =======================================================

  useEffect(() => {
    const refresh = () => {
      loadMapLocations();
    };

    window.addEventListener(
      "focus",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    return () => {
      window.removeEventListener(
        "focus",
        refresh
      );

      window.removeEventListener(
        "pageshow",
        refresh
      );
    };
  }, [loadMapLocations]);


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

    setForm(current => ({
      ...current,
      farmId: farmIdFromUrl,
    }));
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
  // FARM LOCATION
  //
  // farmId is the ONLY relationship key.
  // =======================================================

  const mapLocation =
    useMemo(() => {
      if (!form.farmId) {
        return null;
      }

      const farmLocations =
        locations
          .map(normalizeLocation)
          .filter(location => {
            const locationFarmId =
              getLocationFarmId(
                location
              );

            return (
              String(locationFarmId) ===
              String(form.farmId)
            );
          })
          .filter(hasCoordinates);

      if (
        farmLocations.length === 0
      ) {
        return null;
      }

      const mapLocations =
        farmLocations.filter(
          location =>
            String(
              location.source || ""
            ).toLowerCase() ===
            "map"
        );

      const candidates =
        mapLocations.length > 0
          ? mapLocations
          : farmLocations;

      return (
        candidates[
          candidates.length - 1
        ] || null
      );
    }, [
      locations,
      form.farmId,
    ]);


  // =======================================================
  // LOCATION FOR RECOMMENDATION
  // =======================================================

  const locationForRecommendation =
    useMemo(() => {
      if (!mapLocation) {
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

      return cropService.getSmartRecommendations(
        locationForRecommendation
      );
    }, [
      locationForRecommendation,
    ]);


  const climate =
    smartRecommendations?.climate ||
    "";


  const recommendedSeeds =
    smartRecommendations?.crops
      ?.map(crop => crop.name) ||
    [];


  // =======================================================
  // PLANT AGE
  // =======================================================

  const plantAge =
    calculateAge(
      form.plantingDate
    );


  // =======================================================
  // CHANGE
  // =======================================================

  const change = event => {
    const {
      name,
      value,
    } = event.target;

    setMessage("");

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

      if (!form.farmId) {
        setMessage(
          "اختر المزرعة أولًا."
        );

        return;
      }

      const data =
        await loadMapLocations();

      const exists =
        data
          .map(normalizeLocation)
          .some(location => {
            const locationFarmId =
              getLocationFarmId(
                location
              );

            return (
              String(locationFarmId) ===
                String(form.farmId) &&
              hasCoordinates(location)
            );
          });

      setMessage(
        exists
          ? "تم تحديث موقع الأرض من الخريطة."
          : "لا يوجد موقع محفوظ لهذه المزرعة."
      );
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


      /*
       * نعيد قراءة المواقع قبل الحفظ
       * للتأكد من استخدام أحدث Location.
       */

      const freshLocations =
        await loadMapLocations();


      const normalizedLocations =
        freshLocations.map(
          normalizeLocation
        );


      const farmLocations =
        normalizedLocations
          .filter(location => {
            const locationFarmId =
              getLocationFarmId(
                location
              );

            return (
              String(locationFarmId) ===
              String(form.farmId)
            );
          })
          .filter(hasCoordinates);


      const mapLocations =
        farmLocations.filter(
          location =>
            String(
              location.source || ""
            ).toLowerCase() ===
            "map"
        );


      const freshLocation =
        (
          mapLocations.length > 0
            ? mapLocations
            : farmLocations
        ).at(-1) || null;


      if (!freshLocation) {
        setMessage(
          "لم يتم العثور على موقع أرض محفوظ لهذه المزرعة. افتح الخريطة وحدد الأرض ثم احفظ الموقع."
        );

        return;
      }


      const location =
        normalizeLocation(
          freshLocation
        );


      if (!hasCoordinates(location)) {
        setMessage(
          "بيانات موقع الأرض غير صالحة."
        );

        return;
      }


      /*
       * لا نحذف cultivationType من البيانات
       * للحفاظ على توافق الخدمة والبيانات القديمة.
       *
       * لكنه لم يعد خيارًا ظاهرًا للمستخدم.
       *
       * القيمة الداخلية الافتراضية:
       * field
       */

      const recommendations =
        cropService.getSmartRecommendations(
          location
        );


      const cropName =
        String(
          form.name || ""
        ).trim();


      const treeType =
        String(
          form.treeType || ""
        ).trim();


      /*
       * في الواجهة الجديدة لا يوجد اختيار
       * لنوع الأرض.
       *
       * لذلك يتم التعامل مع التسجيل
       * كمحصول عادي.
       *
       * cultivationType يبقى field
       * للتوافق الداخلي.
       */

      if (!cropName) {
        setMessage(
          "يرجى كتابة ماذا زرعت."
        );

        return;
      }


      try {
        await addCrop({
          ...form,

          farmId:
            getFarmId(
              selectedFarm
            ) || form.farmId,

          cultivationType:
            "field",

          name:
            cropName,

          treeType,

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
            Number(
              location.latitude
            ),

          longitude:
            Number(
              location.longitude
            ),

          boundary:
            Array.isArray(
              location.boundary
            )
              ? location.boundary
              : [],

          climate:
            recommendations?.climate ||
            "",

          recommendedSeeds:
            recommendations?.crops
              ?.map(crop => crop.name) ||
            [],
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
        });
      } catch (err) {
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


      {locationsError && (
        <div style={messageStyle}>
          {locationsError}
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
                  value={id}
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
          ) : hasCoordinates(
              mapLocation
            ) ? (
            <div style={locationBox}>

              <strong>
                📍 تم تحديد موقع الأرض
              </strong>

              <div>
                خط العرض:{" "}
                {mapLocation.latitude}
              </div>

              <div>
                خط الطول:{" "}
                {mapLocation.longitude}
              </div>

              {mapLocation.boundary
                ?.length > 0 && (
                <div>
                  حدود الأرض:{" "}
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


          {locationsLoading && (
            <p style={mutedStyle}>
              جاري تحديث مواقع الخريطة...
            </p>
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
              الأرض المحفوظة من الخريطة،
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
            !form.farmId ||
            !hasCoordinates(
              mapLocation
            )
          }
          style={saveButton}
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
              key={crop.id}
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
                {getFarmName(farm)}
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
