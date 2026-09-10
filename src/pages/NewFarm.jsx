// =========================================================
// LAVENDER — NEW AGRICULTURAL PROJECT
// src/pages/NewFarm.jsx
// =========================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import useMap from "../hooks/useMap.js";


// =========================================================
// CONSTANTS
// =========================================================

const DRAFT_STORAGE_KEY =
  "lavender:newFarmDraft";


// =========================================================
// EMPTY DRAFT
// =========================================================

function createEmptyDraft() {
  return {
    farmId: "",
    farmName: "",
    projectName: "",
    plantType: "",
    seedType: "",
    country: "",
    governorate: "",
    city: "",
    village: "",
    plantingDate: "",
    seedQuantity: "",
    fertilizerQuantity: "",
  };
}


// =========================================================
// DRAFT STORAGE
// =========================================================

function readDraft() {
  try {
    const raw =
      window.sessionStorage.getItem(
        DRAFT_STORAGE_KEY
      );

    if (!raw) {
      return createEmptyDraft();
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return createEmptyDraft();
    }

    return {
      ...createEmptyDraft(),
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Failed to read new farm draft:",
      error
    );

    return createEmptyDraft();
  }
}


function saveDraft(draft) {
  try {
    window.sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(draft)
    );
  } catch (error) {
    console.error(
      "Failed to save new farm draft:",
      error
    );
  }
}


function clearDraft() {
  try {
    window.sessionStorage.removeItem(
      DRAFT_STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear new farm draft:",
      error
    );
  }
}


// =========================================================
// ARABIC DIGITS
// =========================================================

function convertArabicDigits(value) {
  return String(value ?? "")
    .replace(/[٠-٩]/g, digit =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(
          digit
        )
      )
    )
    .replace(/[۰-۹]/g, digit =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(
          digit
        )
      )
    );
}


// =========================================================
// MANUAL DATE PARSER
// =========================================================

function parseManualDate(value) {
  if (!value) {
    return null;
  }

  const normalized =
    convertArabicDigits(
      String(value)
    )
      .trim()
      .replace(/[،,./-]+/g, " ")
      .replace(/\s+/g, " ");

  const parts =
    normalized
      .split(" ")
      .filter(Boolean);

  if (parts.length !== 3) {
    return null;
  }

  const day =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const year =
    Number(parts[2]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return null;
  }

  if (
    year < 1900 ||
    year > 2200 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}


// =========================================================
// PLANT AGE
// =========================================================

function calculatePlantAge(
  plantingDate
) {
  const start =
    parseManualDate(
      plantingDate
    );

  if (!start) {
    return "";
  }

  const today =
    new Date();

  const current =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  if (start > current) {
    return "لم تبدأ الزراعة بعد";
  }

  let years =
    current.getFullYear() -
    start.getFullYear();

  let months =
    current.getMonth() -
    start.getMonth();

  let days =
    current.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth =
      new Date(
        current.getFullYear(),
        current.getMonth(),
        0
      );

    days +=
      previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];

  if (years > 0) {
    parts.push(
      `${years} سنة`
    );
  }

  if (months > 0) {
    parts.push(
      `${months} شهر`
    );
  }

  if (
    days > 0 ||
    parts.length === 0
  ) {
    parts.push(
      `${days} يوم`
    );
  }

  return parts.join(
    " و "
  );
}


// =========================================================
// NUMBER
// =========================================================

function normalizeNumber(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
}


// =========================================================
// CLIMATE
// =========================================================

function estimateClimate({
  country,
  governorate,
  city,
  village,
  latitude,
}) {
  const hasAdministrativeInfo =
    Boolean(
      String(country || "").trim() ||
      String(governorate || "").trim() ||
      String(city || "").trim() ||
      String(village || "").trim()
    );

  if (!hasAdministrativeInfo) {
    return {
      text: "",
      ready: false,
    };
  }

  const lat =
    Number(latitude);

  if (
    Number.isFinite(lat)
  ) {
    if (lat >= 50) {
      return {
        text: "مناخ بارد",
        ready: true,
      };
    }

    if (lat >= 25) {
      return {
        text: "مناخ معتدل",
        ready: true,
      };
    }

    return {
      text: "مناخ حار",
      ready: true,
    };
  }

  const text =
    `${country || ""} ${
      governorate || ""
    } ${
      city || ""
    } ${
      village || ""
    }`.toLowerCase();

  if (
    text.includes("سوريا") ||
    text.includes("syria")
  ) {
    return {
      text: "مناخ متنوع حسب المنطقة",
      ready: true,
    };
  }

  return {
    text: "مناخ تقديري حسب الموقع",
    ready: true,
  };
}


// =========================================================
// RECOMMENDATIONS
// =========================================================

function estimateRecommendedSeeds({
  climateReady,
  plantType,
  seedType,
}) {
  if (!climateReady) {
    return [];
  }

  const plant =
    String(
      plantType || ""
    ).trim();

  const seed =
    String(
      seedType || ""
    ).trim();

  if (!plant && !seed) {
    return [];
  }

  const combined =
    `${plant} ${seed}`;

  if (
    combined.includes("قمح")
  ) {
    return [
      "شام 6",
      "شام 8",
      "أصناف قمح متوسطة الموسم",
    ];
  }

  if (
    combined.includes("شعير")
  ) {
    return [
      "شعير محلي متأقلم",
      "أصناف شعير مبكرة",
    ];
  }

  if (
    combined.includes("عدس")
  ) {
    return [
      "أصناف عدس متأقلمة مع المنطقة",
      "أصناف مبكرة النضج",
    ];
  }

  if (
    combined.includes("حمص")
  ) {
    return [
      "أصناف حمص متحملة للجفاف",
      "أصناف مبكرة النضج",
    ];
  }

  return [
    "اختر بذارًا متأقلمًا مع مناخ وموقع الحقل",
    "يفضل اختيار صنف معتمد ومناسب للمنطقة",
  ];
}


// =========================================================
// FARM ID NORMALIZER
// =========================================================

function getFarmId(farm) {
  return (
    farm?.id ??
    farm?._id ??
    farm?.farmId ??
    ""
  );
}


// =========================================================
// COMPONENT
// =========================================================

export default function NewFarm() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  // =======================================================
  // FARMS
  // =======================================================

  const {
    addFarm,
  } = useFarms();


  // =======================================================
  // CROPS
  // =======================================================

  const {
    addCrop,
  } = useCrops();


  // =======================================================
  // MAP
  // =======================================================

  const map =
    useMap();

  const mapFarmId =
    map?.farmId ?? "";

  const latitude =
    map?.latitude;

  const longitude =
    map?.longitude;

  const points =
    map?.points;

  const boundary =
    map?.boundary;

  const country =
    map?.country ?? "";

  const governorate =
    map?.governorate ?? "";

  const city =
    map?.city ?? "";

  const village =
    map?.village ?? "";

  const mapLoading =
    Boolean(
      map?.loading
    );

  const setMapFarmId =
    typeof map?.setFarmId === "function"
      ? map.setFarmId
      : null;


  // =======================================================
  // STATE
  // =======================================================

  const [
    draft,
    setDraft,
  ] = useState(
    () =>
      readDraft()
  );

  const [
    savingFarm,
    setSavingFarm,
  ] = useState(false);

  const [
    savingCrop,
    setSavingCrop,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // =======================================================
  // URL FARM ID
  // =======================================================

  const urlFarmId =
    searchParams.get(
      "farmId"
    );


  // =======================================================
  // NEW FARM ID
  // =======================================================

  const selectedFarmId =
    draft.farmId ||
    urlFarmId ||
    mapFarmId ||
    "";


  // =======================================================
  // LOCATION
  // =======================================================

  const hasLocation =
    Number.isFinite(
      Number(latitude)
    ) &&
    Number.isFinite(
      Number(longitude)
    );


  const locationPointCount =
    Array.isArray(boundary)
      ? boundary.length
      : Array.isArray(points)
        ? points.length
        : 0;


  // =======================================================
  // LOCATION INFORMATION
  // =======================================================

  const locationCountry =
    country ||
    draft.country ||
    "";

  const locationGovernorate =
    governorate ||
    draft.governorate ||
    "";

  const locationCity =
    city ||
    draft.city ||
    "";

  const locationVillage =
    village ||
    draft.village ||
    "";


  // =======================================================
  // CLIMATE
  // =======================================================

  const climate =
    useMemo(
      () =>
        estimateClimate({
          country:
            locationCountry,

          governorate:
            locationGovernorate,

          city:
            locationCity,

          village:
            locationVillage,

          latitude:
            latitude,
        }),
      [
        locationCountry,
        locationGovernorate,
        locationCity,
        locationVillage,
        latitude,
      ]
    );


  // =======================================================
  // RECOMMENDATIONS
  // =======================================================

  const recommendedSeeds =
    useMemo(
      () =>
        estimateRecommendedSeeds({
          climateReady:
            climate.ready,

          plantType:
            draft.plantType,

          seedType:
            draft.seedType,
        }),
      [
        climate.ready,
        draft.plantType,
        draft.seedType,
      ]
    );


  // =======================================================
  // PLANT AGE
  // =======================================================

  const plantAge =
    useMemo(
      () =>
        calculatePlantAge(
          draft.plantingDate
        ),
      [
        draft.plantingDate,
      ]
    );


  // =======================================================
  // URL FARM ID
  // =======================================================

  useEffect(
    () => {
      if (!urlFarmId) {
        return;
      }

      const normalizedId =
        String(
          urlFarmId
        );

      setDraft(
        previous => {
          const next = {
            ...previous,
            farmId:
              normalizedId,
          };

          saveDraft(
            next
          );

          return next;
        }
      );

      if (setMapFarmId) {
        setMapFarmId(
          normalizedId
        );
      }
    },
    [
      urlFarmId,
      setMapFarmId,
    ]
  );


  // =======================================================
  // MAP → DRAFT LOCATION
  // =======================================================

  useEffect(
    () => {
      if (
        !country &&
        !governorate &&
        !city &&
        !village
      ) {
        return;
      }

      setDraft(
        previous => {
          const next = {
            ...previous,

            country:
              country ||
              previous.country ||
              "",

            governorate:
              governorate ||
              previous.governorate ||
              "",

            city:
              city ||
              previous.city ||
              "",

            village:
              village ||
              previous.village ||
              "",
          };

          saveDraft(
            next
          );

          return next;
        }
      );
    },
    [
      country,
      governorate,
      city,
      village,
    ]
  );


  // =======================================================
  // AUTO SAVE DRAFT
  // =======================================================

  useEffect(
    () => {
      saveDraft(
        draft
      );
    },
    [
      draft,
    ]
  );


  // =======================================================
  // UPDATE FIELD
  // =======================================================

  const updateField = (
    field,
    value
  ) => {
    setError("");
    setSuccess("");

    setDraft(
      previous => ({
        ...previous,
        [field]:
          value,
      })
    );
  };


  // =======================================================
  // OPEN MAP
  // =======================================================

  const openMap = async () => {
    setError("");
    setSuccess("");

    const farmName =
      String(
        draft.farmName || ""
      ).trim();

    if (!farmName) {
      setError(
        "أدخل اسم المزرعة الجديدة أولًا."
      );

      return;
    }

    if (
      !draft.projectName.trim()
    ) {
      setError(
        "أدخل اسم المشروع الزراعي أولًا."
      );

      return;
    }

    if (
      !draft.plantType.trim()
    ) {
      setError(
        "أدخل نوع النبات المزروع أولًا."
      );

      return;
    }

    if (
      !draft.seedType.trim()
    ) {
      setError(
        "أدخل نوع البذار المختار أولًا."
      );

      return;
    }


    // -------------------------------------------------------
    // If this new farm already has an ID,
    // continue directly to the map.
    // -------------------------------------------------------

    if (selectedFarmId) {
      if (setMapFarmId) {
        setMapFarmId(
          String(
            selectedFarmId
          )
        );
      }

      navigate(
        `/map?farmId=${encodeURIComponent(
          String(
            selectedFarmId
          )
        )}&return=new-farm`
      );

      return;
    }


    // -------------------------------------------------------
    // Create the NEW farm identity.
    // Existing farms are never selected here.
    // -------------------------------------------------------

    setSavingFarm(
      true
    );

    try {
      const createdFarm =
        await addFarm({
          name:
            farmName,

          farmName:
            farmName,

          status:
            "active",
        });


      const createdFarmId =
        getFarmId(
          createdFarm
        );

      if (!createdFarmId) {
        throw new Error(
          "Farm was created without an ID."
        );
      }

      const normalizedId =
        String(
          createdFarmId
        );


      const nextDraft = {
        ...draft,

        farmId:
          normalizedId,

        farmName:
          farmName,
      };

      setDraft(
        nextDraft
      );

      saveDraft(
        nextDraft
      );


      if (setMapFarmId) {
        setMapFarmId(
          normalizedId
        );
      }


      navigate(
        `/map?farmId=${encodeURIComponent(
          normalizedId
        )}&return=new-farm`
      );

    } catch (err) {
      console.error(
        "Failed to create new farm:",
        err
      );

      setError(
        "تعذر إنشاء المزرعة الجديدة. حاول مرة أخرى."
      );

    } finally {
      setSavingFarm(
        false
      );
    }
  };


  // =======================================================
  // SAVE AGRICULTURAL PROJECT
  // =======================================================

  const saveFarm = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    const currentFarmId =
      draft.farmId ||
      urlFarmId ||
      mapFarmId ||
      "";


    // -------------------------------------------------------
    // FARM
    // -------------------------------------------------------

    if (!currentFarmId) {
      setError(
        "أدخل اسم المزرعة الجديدة وحدد موقعها من الخريطة أولًا."
      );

      return;
    }


    if (
      !draft.farmName.trim()
    ) {
      setError(
        "أدخل اسم المزرعة الجديدة."
      );

      return;
    }


    // -------------------------------------------------------
    // PROJECT
    // -------------------------------------------------------

    if (
      !draft.projectName.trim()
    ) {
      setError(
        "أدخل اسم المشروع الزراعي."
      );

      return;
    }


    if (
      !draft.plantType.trim()
    ) {
      setError(
        "أدخل نوع النبات المزروع."
      );

      return;
    }


    if (
      !draft.seedType.trim()
    ) {
      setError(
        "أدخل نوع البذار المختار."
      );

      return;
    }


    // -------------------------------------------------------
    // LOCATION
    // -------------------------------------------------------

    if (!hasLocation) {
      setError(
        "يجب تحديد موقع الحقل يدويًا من الخريطة أولًا."
      );

      return;
    }


    if (
      locationPointCount < 3
    ) {
      setError(
        "يجب تحديد 3 نقاط حدود على الأقل في الخريطة."
      );

      return;
    }


    // -------------------------------------------------------
    // DATE
    // -------------------------------------------------------

    if (
      !draft.plantingDate.trim()
    ) {
      setError(
        "أدخل تاريخ الزراعة."
      );

      return;
    }


    if (
      !parseManualDate(
        draft.plantingDate
      )
    ) {
      setError(
        "صيغة تاريخ الزراعة غير صحيحة. مثال: 2,6,2026 أو 15.5.2024."
      );

      return;
    }


    setSavingCrop(
      true
    );


    try {
      const normalizedFarmId =
        String(
          currentFarmId
        );

      const projectName =
        draft.projectName.trim();

      const plantType =
        draft.plantType.trim();

      const seedType =
        draft.seedType.trim();

      const plantingDate =
        draft.plantingDate.trim();


      const locationBoundary =
        Array.isArray(boundary) &&
        boundary.length > 0
          ? boundary
          : Array.isArray(points)
            ? points
            : [];


      await addCrop({
        farmId:
          normalizedFarmId,

        cultivationType:
          "field",

        name:
          plantType,

        projectName:
          projectName,

        plantType:
          plantType,

        seedType:
          seedType,

        seedVariety:
          "",

        seedQuality:
          "",

        seedQuantity:
          normalizeNumber(
            draft.seedQuantity
          ),

        treeType:
          "",

        treeVariety:
          "",

        plantingDate:
          plantingDate,

        fertilizerType:
          "",

        fertilizerQuantity:
          normalizeNumber(
            draft.fertilizerQuantity
          ),

        harvestDate:
          "",

        expectedProduction:
          0,

        actualProduction:
          0,

        salePrice:
          0,

        revenue:
          0,

        netProfit:
          0,

        latitude:
          Number(latitude),

        longitude:
          Number(longitude),

        boundary:
          locationBoundary,

        points:
          locationBoundary,

        country:
          locationCountry,

        governorate:
          locationGovernorate,

        city:
          locationCity,

        village:
          locationVillage,

        climate:
          climate.text,

        recommendedSeeds:
          recommendedSeeds,

        notes:
          "",

        status:
          "active",
      });


      clearDraft();

      setSuccess(
        "تم حفظ المزرعة والمشروع الزراعي بنجاح."
      );


      setTimeout(
        () => {
          navigate(
            "/farms",
            {
              replace:
                true,
            }
          );
        },
        700
      );

    } catch (err) {
      console.error(
        "Failed to save agricultural project:",
        err
      );

      setError(
        "تعذر حفظ المشروع الزراعي. حاول مرة أخرى."
      );

    } finally {
      setSavingCrop(
        false
      );
    }
  };


  // =======================================================
  // CANCEL
  // =======================================================

  const cancel = () => {
    clearDraft();

    navigate(
      "/farms"
    );
  };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main
      className="farms-selector"
      dir="rtl"
      style={{
        fontSize:
          "21px",
      }}
    >
      <div
        className="farms-page-content"
        style={{
          padding:
            "28px 16px 38px",
        }}
      >
        <form
          onSubmit={
            saveFarm
          }
          className="new-farm-form"
          style={{
            width:
              "100%",

            maxWidth:
              "680px",

            margin:
              "0 auto",

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              "26px",
          }}
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <header
            style={{
              textAlign:
                "center",

              marginBottom:
                "4px",
            }}
          >
            <h1
              style={{
                margin:
                  "0 0 8px",

                fontSize:
                  "32px",

                fontWeight:
                  900,

                lineHeight:
                  1.4,
              }}
            >
              🌱 مشروعي الزراعي
            </h1>

            <p
              style={{
                margin:
                  0,

                fontSize:
                  "19px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,
              }}
            >
              تسجيل مزرعة جديدة ومشروعها الزراعي
            </p>
          </header>


          {/* =================================================
              1 — NEW FARM + PROJECT
          ================================================= */}

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 4px",

                fontSize:
                  "24px",

                fontWeight:
                  900,

                lineHeight:
                  1.5,
              }}
            >
              🏡 معلومات المزرعة والمشروع
            </h2>


            <label
              htmlFor="farm-name"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🏡 اسم المزرعة الجديدة
            </label>


            <input
              id="farm-name"
              type="text"
              value={
                draft.farmName
              }
              onChange={
                event =>
                  updateField(
                    "farmName",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب اسم المزرعة الجديدة"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />


            {draft.farmId && (
              <div
                className="new-farm-readonly"
                style={{
                  width:
                    "100%",

                  minHeight:
                    "58px",

                  padding:
                    "12px 17px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  borderRadius:
                    "16px",

                  boxSizing:
                    "border-box",

                  fontSize:
                    "19px",

                  fontWeight:
                    800,

                  lineHeight:
                    1.5,
                }}
              >
                🏡 المزرعة الجديدة:
                {" "}
                <strong>
                  {
                    draft.farmName
                  }
                </strong>
              </div>
            )}


            <label
              htmlFor="project-name"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🌱 اسم المشروع الزراعي
            </label>


            <input
              id="project-name"
              type="text"
              value={
                draft.projectName
              }
              onChange={
                event =>
                  updateField(
                    "projectName",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب اسم المشروع الزراعي"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="plant-type"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🌾 نوع النبات المزروع
            </label>


            <input
              id="plant-type"
              type="text"
              value={
                draft.plantType
              }
              onChange={
                event =>
                  updateField(
                    "plantType",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="مثال: قمح"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="seed-type"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🌱 نوع البذار المختار
            </label>


            <input
              id="seed-type"
              type="text"
              value={
                draft.seedType
              }
              onChange={
                event =>
                  updateField(
                    "seedType",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="اكتب نوع أو صنف البذار"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />
          </section>


          {/* =================================================
              2 — LOCATION
          ================================================= */}

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 4px",

                fontSize:
                  "24px",

                fontWeight:
                  900,

                lineHeight:
                  1.5,
              }}
            >
              🌍 موقع المزرعة والحقل
            </h2>


            <div
              className="new-farm-readonly"
              style={{
                width:
                  "100%",

                padding:
                  "13px 15px",

                borderRadius:
                  "15px",

                fontSize:
                  "17px",

                fontWeight:
                  700,

                lineHeight:
                  1.7,
              }}
            >
              حدد موقع المزرعة يدويًا من الخريطة.
              لا يتم اختيار موقع تلقائيًا في هذه الخطوة.
            </div>


            <button
              type="button"
              className="farm-map-select-button"
              onClick={
                openMap
              }
              disabled={
                savingFarm ||
                savingCrop ||
                mapLoading
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "66px",

                padding:
                  "14px 18px",

                borderRadius:
                  "17px",

                border:
                  "2px solid rgba(255,255,255,.78)",

                fontSize:
                  "21px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            >
              {savingFarm
                ? "جاري إنشاء المزرعة الجديدة..."
                : mapLoading
                  ? "جاري قراءة الموقع..."
                  : hasLocation
                    ? "🗺️ تعديل موقع المزرعة"
                    : "🗺️ تحديد موقع المزرعة يدويًا من الخريطة"}
            </button>


            <label
              htmlFor="location-country"
              style={{
                fontSize:
                  "21px",

                fontWeight:
                  800,
              }}
            >
              الدولة
            </label>


            <input
              id="location-country"
              type="text"
              value={
                locationCountry
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
              style={{
                width:
                  "100%",

                minHeight:
                  "58px",

                padding:
                  "12px 17px",

                borderRadius:
                  "15px",

                border:
                  "2px solid rgba(255,255,255,.55)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="location-governorate"
              style={{
                fontSize:
                  "21px",

                fontWeight:
                  800,
              }}
            >
              المحافظة
            </label>


            <input
              id="location-governorate"
              type="text"
              value={
                locationGovernorate
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
              style={{
                width:
                  "100%",

                minHeight:
                  "58px",

                padding:
                  "12px 17px",

                borderRadius:
                  "15px",

                border:
                  "2px solid rgba(255,255,255,.55)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="location-city"
              style={{
                fontSize:
                  "21px",

                fontWeight:
                  800,
              }}
            >
              المدينة
            </label>


            <input
              id="location-city"
              type="text"
              value={
                locationCity
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
              style={{
                width:
                  "100%",

                minHeight:
                  "58px",

                padding:
                  "12px 17px",

                borderRadius:
                  "15px",

                border:
                  "2px solid rgba(255,255,255,.55)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="location-village"
              style={{
                fontSize:
                  "21px",

                fontWeight:
                  800,
              }}
            >
              القرية / البلدة
            </label>


            <input
              id="location-village"
              type="text"
              value={
                locationVillage
              }
              readOnly
              placeholder="تظهر تلقائيًا من الخريطة"
              style={{
                width:
                  "100%",

                minHeight:
                  "58px",

                padding:
                  "12px 17px",

                borderRadius:
                  "15px",

                border:
                  "2px solid rgba(255,255,255,.55)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                boxSizing:
                  "border-box",
              }}
            />


            {hasLocation && (
              <div
                className="new-farm-readonly"
                style={{
                  fontSize:
                    "17px",

                  fontWeight:
                    700,

                  lineHeight:
                    1.6,

                  padding:
                    "10px 14px",

                  borderRadius:
                    "13px",
                }}
              >
                📍 تم تحديد موقع المزرعة بنجاح
                {locationPointCount > 0
                  ? ` — نقاط الحدود: ${locationPointCount}`
                  : ""}
              </div>
            )}
          </section>


          {/* =================================================
              3 — CLIMATE
          ================================================= */}

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 4px",

                fontSize:
                  "24px",

                fontWeight:
                  900,

                lineHeight:
                  1.5,
              }}
            >
              🌤️ المناخ والتوصيات
            </h2>


            <label
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🌤️ المناخ
            </label>


            <div
              className="new-farm-readonly"
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                display:
                  "flex",

                alignItems:
                  "center",

                borderRadius:
                  "16px",

                boxSizing:
                  "border-box",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,
              }}
            >
              {climate.ready
                ? climate.text
                : "سيظهر تقدير المناخ بعد تحديد الموقع."}
            </div>


            <label
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              💡 التوصيات الزراعية
            </label>


            <div
              className="new-farm-readonly"
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                boxSizing:
                  "border-box",

                fontSize:
                  "19px",

                fontWeight:
                  700,

                lineHeight:
                  1.8,
              }}
            >
              {recommendedSeeds.length > 0
                ? (
                  <ul
                    style={{
                      margin:
                        0,

                      paddingRight:
                        "22px",
                    }}
                  >
                    {recommendedSeeds.map(
                      (
                        recommendation,
                        index
                      ) => (
                        <li
                          key={
                            `${recommendation}-${index}`
                          }
                        >
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                )
                : "ستظهر التوصيات تلقائيًا بعد توفر الموقع ونوع النبات أو البذار."}
            </div>
          </section>


          {/* =================================================
              4 — PLANTING & AGE
          ================================================= */}

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 4px",

                fontSize:
                  "24px",

                fontWeight:
                  900,

                lineHeight:
                  1.5,
              }}
            >
              📅 الزراعة وعمر النبات
            </h2>


            <label
              htmlFor="planting-date"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              📅 تاريخ الزراعة
            </label>


            <input
              id="planting-date"
              type="text"
              inputMode="numeric"
              value={
                draft.plantingDate
              }
              onChange={
                event =>
                  updateField(
                    "plantingDate",
                    event.target.value
                  )
              }
              autoComplete="off"
              placeholder="مثال: 2,6,2026 أو 15.5.2024"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />


            <div
              style={{
                fontSize:
                  "16px",

                fontWeight:
                  600,

                lineHeight:
                  1.7,
              }}
            >
              اكتب تاريخ الزراعة بالطريقة التي تناسبك.
              مثال: 2,6,2026 أو 15.5.2024 أو
              15-5-2024 أو 15/5/2024 أو 15 5 2024.
            </div>


            <label
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              ⏳ عمر النبات
            </label>


            <div
              className="new-farm-readonly"
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                display:
                  "flex",

                alignItems:
                  "center",

                borderRadius:
                  "16px",

                boxSizing:
                  "border-box",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,
              }}
            >
              {plantAge ||
                "سيظهر تلقائيًا عند إمكانية قراءة التاريخ"}
            </div>
          </section>


          {/* =================================================
              5 — QUANTITIES
          ================================================= */}

          <section
            className="new-farm-section"
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 4px",

                fontSize:
                  "24px",

                fontWeight:
                  900,

                lineHeight:
                  1.5,
              }}
            >
              🌱 الكميات المستخدمة
            </h2>


            <label
              htmlFor="seed-quantity"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🌱 كمية البذار
            </label>


            <input
              id="seed-quantity"
              type="number"
              min="0"
              step="any"
              value={
                draft.seedQuantity
              }
              onChange={
                event =>
                  updateField(
                    "seedQuantity",
                    event.target.value
                  )
              }
              placeholder="الكمية المستخدمة في الحقل"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />


            <label
              htmlFor="fertilizer-quantity"
              style={{
                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                textAlign:
                  "right",
              }}
            >
              🧪 كمية السماد
            </label>


            <input
              id="fertilizer-quantity"
              type="number"
              min="0"
              step="any"
              value={
                draft.fertilizerQuantity
              }
              onChange={
                event =>
                  updateField(
                    "fertilizerQuantity",
                    event.target.value
                  )
              }
              placeholder="الكمية المستخدمة في الحقل"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "62px",

                padding:
                  "14px 17px",

                borderRadius:
                  "16px",

                border:
                  "2px solid rgba(255,255,255,.75)",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            />
          </section>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (
            <div
              className="new-farm-error"
              role="alert"
              style={{
                fontSize:
                  "18px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,

                padding:
                  "16px",

                borderRadius:
                  "15px",

                textAlign:
                  "center",
              }}
            >
              ⚠️ {error}
            </div>
          )}


          {success && (
            <div
              className="new-farm-success"
              role="status"
              style={{
                fontSize:
                  "18px",

                fontWeight:
                  700,

                lineHeight:
                  1.6,

                padding:
                  "16px",

                borderRadius:
                  "15px",

                textAlign:
                  "center",
              }}
            >
              ✅ {success}
            </div>
          )}


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="new-farm-actions"
            style={{
              width:
                "100%",

              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "15px",

              marginTop:
                "8px",
            }}
          >
            <button
              type="submit"
              className="new-farm-save-button"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "68px",

                padding:
                  "14px 18px",

                borderRadius:
                  "17px",

                fontSize:
                  "22px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            >
              {savingCrop
                ? "جاري حفظ المشروع الزراعي..."
                : "💾 حفظ المزرعة والمشروع الزراعي"}
            </button>


            <button
              type="button"
              className="new-farm-cancel-button"
              onClick={
                cancel
              }
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width:
                  "100%",

                minHeight:
                  "64px",

                padding:
                  "14px 18px",

                borderRadius:
                  "17px",

                fontSize:
                  "21px",

                fontWeight:
                  800,

                lineHeight:
                  1.5,

                boxSizing:
                  "border-box",
              }}
            >
              إلغاء
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
