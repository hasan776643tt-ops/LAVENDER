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
//
// Farm
//   ↓ farmId
// Location
//   ↓
// coordinates / boundary
//   ↓
// climate / recommendations
//   ↓
// Crop
//
// الإحداثيات لا تعرض للمستخدم.
// الموقع الإداري يعرض:
// - المحافظة
// - البلدة / الناحية
// - القرية
//
// اسم المحصول إدخال يدوي حر.
// =========================================================


// =========================================================
// EMPTY
// =========================================================

const EMPTY = {

  farmId: "",

  cultivationType:
    "field",

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

  latitude: null,

  longitude: null,

  boundary: [],

  climate: "",

  recommendedSeeds: [],

  notes: "",

};


// =========================================================
// TYPES
// =========================================================

const TYPES = [

  {
    value: "trees",
    label: "أشجار",
  },

  {
    value: "field",
    label: "محاصيل حقلية",
  },

  {
    value: "vegetables",
    label: "خضروات",
  },

  {
    value: "other",
    label: "أخرى",
  },

];


// =========================================================
// UI STYLES
// =========================================================
//
// هذه التنسيقات خاصة بصفحة المحاصيل فقط.
// الهدف:
// - حقول أكبر وأسهل للمس
// - كلمات أوضح وأكبر
// - labels بارزة
// - مسافات مناسبة للموبايل
// - الحفاظ على منطق الصفحة كما هو
//
// =========================================================

const PAGE_STYLE = {

  maxWidth:
    "900px",

  margin:
    "0 auto",

  padding:
    "20px 16px 40px",

};


const PAGE_TITLE_STYLE = {

  margin:
    "0 0 8px",

  fontSize:
    "30px",

  lineHeight:
    "1.3",

  fontWeight:
    "800",

};


const PAGE_DESCRIPTION_STYLE = {

  margin:
    "0 0 24px",

  fontSize:
    "17px",

  lineHeight:
    "1.7",

};


const SECTION_STYLE = {

  marginTop:
    "24px",

  padding:
    "18px",

  borderRadius:
    "16px",

  border:
    "1px solid #e2e8e2",

  background:
    "#ffffff",

  boxSizing:
    "border-box",

};


const SECTION_TITLE_STYLE = {

  margin:
    "0 0 18px",

  fontSize:
    "22px",

  lineHeight:
    "1.4",

  fontWeight:
    "800",

};


const LABEL_STYLE = {

  display:
    "block",

  margin:
    "16px 0 8px",

  fontSize:
    "18px",

  lineHeight:
    "1.5",

  fontWeight:
    "700",

};


const FIELD_STYLE = {

  display:
    "block",

  width:
    "100%",

  minHeight:
    "52px",

  boxSizing:
    "border-box",

  padding:
    "12px 14px",

  margin:
    "0 0 6px",

  border:
    "1px solid #cbd5cb",

  borderRadius:
    "12px",

  background:
    "#ffffff",

  fontSize:
    "17px",

  lineHeight:
    "1.5",

  fontWeight:
    "500",

  color:
    "#1f2937",

  outline:
    "none",

};


const TEXTAREA_STYLE = {

  ...FIELD_STYLE,

  minHeight:
    "120px",

  resize:
    "vertical",

};


const BUTTON_STYLE = {

  width:
    "100%",

  minHeight:
    "54px",

  boxSizing:
    "border-box",

  padding:
    "13px 16px",

  marginTop:
    "12px",

  border:
    "none",

  borderRadius:
    "13px",

  fontSize:
    "17px",

  lineHeight:
    "1.4",

  fontWeight:
    "800",

  cursor:
    "pointer",

};


const INFO_TEXT_STYLE = {

  fontSize:
    "17px",

  lineHeight:
    "1.7",

};


const MESSAGE_STYLE = {

  marginTop:
    "16px",

  padding:
    "12px 14px",

  borderRadius:
    "12px",

  fontSize:
    "17px",

  lineHeight:
    "1.6",

};


const ARTICLE_STYLE = {

  marginTop:
    "16px",

  padding:
    "18px",

  border:
    "1px solid #ddd",

  borderRadius:
    "16px",

  background:
    "#ffffff",

  boxSizing:
    "border-box",

};


const ARTICLE_TITLE_STYLE = {

  margin:
    "0 0 14px",

  fontSize:
    "21px",

  lineHeight:
    "1.4",

  fontWeight:
    "800",

};


// =========================================================
// HELPERS
// =========================================================

function getFarmId(
  farm
) {

  return String(
    farm?.id ??
    ""
  );

}


function getFarmName(
  farm
) {

  return String(
    farm?.name ??
    ""
  ).trim();

}


function getNumber(
  value
) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const number =
    Number(value);


  return Number.isFinite(number)
    ? number
    : null;
}


function normalizePoints(
  points
) {

  if (!Array.isArray(points)) {
    return [];
  }


  return points
    .map(point => {

      if (Array.isArray(point)) {

        return {

          latitude:
            getNumber(
              point[0]
            ),

          longitude:
            getNumber(
              point[1]
            ),

        };
      }


      return {

        latitude:
          getNumber(
            point?.latitude ??
            point?.lat
          ),

        longitude:
          getNumber(
            point?.longitude ??
            point?.lng ??
            point?.lon
          ),

      };

    })
    .filter(
      point =>
        Number.isFinite(
          point.latitude
        ) &&
        Number.isFinite(
          point.longitude
        )
    );
}


function normalizeLocation(
  location
) {

  if (
    !location ||
    typeof location !== "object"
  ) {
    return null;
  }


  const points =
    normalizePoints(
      location.points ??
      location.boundary ??
      []
    );


  const latitude =
    getNumber(
      location.latitude
    );


  const longitude =
    getNumber(
      location.longitude
    );


  return {

    ...location,

    latitude,

    longitude,

    points,

    boundary:
      points,

    country:
      String(
        location.country ??
        ""
      ).trim(),

    governorate:
      String(
        location.governorate ??
        location.state ??
        location.province ??
        ""
      ).trim(),

    region:
      String(
        location.region ??
        ""
      ).trim(),

    district:
      String(
        location.district ??
        location.county ??
        location.municipality ??
        ""
      ).trim(),

    city:
      String(
        location.city ??
        ""
      ).trim(),

    town:
      String(
        location.town ??
        ""
      ).trim(),

    village:
      String(
        location.village ??
        location.hamlet ??
        ""
      ).trim(),

    placeName:
      String(
        location.placeName ??
        location.name ??
        ""
      ).trim(),

    locationDescription:
      String(
        location.locationDescription ??
        location.displayName ??
        ""
      ).trim(),

  };
}


function hasCoordinates(
  location
) {

  return (
    Number.isFinite(
      getNumber(
        location?.latitude
      )
    ) &&
    Number.isFinite(
      getNumber(
        location?.longitude
      )
    )
  );
}


function getAdministrativeValue(
  location,
  keys
) {

  for (
    const key of keys
  ) {

    const value =
      String(
        location?.[key] ??
        ""
      ).trim();


    if (value) {
      return value;
    }
  }


  return "";
}


function getGovernorate(
  location
) {

  return getAdministrativeValue(
    location,
    [
      "governorate",
      "state",
      "province",
    ]
  );
}


function getTown(
  location
) {

  return getAdministrativeValue(
    location,
    [
      "town",
      "city",
      "district",
      "municipality",
      "county",
    ]
  );
}


function getVillage(
  location
) {

  return getAdministrativeValue(
    location,
    [
      "village",
      "hamlet",
    ]
  );
}


function calculateAge(
  date
) {

  if (!date) {
    return "";
  }


  const planted =
    new Date(date);


  if (
    Number.isNaN(
      planted.getTime()
    )
  ) {
    return "";
  }


  const today =
    new Date();


  if (
    planted > today
  ) {
    return "0 يوم";
  }


  let years =
    today.getFullYear() -
    planted.getFullYear();


  let months =
    today.getMonth() -
    planted.getMonth();


  let days =
    today.getDate() -
    planted.getDate();


  if (days < 0) {

    months -= 1;


    const previousMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
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

    return `${years} سنة${months ? ` و${months} شهر` : ""}`;

  }


  if (months > 0) {

    return `${months} شهر${days ? ` و${days} يوم` : ""}`;

  }


  return `${Math.max(
    0,
    days
  )} يوم`;

}


// =========================================================
// COMPONENT
// =========================================================

export default function Crops() {

  const {
    farms,
    loading: farmsLoading,
  } = useFarms();


  const {
    crops,
    loading: cropsLoading,
    error: cropsError,
    addCrop,
    deleteCrop,
  } = useCrops();


  const [
    form,
    setForm,
  ] = useState(
    {
      ...EMPTY,
    }
  );


  const [
    mapLocation,
    setMapLocation,
  ] = useState(null);


  const [
    locationLoading,
    setLocationLoading,
  ] = useState(false);


  const [
    locationMessage,
    setLocationMessage,
  ] = useState("");


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  // =======================================================
  // URL FARM
  // =======================================================

  const farmIdFromUrl =
    useMemo(
      () => {

        try {

          return new URLSearchParams(
            window.location.search
          ).get("farmId") || "";

        } catch {

          return "";

        }

      },
      []
    );


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            String(
              farm?.id
            ) ===
            String(
              form.farmId
            )
        ) || null,
      [
        farms,
        form.farmId,
      ]
    );


  // =======================================================
  // SET FARM FROM URL
  // =======================================================

  useEffect(() => {

    if (
      !farmIdFromUrl
    ) {
      return;
    }


    const exists =
      farms.some(
        farm =>
          String(
            farm?.id
          ) ===
          String(
            farmIdFromUrl
          )
      );


    if (!exists) {
      return;
    }


    setForm(
      current => ({

        ...current,

        farmId:
          farmIdFromUrl,

      })
    );

  }, [
    farmIdFromUrl,
    farms,
  ]);


  // =======================================================
  // LOAD FARM LOCATION
  // =======================================================

  useEffect(() => {

    const id =
      String(
        form.farmId ??
        ""
      ).trim();


    if (!id) {

      setMapLocation(null);

      setLocationMessage("");

      return;

    }


    let active = true;


    async function loadLocation() {

      try {

        setLocationLoading(true);

        setLocationMessage("");


        const location =
          await mapService.getLocationByFarmId(
            id
          );


        if (!active) {
          return;
        }


        const normalized =
          normalizeLocation(
            location
          );


        if (
          normalized &&
          hasCoordinates(
            normalized
          )
        ) {

          setMapLocation(
            normalized
          );


          setForm(
            current => ({

              ...current,

              latitude:
                normalized.latitude,

              longitude:
                normalized.longitude,

              boundary:
                normalized.boundary,

            })
          );


          setLocationMessage("");

        } else {

          setMapLocation(null);

          setForm(
            current => ({

              ...current,

              latitude: null,

              longitude: null,

              boundary: [],

            })
          );


          setLocationMessage(
            "⚠️ لم يتم تحديد موقع لهذه المزرعة"
          );
        }

      } catch (loadError) {

        console.error(
          "Crop farm location loading failed:",
          loadError
        );


        if (active) {

          setMapLocation(null);


          setLocationMessage(
            "تعذر تحميل موقع هذه المزرعة."
          );

        }

      } finally {

        if (active) {
          setLocationLoading(false);
        }

      }

    }


    loadLocation();


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
    useMemo(
      () => {

        if (
          !mapLocation ||
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
            mapLocation.boundary,

          points:
            mapLocation.points,

        };

      },
      [
        mapLocation,
      ]
    );


  // =======================================================
  // SMART RECOMMENDATIONS
  // =======================================================

  const smartRecommendations =
    useMemo(
      () => {

        if (
          !locationForRecommendation
        ) {
          return null;
        }


        try {

          return cropService.getSmartRecommendations(
            locationForRecommendation
          );

        } catch {

          return null;

        }

      },
      [
        locationForRecommendation,
      ]
    );


  // =======================================================
  // ADMINISTRATIVE LOCATION
  // =======================================================

  const governorate =
    getGovernorate(
      mapLocation
    );


  const town =
    getTown(
      mapLocation
    );


  const village =
    getVillage(
      mapLocation
    );


  // =======================================================
  // CHANGE
  // =======================================================

  function change(
    event
  ) {

    const {
      name,
      value,
    } =
      event.target;


    if (
      name === "farmId"
    ) {

      setMapLocation(null);

      setLocationMessage("");

      setForm(
        current => ({

          ...current,

          farmId:
            value,

          latitude:
            null,

          longitude:
            null,

          boundary: [],

        })
      );


      setMessage("");
      setError("");

      return;
    }


    setForm(
      current => ({

        ...current,

        [name]:
          value,

      })
    );


    setMessage("");
    setError("");

  }


  // =======================================================
  // MAP
  // =======================================================

  function chooseMapLocation() {

    if (
      !form.farmId
    ) {

      setError(
        "اختر المزرعة أولًا."
      );


      return;
    }


    window.location.href =
      `/map?return=crops&farmId=${encodeURIComponent(
        form.farmId
      )}`;

  }


  // =======================================================
  // REFRESH LOCATION
  // =======================================================

  async function refreshMapLocation() {

    if (
      !form.farmId
    ) {
      return;
    }


    try {

      setLocationLoading(true);

      setLocationMessage("");


      const location =
        await mapService.getLocationByFarmId(
          form.farmId
        );


      const normalized =
        normalizeLocation(
          location
        );


      if (
        normalized &&
        hasCoordinates(
          normalized
        )
      ) {

        setMapLocation(
          normalized
        );


        setForm(
          current => ({

            ...current,

            latitude:
              normalized.latitude,

            longitude:
              normalized.longitude,

            boundary:
              normalized.boundary,

          })
        );

      } else {

        setMapLocation(null);

        setLocationMessage(
          "لم يتم العثور على موقع محفوظ لهذه المزرعة."
        );

      }

    } catch (refreshError) {

      console.error(
        "Location refresh failed:",
        refreshError
      );


      setMapLocation(null);


      setLocationMessage(
        "تعذر تحميل موقع المزرعة."
      );

    } finally {

      setLocationLoading(false);

    }

  }


  // =======================================================
  // SAVE
  // =======================================================

  async function save(
    event
  ) {

    event.preventDefault();


    setMessage("");
    setError("");


    if (
      !form.farmId
    ) {

      setError(
        "يجب اختيار المزرعة."
      );


      return;
    }


    if (
      !form.name.trim()
    ) {

      setError(
        "اكتب اسم المحصول."
      );


      return;
    }


    if (
      !form.plantingDate
    ) {

      setError(
        "حدد تاريخ الزراعة."
      );


      return;
    }


    setSaving(true);


    try {

      const freshLocation =
        normalizeLocation(
          await mapService.getLocationByFarmId(
            form.farmId
          )
        );


      if (
        !freshLocation ||
        !hasCoordinates(
          freshLocation
        )
      ) {

        setError(
          "يجب تحديد موقع الأرض على الخريطة قبل حفظ المحصول."
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
              freshLocation.boundary,

            points:
              freshLocation.points,

          }
        );


      const saved =
        await addCrop({

          ...form,

          farmId:
            String(
              form.farmId
            ),

          name:
            form.name.trim(),

          latitude:
            freshLocation.latitude,

          longitude:
            freshLocation.longitude,

          boundary:
            freshLocation.boundary,

          points:
            freshLocation.points,

          country:
            freshLocation.country,

          governorate:
            getGovernorate(
              freshLocation
            ),

          region:
            freshLocation.region,

          district:
            freshLocation.district,

          city:
            freshLocation.city,

          town:
            getTown(
              freshLocation
            ),

          village:
            getVillage(
              freshLocation
            ),

          placeName:
            freshLocation.placeName,

          locationDescription:
            freshLocation.locationDescription,

          climate:
            recommendations?.climate ??
            recommendations?.climateName ??
            "",

          recommendedSeeds:
            Array.isArray(
              recommendations?.recommendedSeeds
            )
              ? recommendations.recommendedSeeds
              : [],

        });


      if (!saved) {

        throw new Error(
          "CROP_SAVE_FAILED"
        );
      }


      setMapLocation(
        freshLocation
      );


      setMessage(
        "✅ تم حفظ المحصول بنجاح."
      );


      setForm(
        current => ({

          ...EMPTY,

          farmId:
            current.farmId,

        })
      );

    } catch (saveError) {

      console.error(
        "Crop save failed:",
        saveError
      );


      setError(
        saveError?.message ||
        "تعذر حفظ المحصول."
      );

    } finally {

      setSaving(false);

    }

  }


  // =======================================================
  // AGE
  // =======================================================

  const plantAge =
    calculateAge(
      form.plantingDate
    );


  // =======================================================
  // LOADING
  // =======================================================

  const pageLoading =
    farmsLoading ||
    cropsLoading;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <main
      style={{
        ...PAGE_STYLE,
      }}
    >

      <h1
        style={
          PAGE_TITLE_STYLE
        }
      >
        🌱 المحاصيل
      </h1>


      <p
        style={
          PAGE_DESCRIPTION_STYLE
        }
      >
        تسجيل وإدارة المحاصيل المرتبطة بالمزرعة وموقع الأرض.
      </p>


      {pageLoading && (

        <p
          style={
            INFO_TEXT_STYLE
          }
        >
          ⏳ جارٍ تحميل البيانات...
        </p>

      )}


      {cropsError && (

        <p
          style={{
            ...MESSAGE_STYLE,
            color: "crimson",
            background: "#fff1f1",
          }}
        >
          ⚠️ {cropsError}
        </p>

      )}


      {/* ================================================= */}
      {/* FARM */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          1. المزرعة
        </h2>


        <label
          htmlFor="crop-farm"
          style={
            LABEL_STYLE
          }
        >
          🏡 اختر المزرعة
        </label>


        <select
          id="crop-farm"
          name="farmId"
          value={form.farmId}
          onChange={change}
          disabled={farmsLoading}
          style={
            FIELD_STYLE
          }
        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(
            farm => (

              <option
                key={getFarmId(farm)}
                value={getFarmId(farm)}
              >
                {getFarmName(farm)}
              </option>

            )
          )}

        </select>


        {selectedFarm && (

          <p
            style={
              INFO_TEXT_STYLE
            }
          >
            🏡 المزرعة المختارة:
            {" "}
            <strong>
              {getFarmName(
                selectedFarm
              )}
            </strong>
          </p>

        )}

      </section>


      {/* ================================================= */}
      {/* LOCATION */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          2. موقع المزرعة
        </h2>


        {!form.farmId && (

          <p
            style={
              INFO_TEXT_STYLE
            }
          >
            اختر المزرعة أولًا لتحميل موقعها.
          </p>

        )}


        {form.farmId &&
          locationLoading && (

            <p
              style={
                INFO_TEXT_STYLE
              }
            >
              ⏳ جارٍ تحميل موقع المزرعة...
            </p>

          )
        }


        {form.farmId &&
          !locationLoading &&
          mapLocation &&
          hasCoordinates(
            mapLocation
          ) && (

            <div>

              <p
                style={
                  INFO_TEXT_STYLE
                }
              >
                📍 موقع الأرض محفوظ
              </p>


              {governorate && (

                <p
                  style={
                    INFO_TEXT_STYLE
                  }
                >
                  🏛️ المحافظة:
                  {" "}
                  <strong>
                    {governorate}
                  </strong>
                </p>

              )}


              {town && (

                <p
                  style={
                    INFO_TEXT_STYLE
                  }
                >
                  🏘️ البلدة / الناحية:
                  {" "}
                  <strong>
                    {town}
                  </strong>
                </p>

              )}


              {village && (

                <p
                  style={
                    INFO_TEXT_STYLE
                  }
                >
                  🌾 القرية:
                  {" "}
                  <strong>
                    {village}
                  </strong>
                </p>

              )}


              {!governorate &&
                !town &&
                !village && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    📍 تم حفظ الموقع، لكن لم تُرجع خدمة الخرائط أسماء إدارية لهذا الموضع.
                  </p>

                )
              }


              {mapLocation.boundary?.length >= 3 && (

                <p
                  style={
                    INFO_TEXT_STYLE
                  }
                >
                  🗺️ حدود الأرض:
                  {" "}
                  {mapLocation.boundary.length}
                  {" "}
                  نقاط
                </p>

              )}


              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
                style={
                  BUTTON_STYLE
                }
              >
                🗺️ تعديل موقع الأرض
              </button>

            </div>

          )
        }


        {form.farmId &&
          !locationLoading &&
          !mapLocation && (

            <div>

              <p
                style={
                  INFO_TEXT_STYLE
                }
              >
                ⚠️ لم يتم تحديد موقع لهذه المزرعة
              </p>


              <p
                style={
                  INFO_TEXT_STYLE
                }
              >
                يجب تحديد موقع الأرض قبل حساب المناخ والتوصيات الزراعية.
              </p>


              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
                style={
                  BUTTON_STYLE
                }
              >
                🗺️ تحديد موقع الأرض
              </button>

            </div>

          )
        }


        {locationMessage && (

          <p
            style={
              INFO_TEXT_STYLE
            }
          >
            {locationMessage}
          </p>

        )}


        {form.farmId && (

          <button
            type="button"
            onClick={
              refreshMapLocation
            }
            disabled={locationLoading}
            style={
              BUTTON_STYLE
            }
          >
            🔄 تحديث موقع المزرعة
          </button>

        )}

      </section>


      {/* ================================================= */}
      {/* CULTIVATION */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          3. نوع الزراعة
        </h2>


        <label
          htmlFor="cultivation-type"
          style={
            LABEL_STYLE
          }
        >
          🌱 اختر نوع الزراعة
        </label>


        <select
          id="cultivation-type"
          name="cultivationType"
          value={
            form.cultivationType
          }
          onChange={change}
          style={
            FIELD_STYLE
          }
        >

          {TYPES.map(
            type => (

              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>

            )
          )}

        </select>

      </section>


      {/* ================================================= */}
      {/* CROP */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          4. المحصول
        </h2>


        <label
          htmlFor="crop-name"
          style={
            LABEL_STYLE
          }
        >
          🌱 اسم المحصول
        </label>


        <input
          id="crop-name"
          type="text"
          name="name"
          value={form.name}
          onChange={change}
          placeholder="اكتب اسم المحصول مهما كان اسمه"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="seed-type"
          style={
            LABEL_STYLE
          }
        >
          🌾 نوع البذور
        </label>


        <input
          id="seed-type"
          type="text"
          name="seedType"
          value={form.seedType}
          onChange={change}
          placeholder="اكتب نوع البذور"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="seed-variety"
          style={
            LABEL_STYLE
          }
        >
          🌿 الصنف
        </label>


        <input
          id="seed-variety"
          type="text"
          name="seedVariety"
          value={form.seedVariety}
          onChange={change}
          placeholder="اكتب الصنف"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="seed-quality"
          style={
            LABEL_STYLE
          }
        >
          ⭐ جودة البذور
        </label>


        <input
          id="seed-quality"
          type="text"
          name="seedQuality"
          value={form.seedQuality}
          onChange={change}
          placeholder="اكتب جودة البذور"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="seed-quantity"
          style={
            LABEL_STYLE
          }
        >
          ⚖️ كمية البذور
        </label>


        <input
          id="seed-quantity"
          type="number"
          name="seedQuantity"
          value={form.seedQuantity}
          onChange={change}
          placeholder="أدخل الكمية"
          style={
            FIELD_STYLE
          }
        />

      </section>


      {/* ================================================= */}
      {/* PLANTING */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          5. تاريخ الزراعة والعمر
        </h2>


        <label
          htmlFor="planting-date"
          style={
            LABEL_STYLE
          }
        >
          📅 تاريخ الزراعة
        </label>


        <input
          id="planting-date"
          type="date"
          name="plantingDate"
          value={
            form.plantingDate
          }
          onChange={change}
          style={
            FIELD_STYLE
          }
        />


        <p
          style={
            INFO_TEXT_STYLE
          }
        >
          ⏳ عمر النبات:
          {" "}
          <strong>
            {plantAge || "يُحسب تلقائيًا"}
          </strong>
        </p>

      </section>


      {/* ================================================= */}
      {/* FERTILIZER / HARVEST */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          6. السماد والحصاد
        </h2>


        <label
          htmlFor="fertilizer-type"
          style={
            LABEL_STYLE
          }
        >
          🧪 سماد الزراعة
        </label>


        <input
          id="fertilizer-type"
          type="text"
          name="fertilizerType"
          value={
            form.fertilizerType
          }
          onChange={change}
          placeholder="اكتب نوع السماد"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="fertilizer-quantity"
          style={
            LABEL_STYLE
          }
        >
          ⚖️ كمية السماد
        </label>


        <input
          id="fertilizer-quantity"
          type="number"
          name="fertilizerQuantity"
          value={
            form.fertilizerQuantity
          }
          onChange={change}
          placeholder="أدخل كمية السماد"
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="harvest-date"
          style={
            LABEL_STYLE
          }
        >
          📅 تاريخ الحصاد
        </label>


        <input
          id="harvest-date"
          type="date"
          name="harvestDate"
          value={
            form.harvestDate
          }
          onChange={change}
          style={
            FIELD_STYLE
          }
        />


        <label
          htmlFor="expected-production"
          style={
            LABEL_STYLE
          }
        >
          📦 الإنتاج المتوقع
        </label>


        <input
          id="expected-production"
          type="number"
          name="expectedProduction"
          value={
            form.expectedProduction
          }
          onChange={change}
          placeholder="أدخل الإنتاج المتوقع"
          style={
            FIELD_STYLE
          }
        />

      </section>


      {/* ================================================= */}
      {/* RECOMMENDATIONS */}
      {/* ================================================= */}

      {mapLocation &&
        smartRecommendations && (

          <section
            style={
              SECTION_STYLE
            }
          >

            <h2
              style={
                SECTION_TITLE_STYLE
              }
            >
              🌱 التوصيات الزراعية
            </h2>


            {(
              smartRecommendations.climate ||
              smartRecommendations.climateName
            ) && (

              <p
                style={
                  INFO_TEXT_STYLE
                }
              >
                🌤️ المناخ:
                {" "}
                <strong>
                  {
                    smartRecommendations.climate ??
                    smartRecommendations.climateName
                  }
                </strong>
              </p>

            )}


            {Array.isArray(
              smartRecommendations.recommendedSeeds
            ) &&
              smartRecommendations.recommendedSeeds.length > 0 && (

                <div>

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🌾 البذور الموصى بها:
                  </p>


                  <ul
                    style={{
                      fontSize:
                        "17px",

                      lineHeight:
                        "1.8",

                      paddingRight:
                        "24px",
                    }}
                  >

                    {smartRecommendations.recommendedSeeds.map(
                      (seed, index) => (

                        <li
                          key={`${seed}-${index}`}
                        >
                          {seed}
                        </li>

                      )
                    )}

                  </ul>

                </div>

              )
            }

          </section>

        )
      }


      {/* ================================================= */}
      {/* NOTES */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          7. ملاحظات
        </h2>


        <label
          htmlFor="crop-notes"
          style={
            LABEL_STYLE
          }
        >
          📝 ملاحظات المحصول
        </label>


        <textarea
          id="crop-notes"
          name="notes"
          value={form.notes}
          onChange={change}
          rows={4}
          placeholder="أضف ملاحظاتك..."
          style={
            TEXTAREA_STYLE
          }
        />

      </section>


      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      {error && (

        <p
          style={{
            ...MESSAGE_STYLE,
            color: "crimson",
            background: "#fff1f1",
          }}
        >
          ❌ {error}
        </p>

      )}


      {message && (

        <p
          style={{
            ...MESSAGE_STYLE,
            color: "green",
            background: "#f0f9f0",
          }}
        >
          {message}
        </p>

      )}


      {/* ================================================= */}
      {/* SAVE */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={save}
        disabled={
          saving ||
          !form.farmId
        }
        style={{
          ...BUTTON_STYLE,
          marginTop:
            "24px",
          minHeight:
            "58px",
          fontSize:
            "18px",
        }}
      >
        {saving
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ المحصول"}
      </button>


      {/* ================================================= */}
      {/* REGISTERED CROPS */}
      {/* ================================================= */}

      <section
        style={
          SECTION_STYLE
        }
      >

        <h2
          style={
            SECTION_TITLE_STYLE
          }
        >
          🌾 المحاصيل المسجلة
        </h2>


        {crops.length === 0 && (

          <p
            style={
              INFO_TEXT_STYLE
            }
          >
            لا توجد محاصيل مسجلة حتى الآن.
          </p>

        )}


        {crops.map(
          crop => {

            const farm =
              farms.find(
                item =>
                  String(
                    item?.id
                  ) ===
                  String(
                    crop?.farmId
                  )
              );


            const cropGovernorate =
              getGovernorate(
                crop
              );


            const cropTown =
              getTown(
                crop
              );


            const cropVillage =
              getVillage(
                crop
              );


            return (

              <article
                key={
                  crop.id ||
                  `${crop.farmId}-${crop.name}`
                }
                style={
                  ARTICLE_STYLE
                }
              >

                <h3
                  style={
                    ARTICLE_TITLE_STYLE
                  }
                >
                  🌱 {crop.name}
                </h3>


                <p
                  style={
                    INFO_TEXT_STYLE
                  }
                >
                  🏡 المزرعة:
                  {" "}
                  {
                    getFarmName(
                      farm
                    ) ||
                    crop.farmId
                  }
                </p>


                {crop.seedType && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🌾 البذور:
                    {" "}
                    {crop.seedType}
                  </p>

                )}


                {crop.seedVariety && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🌱 الصنف:
                    {" "}
                    {crop.seedVariety}
                  </p>

                )}


                {crop.plantingDate && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    📅 الزراعة:
                    {" "}
                    {crop.plantingDate}
                  </p>

                )}


                {crop.plantingDate && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    ⏳ العمر:
                    {" "}
                    {calculateAge(
                      crop.plantingDate
                    )}
                  </p>

                )}


                {crop.climate && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🌤️ المناخ:
                    {" "}
                    {crop.climate}
                  </p>

                )}


                {cropGovernorate && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🏛️ المحافظة:
                    {" "}
                    {cropGovernorate}
                  </p>

                )}


                {cropTown && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🏘️ البلدة / الناحية:
                    {" "}
                    {cropTown}
                  </p>

                )}


                {cropVillage && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    🌾 القرية:
                    {" "}
                    {cropVillage}
                  </p>

                )}


                {hasCoordinates(
                  crop
                ) && (

                  <p
                    style={
                      INFO_TEXT_STYLE
                    }
                  >
                    📍 موقع الأرض محفوظ
                  </p>

                )}


                <button
                  type="button"
                  onClick={
                    async () => {

                      const confirmed =
                        window.confirm(
                          "هل تريد حذف هذا المحصول؟"
                        );


                      if (!confirmed) {
                        return;
                      }


                      try {

                        await deleteCrop(
                          crop.id
                        );

                      } catch (
                        deleteError
                      ) {

                        console.error(
                          "Crop delete failed:",
                          deleteError
                        );

                      }

                    }
                  }
                  style={{
                    ...BUTTON_STYLE,
                    fontSize:
                      "17px",
                  }}
                >
                  🗑️ حذف
                </button>

              </article>

            );

          }
        )}

      </section>

    </main>

  );

}
