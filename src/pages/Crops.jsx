// =========================================================
// LAVENDER — CROPS PAGE
// src/pages/Crops.jsx
// =========================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import mapService from "../services/mapService.js";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import useFarm from "../hooks/useFarm.js";

import "./Crops.css";


// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
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

  latitude: "",
  longitude: "",
  boundary: [],

  climate: "",
  recommendedSeeds: [],

  notes: "",
};


// =========================================================
// CULTIVATION TYPES
// =========================================================

const CULTIVATION_TYPES = [
  {
    value: "trees",
    label: "أشجار",
    icon: "🌳",
  },
  {
    value: "field",
    label: "محاصيل حقلية",
    icon: "🌾",
  },
  {
    value: "vegetables",
    label: "خضروات",
    icon: "🥕",
  },
  {
    value: "other",
    label: "أخرى",
    icon: "🌿",
  },
];


// =========================================================
// FERTILIZER TYPES
// =========================================================

const FERTILIZERS = [
  { value: "عضوي", label: "عضوي" },
  { value: "يوريا", label: "يوريا" },
  { value: "نترات الأمونيوم", label: "نترات الأمونيوم" },
  { value: "سوبر فوسفات", label: "سوبر فوسفات" },
  { value: "فوسفات", label: "فوسفات" },
  { value: "بوتاسيوم", label: "بوتاسيوم" },
  { value: "مركب NPK", label: "مركب NPK" },
  { value: "سماد ورقي", label: "سماد ورقي" },
  { value: "أخرى", label: "أخرى" },
];


// =========================================================
// ARABIC MONTHS
// =========================================================

const ARABIC_MONTHS = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول",
];


// =========================================================
// DATE HELPERS
// =========================================================

function parseDateOnly(dateString) {

  const value =
    String(dateString ?? "").trim();

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
}


function formatDateLong(dateString) {

  const parsed =
    parseDateOnly(dateString);

  if (!parsed) {
    return "";
  }

  return `${parsed.day} ${ARABIC_MONTHS[parsed.month - 1]} ${parsed.year}`;
}


function daysBetween(
  dateString,
  reference = new Date()
) {

  const parsed =
    parseDateOnly(dateString);

  if (!parsed) {
    return null;
  }

  const start =
    Date.UTC(
      parsed.year,
      parsed.month - 1,
      parsed.day
    );

  const today =
    Date.UTC(
      reference.getFullYear(),
      reference.getMonth(),
      reference.getDate()
    );

  return Math.round(
    (today - start) /
      (1000 * 60 * 60 * 24)
  );
}


// =========================================================
// CLIMATE
// =========================================================

function getClimate(latitude) {

  const lat =
    Number(latitude);

  if (!Number.isFinite(lat)) {
    return "";
  }

  const absoluteLatitude =
    Math.abs(lat);

  if (absoluteLatitude >= 50) {
    return "باردة";
  }

  if (absoluteLatitude >= 25) {
    return "معتدلة";
  }

  return "حارة";
}


// =========================================================
// RECOMMENDED CROPS
// =========================================================

function getRecommendedSeeds(
  latitude,
  cultivationType
) {

  const climate =
    getClimate(latitude);

  if (!climate) {
    return [];
  }

  if (cultivationType === "trees") {

    if (climate === "باردة") {
      return [
        "تفاح",
        "كمثرى",
        "كرز",
      ];
    }

    if (climate === "معتدلة") {
      return [
        "زيتون",
        "رمان",
        "حمضيات",
      ];
    }

    return [
      "زيتون",
      "نخيل",
      "رمان",
    ];
  }


  if (cultivationType === "vegetables") {

    if (climate === "باردة") {
      return [
        "بطاطا",
        "ملفوف",
        "سبانخ",
      ];
    }

    if (climate === "معتدلة") {
      return [
        "طماطم",
        "خيار",
        "فلفل",
      ];
    }

    return [
      "طماطم",
      "باذنجان",
      "بامية",
    ];
  }


  if (cultivationType === "field") {

    if (climate === "باردة") {
      return [
        "قمح",
        "شعير",
        "عدس",
      ];
    }

    if (climate === "معتدلة") {
      return [
        "قمح",
        "شعير",
        "عدس",
        "حمص",
      ];
    }

    return [
      "ذرة",
      "دخن",
      "سورغم",
      "سمسم",
    ];
  }


  return [
    "قمح",
    "شعير",
    "عدس",
  ];
}


// =========================================================
// LOCATION NORMALIZER
// =========================================================

function normalizeLocation(location) {

  if (
    !location ||
    typeof location !== "object"
  ) {
    return null;
  }

  const latitude =
    Number(
      location.latitude ??
      location.lat
    );

  const longitude =
    Number(
      location.longitude ??
      location.lng ??
      location.lon
    );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const clean =
    value =>
      String(value ?? "").trim();

  return {

    latitude,

    longitude,

    boundary:
      Array.isArray(location.boundary)
        ? location.boundary
        : Array.isArray(location.points)
          ? location.points
          : [],

    village:
      clean(
        location.village ||
        location.town
      ),

    city:
      clean(location.city),

    province:
      clean(
        location.province ||
        location.governorate ||
        location.region
      ),

    country:
      clean(location.country),

    placeName:
      clean(location.placeName),

    north:
      clean(
        location.north ||
        location.northNeighbor
      ),

    south:
      clean(
        location.south ||
        location.southNeighbor
      ),

    east:
      clean(
        location.east ||
        location.eastNeighbor
      ),

    west:
      clean(
        location.west ||
        location.westNeighbor
      ),

    area:
      Number(location.area) || null,

    perimeter:
      Number(location.perimeter) || null,
  };
}


// =========================================================
// LOCATION CHAIN
// =========================================================

function getLocationChain(location) {

  if (!location) {
    return [];
  }

  const parts = [
    location.village,
    location.city,
    location.province,
    location.country,
  ].filter(Boolean);

  return [
    ...new Set(parts),
  ];
}


// =========================================================
// AREA
// =========================================================

function formatArea(squareMeters) {

  if (
    !Number.isFinite(squareMeters) ||
    squareMeters <= 0
  ) {
    return null;
  }

  const dunum =
    squareMeters / 1000;

  const hectare =
    squareMeters / 10000;

  return `${dunum.toFixed(1)} دونم (${hectare.toFixed(2)} هكتار)`;
}


// =========================================================
// FARM → FORM
// =========================================================

function farmToForm(
  farm,
  currentForm
) {

  if (!farm) {
    return currentForm;
  }

  const location =
    normalizeLocation(
      farm.location ??
      farm.mapLocation ??
      farm.fieldLocation ??
      farm
    );

  return {

    ...currentForm,

    farmId:
      String(
        farm.id ??
        currentForm.farmId ??
        ""
      ),

    cultivationType:
      currentForm.cultivationType ||
      "field",

    latitude:
      location?.latitude ??
      farm.latitude ??
      currentForm.latitude ??
      "",

    longitude:
      location?.longitude ??
      farm.longitude ??
      currentForm.longitude ??
      "",

    boundary:
      location?.boundary ??
      farm.boundary ??
      currentForm.boundary ??
      [],

    climate:
      farm.climate ??
      currentForm.climate ??
      "",

    notes:
      currentForm.notes ??
      "",
  };
}


// =========================================================
// COMPONENT
// =========================================================

export default function Crops() {

  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const {
    farms = [],
    loading: farmsLoading,
    error: farmsError,
  } = useFarms();


  const {
    crops = [],
    loading: cropsLoading,
    error: cropsError,
    addCrop,
    deleteCrop,
  } = useCrops();


  const selectedFarmId =
    String(
      searchParams.get("farmId") ?? ""
    ).trim();


  const {
    farm: loadedFarm,
    loading: farmLoading,
  } = useFarm(
    selectedFarmId || null
  );


  const selectedFarm =
    useMemo(() => {

      if (loadedFarm) {
        return loadedFarm;
      }

      return (
        farms.find(
          farm =>
            String(
              farm?.id ?? ""
            ).trim() ===
            selectedFarmId
        ) || null
      );

    }, [
      loadedFarm,
      farms,
      selectedFarmId,
    ]);


  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );


  const [
    mapLocation,
    setMapLocation,
  ] = useState(null);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    saving,
    setSaving,
  ] = useState(false);


  // =======================================================
  // يمنع إعادة تهيئة النموذج بسبب إعادة render
  // =======================================================

  const initializedFarmRef =
    useRef("");


  // =======================================================
  // FARM FROM URL
  // =======================================================

  useEffect(() => {

    if (!selectedFarmId) {
      return;
    }

    setForm(previous => {

      if (
        previous.farmId ===
        selectedFarmId
      ) {
        return previous;
      }

      return {
        ...previous,
        farmId: selectedFarmId,
      };

    });

  }, [
    selectedFarmId,
  ]);


  // =======================================================
  // LOAD SELECTED FARM
  //
  // مهم:
  // لا نعيد بناء form بعد كل render.
  // نهيئ بيانات المزرعة مرة واحدة فقط
  // عند الانتقال إلى مزرعة مختلفة.
  // =======================================================

  useEffect(() => {

    if (!selectedFarm) {
      return;
    }

    const farmId =
      String(
        selectedFarm.id ??
        selectedFarmId ??
        ""
      ).trim();

    if (!farmId) {
      return;
    }


    if (
      initializedFarmRef.current ===
      farmId
    ) {
      return;
    }


    initializedFarmRef.current =
      farmId;


    setForm(previous =>
      farmToForm(
        selectedFarm,
        {
          ...EMPTY_FORM,

          ...previous,

          farmId,
        }
      )
    );

  }, [
    selectedFarm?.id,
    selectedFarmId,
  ]);


  // =======================================================
  // عند تغيير المزرعة فعليًا
  // نسمح بتهيئة جديدة
  // =======================================================

  useEffect(() => {

    if (
      initializedFarmRef.current &&
      initializedFarmRef.current !==
        selectedFarmId
    ) {
      initializedFarmRef.current =
        "";
    }

  }, [
    selectedFarmId,
  ]);


  // =======================================================
  // LOAD FARM LOCATION
  // =======================================================

  useEffect(() => {

    let cancelled = false;


    async function loadFarmLocation() {

      if (!selectedFarmId) {
        setMapLocation(null);
        return;
      }


      try {

        const location =
          await mapService.getLocationByFarmId(
            selectedFarmId
          );


        if (cancelled) {
          return;
        }


        const normalized =
          normalizeLocation(
            location
          );


        if (normalized) {

          setMapLocation(
            normalized
          );


          setForm(previous => ({

            ...previous,

            farmId:
              selectedFarmId,

            latitude:
              normalized.latitude,

            longitude:
              normalized.longitude,

            boundary:
              normalized.boundary,

          }));

        } else {

          setMapLocation(null);

        }

      } catch {

        if (!cancelled) {
          setMapLocation(null);
        }

      }

    }


    loadFarmLocation();


    return () => {
      cancelled = true;
    };

  }, [
    selectedFarmId,
  ]);


  // =======================================================
  // CLIMATE
  // =======================================================

  const climate =
    useMemo(() => {

      return getClimate(
        mapLocation?.latitude ??
        form.latitude
      );

    }, [
      mapLocation,
      form.latitude,
    ]);


  // =======================================================
  // RECOMMENDATIONS
  // =======================================================

  const recommendedSeeds =
    useMemo(() => {

      return getRecommendedSeeds(
        mapLocation?.latitude ??
        form.latitude,
        form.cultivationType
      );

    }, [
      mapLocation,
      form.latitude,
      form.cultivationType,
    ]);


  // =======================================================
  // LOCATION
  // =======================================================

  const locationChain =
    useMemo(
      () =>
        getLocationChain(
          mapLocation
        ),
      [
        mapLocation,
      ]
    );


  const locationNeighbors =
    useMemo(() => {

      if (!mapLocation) {
        return [];
      }

      return [
        {
          label: "شمال",
          value: mapLocation.north,
        },
        {
          label: "جنوب",
          value: mapLocation.south,
        },
        {
          label: "شرق",
          value: mapLocation.east,
        },
        {
          label: "غرب",
          value: mapLocation.west,
        },
      ].filter(
        item => item.value
      );

    }, [
      mapLocation,
    ]);


  const areaLabel =
    useMemo(
      () =>
        formatArea(
          mapLocation?.area
        ),
      [
        mapLocation,
      ]
    );


  // =======================================================
  // ONLY SELECTED FARM CROPS
  // =======================================================

  const selectedFarmCrops =
    useMemo(() => {

      if (!selectedFarmId) {
        return [];
      }

      return crops.filter(
        crop =>
          String(
            crop?.farmId ?? ""
          ).trim() ===
          selectedFarmId
      );

    }, [
      crops,
      selectedFarmId,
    ]);


  // =======================================================
  // GENERAL INPUT
  // =======================================================

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm(previous => ({

      ...previous,

      [name]: value,

    }));

  }


  // =======================================================
  // FARM CHANGE
  // =======================================================

  function handleFarmChange(event) {

    const farmId =
      String(
        event.target.value ?? ""
      ).trim();


    if (!farmId) {

      setSearchParams({});

      setForm(
        EMPTY_FORM
      );

      setMapLocation(null);

      setMessage("");

      initializedFarmRef.current =
        "";

      return;
    }


    setSearchParams({
      farmId,
    });


    setForm({

      ...EMPTY_FORM,

      farmId,

    });


    setMapLocation(null);

    setMessage("");

    initializedFarmRef.current =
      "";

  }


  // =======================================================
  // CULTIVATION TYPE
  // =======================================================

  function handleCultivationType(
    cultivationType
  ) {

    setForm(previous => ({

      ...previous,

      cultivationType,

      name: "",

      treeType: "",
      treeVariety: "",

      seedType: "",
      seedVariety: "",

    }));

  }


  // =======================================================
  // SUGGESTED CROP
  // =======================================================

  function applySuggestedSeed(
    seedName
  ) {

    setForm(previous => ({

      ...previous,

      ...(previous.cultivationType === "trees"

        ? {
            treeType:
              seedName,
          }

        : {
            name:
              seedName,
          }),

    }));

  }


  // =======================================================
  // MAP
  // =======================================================

  function chooseMapLocation() {

    if (!selectedFarmId) {

      setMessage(
        "اختر المزرعة أولاً"
      );

      return;
    }


    navigate(
      `/map?return=crops&farmId=${encodeURIComponent(
        selectedFarmId
      )}`
    );

  }


  // =======================================================
  // REFRESH LOCATION
  // =======================================================

  async function refreshMapLocation() {

    if (!selectedFarmId) {

      setMessage(
        "اختر المزرعة أولاً"
      );

      return;
    }


    try {

      setMessage(
        "جاري تحميل موقع المزرعة..."
      );


      const location =
        await mapService.getLocationByFarmId(
          selectedFarmId
        );


      const normalized =
        normalizeLocation(
          location
        );


      if (!normalized) {

        setMapLocation(null);

        setMessage(
          "لا يوجد موقع محفوظ لهذه المزرعة"
        );

        return;
      }


      setMapLocation(
        normalized
      );


      setForm(previous => ({

        ...previous,

        farmId:
          selectedFarmId,

        latitude:
          normalized.latitude,

        longitude:
          normalized.longitude,

        boundary:
          normalized.boundary,

      }));


      setMessage(
        "تم تحميل موقع المزرعة"
      );

    } catch {

      setMessage(
        "تعذر تحميل موقع المزرعة"
      );

    }

  }


  // =======================================================
  // SAVE
  // =======================================================

  async function handleSubmit(event) {

    event.preventDefault();

    setMessage("");


    if (saving) {
      return;
    }


    if (!selectedFarmId) {

      setMessage(
        "اختر المزرعة أولاً"
      );

      return;
    }


    const latitude =
      Number(
        mapLocation?.latitude ??
        form.latitude
      );


    const longitude =
      Number(
        mapLocation?.longitude ??
        form.longitude
      );


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      setMessage(
        "يجب تحديد موقع المزرعة على الخريطة أولاً"
      );

      return;
    }


    const cropName =
      String(
        form.cultivationType === "trees"
          ? form.treeType
          : form.name
      ).trim();


    if (
      form.cultivationType === "trees" &&
      !String(
        form.treeType ?? ""
      ).trim()
    ) {

      setMessage(
        "أدخل نوع الشجرة"
      );

      return;
    }


    if (
      form.cultivationType !== "trees" &&
      !cropName
    ) {

      setMessage(
        "أدخل اسم المحصول"
      );

      return;
    }


    // =====================================================
    // نلتقط التاريخ قبل أي await
    // ولا نستخدم new Date()
    // =====================================================

    const plantingDate =
      String(
        form.plantingDate ?? ""
      ).trim();


    const harvestDate =
      String(
        form.harvestDate ?? ""
      ).trim();


    setSaving(true);


    try {

      const payload = {

        ...form,

        farmId:
          selectedFarmId,

        name:
          cropName,

        latitude,

        longitude,

        boundary:
          mapLocation?.boundary ??
          form.boundary ??
          [],

        climate,

        recommendedSeeds,

        village:
          mapLocation?.village ??
          "",

        city:
          mapLocation?.city ??
          "",

        province:
          mapLocation?.province ??
          "",

        country:
          mapLocation?.country ??
          "",

        north:
          mapLocation?.north ??
          "",

        south:
          mapLocation?.south ??
          "",

        east:
          mapLocation?.east ??
          "",

        west:
          mapLocation?.west ??
          "",

        area:
          mapLocation?.area ??
          null,

        perimeter:
          mapLocation?.perimeter ??
          null,

        // =================================================
        // التاريخ كما أدخله المستخدم حرفيًا
        // =================================================

        plantingDate,

        harvestDate,

        seedQuantity:
          form.seedQuantity === ""
            ? null
            : Number(
                form.seedQuantity
              ),

        fertilizerQuantity:
          form.fertilizerQuantity === ""
            ? null
            : Number(
                form.fertilizerQuantity
              ),

      };


      const created =
        await addCrop(
          payload
        );


      // ===================================================
      // مهم:
      // نعيد تثبيت بيانات النموذج بالقيم التي تم حفظها
      // ولا نترك useEffect الخاص بالمزرعة يمسحها.
      // ===================================================

      setForm(previous => ({

        ...previous,

        ...payload,

        id:
          created?.id ??
          previous.id ??
          null,

        plantingDate:
          plantingDate,

        harvestDate:
          harvestDate,

      }));


      setMessage(
        "تم حفظ المحصول بنجاح"
      );


    } catch (error) {

      setMessage(
        error?.message ||
        "تعذر حفظ المحصول"
      );

    } finally {

      setSaving(false);

    }

  }


  // =======================================================
  // DELETE
  // =======================================================

  async function handleDelete(id) {

    const cropId =
      String(
        id ?? ""
      ).trim();


    if (!cropId) {

      setMessage(
        "هذا المحصول قديم ولا يملك رقم تعريف صالحًا للحذف"
      );

      return;
    }


    try {

      const deleted =
        await deleteCrop(
          cropId
        );


      if (!deleted) {

        setMessage(
          "لم يتم العثور على المحصول للحذف"
        );

        return;
      }


      setMessage(
        "تم حذف المحصول بنجاح"
      );

    } catch (error) {

      setMessage(
        error?.message ||
        "تعذر حذف المحصول"
      );

    }

  }


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div
      dir="rtl"
      className="crops-page"
    >

      <header className="crops-header">

        <h1>
          🌱 المحاصيل
        </h1>

      </header>


      {message && (
        <div className="crops-message">
          {message}
        </div>
      )}


      {farmsError && (
        <div className="crops-error">
          تعذر تحميل المزارع
        </div>
      )}


      {cropsError && (
        <div className="crops-error">
          تعذر تحميل المحاصيل
        </div>
      )}


      {/* =================================================
          FARM
      ================================================= */}

      <section className="crops-section">

        <h2>
          1️⃣ المزرعة
        </h2>


        <select
          value={selectedFarmId}
          onChange={handleFarmChange}
          disabled={farmsLoading}
        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(
            farm => (

              <option
                key={farm.id}
                value={farm.id}
              >
                {farm.name ||
                  farm.farmName ||
                  `مزرعة ${farm.id}`}
              </option>

            )
          )}

        </select>


        {selectedFarm && (

          <div
            className="crops-farm-card"
            style={{
              marginTop: 14,
            }}
          >

            <strong className="crops-farm-name">
              🏡{" "}
              {selectedFarm.name ||
                selectedFarm.farmName ||
                "المزرعة"}
            </strong>


            {selectedFarm.status && (

              <span className="crops-status-badge">
                ● {selectedFarm.status}
              </span>

            )}


            {farmLoading && (

              <span className="crops-field-hint">
                جاري تحميل بيانات المزرعة...
              </span>

            )}

          </div>

        )}

      </section>


      {/* =================================================
          CROP TYPE
      ================================================= */}

      <section className="crops-section">

        <h2>
          2️⃣ نوع المحصول
        </h2>


        <div className="crops-type-group">

          {CULTIVATION_TYPES.map(
            type => (

              <button
                type="button"
                key={type.value}
                onClick={() =>
                  handleCultivationType(
                    type.value
                  )
                }
                className={
                  "crops-type-chip" +
                  (
                    form.cultivationType ===
                    type.value
                      ? " is-active"
                      : ""
                  )
                }
              >

                {type.icon}{" "}
                {type.label}

              </button>

            )
          )}

        </div>

      </section>


      {/* =================================================
          LOCATION
      ================================================= */}

      <section className="crops-section">

        <h2>
          3️⃣ موقع الحقل
        </h2>


        <div className="crops-location-summary">

          {mapLocation ? (

            <>

              <div className="crops-location-place">

                <span className="crops-location-icon">
                  📍
                </span>


                <div>

                  {locationChain.length > 0 ? (

                    <div className="crops-location-chain">

                      {locationChain.map(
                        (part, index) => (

                          <span
                            key={part}
                            className={
                              "crops-chain-tag" +
                              (
                                index === 0
                                  ? " is-primary"
                                  : ""
                              )
                            }
                          >
                            {part}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <span className="crops-field-hint">
                      لم يتم تسجيل اسم القرية/البلدة لهذا الموقع بعد
                    </span>

                  )}

                </div>

              </div>


              <div className="crops-location-meta">

                <div>
                  <strong>
                    {mapLocation.latitude.toFixed(5)}
                  </strong>
                  خط العرض
                </div>


                <div>
                  <strong>
                    {mapLocation.longitude.toFixed(5)}
                  </strong>
                  خط الطول
                </div>


                {areaLabel && (

                  <div>
                    <strong>
                      {areaLabel}
                    </strong>
                    مساحة الحقل
                  </div>

                )}


                {mapLocation.boundary?.length >= 3 && (

                  <div>
                    <strong>
                      {mapLocation.boundary.length}
                    </strong>
                    نقاط الحدود
                  </div>

                )}

              </div>


              {locationNeighbors.length > 0 && (

                <div className="crops-location-chain">

                  {locationNeighbors.map(
                    n => (

                      <span
                        key={n.label}
                        className="crops-chain-tag"
                      >
                        {n.label}: {n.value}
                      </span>

                    )
                  )}

                </div>

              )}

            </>

          ) : (

            <div className="crops-location-empty">
              ⚠️ لم يتم تحديد موقع الحقل بعد — حدده على الخريطة لعرض القرية والحدود الإدارية هنا
            </div>

          )}

        </div>


        <div className="crops-actions">

          <button
            type="button"
            onClick={chooseMapLocation}
          >
            📍 تعديل الموقع على الخريطة
          </button>


          <button
            type="button"
            onClick={refreshMapLocation}
          >
            🔄 تحديث بيانات الموقع
          </button>

        </div>

      </section>


      {/* =================================================
          CLIMATE
      ================================================= */}

      {climate && (

        <section className="crops-section">

          <h2>
            🌤️ المناخ والتوصيات
          </h2>


          <div className="crops-climate-row">

            <span className="crops-climate-badge">
              {climate}
            </span>


            <span className="crops-field-hint">
              حسب موقع الحقل الجغرافي
            </span>

          </div>


          {recommendedSeeds.length > 0 && (

            <div className="crops-suggested-list">

              {recommendedSeeds.map(
                seed => (

                  <span
                    key={seed}
                    className="crops-suggested-item"
                    onClick={() =>
                      applySuggestedSeed(
                        seed
                      )
                    }
                    title="اضغط لاستخدام هذا المحصول"
                  >
                    {seed}
                  </span>

                )
              )}

            </div>

          )}

        </section>

      )}


      {/* =================================================
          CROP DATA
      ================================================= */}

      <section className="crops-section">

        <h2>
          4️⃣ بيانات المحصول
        </h2>


        <form onSubmit={handleSubmit}>

          <div className="crops-form-grid">

            {form.cultivationType === "trees" ? (

              <>

                <div className="crops-field">

                  <label className="crops-field-label">
                    نوع الشجرة
                  </label>

                  <input
                    type="text"
                    name="treeType"
                    value={form.treeType}
                    onChange={handleChange}
                    autoComplete="off"
                    list="crops-suggestions"
                  />

                </div>


                <div className="crops-field">

                  <label className="crops-field-label">
                    صنف الشجرة
                  </label>

                  <input
                    type="text"
                    name="treeVariety"
                    value={form.treeVariety}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                </div>

              </>

            ) : (

              <>

                <div className="crops-field crops-field-full">

                  <label className="crops-field-label">
                    اسم المحصول
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="off"
                    list="crops-suggestions"
                  />

                </div>


                <div className="crops-field">

                  <label className="crops-field-label">
                    نوع البذار
                  </label>

                  <input
                    type="text"
                    name="seedType"
                    value={form.seedType}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                </div>


                <div className="crops-field">

                  <label className="crops-field-label">
                    صنف البذار
                  </label>

                  <input
                    type="text"
                    name="seedVariety"
                    value={form.seedVariety}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                </div>


                <div className="crops-field">

                  <label className="crops-field-label">
                    جودة البذار
                  </label>

                  <input
                    type="text"
                    name="seedQuality"
                    value={form.seedQuality}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                </div>


                <div className="crops-field">

                  <label className="crops-field-label">
                    كمية البذار (كغ)
                  </label>

                  <input
                    type="number"
                    name="seedQuantity"
                    value={form.seedQuantity}
                    onChange={handleChange}
                    inputMode="decimal"
                  />

                </div>

              </>

            )}


            <datalist id="crops-suggestions">

              {recommendedSeeds.map(
                seed => (

                  <option
                    key={seed}
                    value={seed}
                  />

                )
              )}

            </datalist>


            {/* PLANTING DATE */}

            <div className="crops-field">

              <label className="crops-field-label">
                تاريخ الزراعة
              </label>


              <input
                type="date"
                name="plantingDate"
                value={
                  form.plantingDate || ""
                }
                onChange={handleChange}
              />


              {form.plantingDate && (

                <span className="crops-field-hint">

                  {formatDateLong(
                    form.plantingDate
                  )}

                  {" — "}

                  {daysBetween(
                    form.plantingDate
                  )}

                  {" يوم"}

                </span>

              )}

            </div>


            {/* HARVEST DATE */}

            <div className="crops-field">

              <label className="crops-field-label">
                تاريخ الحصاد المتوقع
              </label>


              <input
                type="date"
                name="harvestDate"
                value={
                  form.harvestDate || ""
                }
                onChange={handleChange}
              />


              {form.harvestDate && (

                <span className="crops-field-hint">

                  {formatDateLong(
                    form.harvestDate
                  )}

                  {daysBetween(
                    form.harvestDate
                  ) < 0
                    ? ` — بعد ${-daysBetween(
                        form.harvestDate
                      )} يوم`
                    : ` — منذ ${daysBetween(
                        form.harvestDate
                      )} يوم`}

                </span>

              )}

            </div>


            {/* FERTILIZER */}

            <div className="crops-field">

              <label
                className="crops-field-label"
                htmlFor="fertilizerType"
              >
                نوع السماد
              </label>


              <select
                id="fertilizerType"
                name="fertilizerType"
                value={
                  form.fertilizerType ||
                  ""
                }
                onChange={handleChange}
                autoComplete="off"
              >

                <option value="">
                  اختر نوع السماد
                </option>


                {FERTILIZERS.map(
                  fertilizer => (

                    <option
                      key={
                        fertilizer.value
                      }
                      value={
                        fertilizer.value
                      }
                    >
                      {fertilizer.label}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="crops-field">

              <label className="crops-field-label">
                كمية السماد (كغ)
              </label>


              <input
                type="number"
                name="fertilizerQuantity"
                value={
                  form.fertilizerQuantity
                }
                onChange={handleChange}
                inputMode="decimal"
              />

            </div>


            {/* NOTES */}

            <div className="crops-field crops-field-full">

              <label className="crops-field-label">
                ملاحظات
              </label>


              <textarea
                name="notes"
                value={
                  form.notes || ""
                }
                onChange={handleChange}
                autoComplete="off"
              />

            </div>


            {/* SAVE */}

            <div className="crops-submit-row">

              <button
                type="submit"
                className="crops-submit-button"
                disabled={saving}
              >

                {saving
                  ? "جاري الحفظ..."
                  : "💾 حفظ المحصول"}

              </button>

            </div>

          </div>

        </form>

      </section>


      {/* =================================================
          FARM CROPS
      ================================================= */}

      <section className="crops-section">

        <h2>
          🌱 محاصيل المزرعة
        </h2>


        {!selectedFarmId ? (

          <p>
            اختر المزرعة لعرض محاصيلها
          </p>

        ) : cropsLoading ? (

          <p>
            جاري تحميل المحاصيل...
          </p>

        ) : selectedFarmCrops.length === 0 ? (

          <p>
            لا توجد محاصيل مسجلة لهذه المزرعة
          </p>

        ) : (

          <div className="crops-list">

            {selectedFarmCrops.map(
              crop => {

                const cropName =
                  crop.name ||
                  crop.treeType ||
                  "محصول";


                const cropChain = [
                  crop.village,
                  crop.city,
                  crop.province,
                ].filter(Boolean);


                return (

                  <article
                    key={
                      crop.id ||
                      `${crop.farmId}-${crop.name}-${crop.plantingDate}`
                    }
                    className="crop-card"
                  >

                    <h3>
                      {cropName}
                    </h3>


                    {cropChain.length > 0 && (

                      <p className="crop-card-location">
                        📍{" "}
                        {cropChain.join(
                          " — "
                        )}
                      </p>

                    )}


                    {crop.area && (

                      <p>
                        مساحة:{" "}
                        {formatArea(
                          crop.area
                        )}
                      </p>

                    )}


                    {(crop.plantingDate ||
                      crop.harvestDate) && (

                      <div className="crop-card-dates">

                        {crop.plantingDate && (

                          <p>

                            <span className="crop-date-label">
                              تاريخ الزراعة:{" "}
                            </span>

                            {formatDateLong(
                              crop.plantingDate
                            )}

                            {" — "}

                            {daysBetween(
                              crop.plantingDate
                            )}

                            {" يوم"}

                          </p>

                        )}


                        {crop.harvestDate && (

                          <p>

                            <span className="crop-date-label">
                              تاريخ الحصاد المتوقع:{" "}
                            </span>

                            {formatDateLong(
                              crop.harvestDate
                            )}

                          </p>

                        )}

                      </div>

                    )}


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          crop.id
                        )
                      }
                    >
                      🗑️ حذف
                    </button>

                  </article>

                );

              }
            )}

          </div>

        )}

      </section>

    </div>
  );
}
