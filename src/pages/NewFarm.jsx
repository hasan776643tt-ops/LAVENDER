// src/pages/NewFarm.jsx

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
// LAVENDER — NEW FARM
// =========================================================
// إنشاء مزرعة جديدة
//
// التسلسل:
//
// المزارع
//   ↓
// مزرعة جديدة
//   ↓
// إنشاء Farm للحصول على farmId
//   ↓
// الخريطة
//   ↓
// حفظ Location مرتبط بـ farmId
//   ↓
// العودة إلى النموذج
//   ↓
// حفظ Crop مرتبط بـ farmId
//   ↓
// المزارع
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const DRAFT_STORAGE_KEY =
  "lavender:newFarmDraft";


const CROP_OPTIONS = [

  {
    value: "wheat",
    label: "قمح",
    cultivationType: "field",
  },

  {
    value: "cotton",
    label: "قطن",
    cultivationType: "field",
  },

  {
    value: "corn",
    label: "ذرة",
    cultivationType: "field",
  },

  {
    value: "barley",
    label: "شعير",
    cultivationType: "field",
  },

  {
    value: "sorghum",
    label: "سورغم",
    cultivationType: "field",
  },

  {
    value: "millet",
    label: "دخن",
    cultivationType: "field",
  },

  {
    value: "sesame",
    label: "سمسم",
    cultivationType: "field",
  },

  {
    value: "coriander",
    label: "كزبرة",
    cultivationType: "vegetables",
  },

];


// =========================================================
// HELPERS
// =========================================================

function createEmptyDraft() {

  return {

    farmId: "",

    farmName: "",

    cropName: "",

    cultivationType: "field",

    seedType: "",

    plantingDate: "",

    fertilizerType: "",

    fertilizerQuantity: "",

  };

}


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

  } catch (
    error
  ) {

    console.error(
      "Failed to read new farm draft:",
      error
    );


    return createEmptyDraft();

  }

}


function saveDraft(
  draft
) {

  try {

    window.sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(
        draft
      )
    );

  } catch (
    error
  ) {

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

  } catch (
    error
  ) {

    console.error(
      "Failed to clear new farm draft:",
      error
    );

  }

}


function calculateAge(
  plantingDate
) {

  if (!plantingDate) {

    return "";

  }


  const start =
    new Date(
      `${plantingDate}T00:00:00`
    );


  if (
    Number.isNaN(
      start.getTime()
    )
  ) {

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


  if (
    start > current
  ) {

    return "تاريخ الزراعة غير صحيح";

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


  if (
    days < 0
  ) {

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


  if (
    months < 0
  ) {

    years -= 1;

    months += 12;

  }


  const parts = [];


  if (
    years > 0
  ) {

    parts.push(
      `${years} سنة`
    );

  }


  if (
    months > 0
  ) {

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


function normalizeNumber(
  value
) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {

    return 0;

  }


  const number =
    Number(
      value
    );


  return Number.isFinite(
    number
  )
    ? number
    : 0;

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


  const {
    addFarm,
  } = useFarms();


  const {
    addCrop,
  } = useCrops();


  const {
    farmId,
    latitude,
    longitude,
    points,
    boundary,
    loading: mapLoading,
    setFarmId,
  } = useMap();


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
  // FARM ID FROM URL
  // =======================================================

  const urlFarmId =
    searchParams.get(
      "farmId"
    );


  // =======================================================
  // MAP RETURN STATE
  // =======================================================

  useEffect(
    () => {

      if (
        urlFarmId
      ) {

        setFarmId(
          String(
            urlFarmId
          )
        );


        setDraft(
          previous => {

            const next = {

              ...previous,

              farmId:
                String(
                  urlFarmId
                ),

            };


            saveDraft(
              next
            );


            return next;

          }
        );

      }

    },
    [
      urlFarmId,
      setFarmId,
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
  // PLANT AGE
  // =======================================================

  const plantAge =
    useMemo(
      () =>
        calculateAge(
          draft.plantingDate
        ),
      [
        draft.plantingDate,
      ]
    );


  // =======================================================
  // SELECTED CROP
  // =======================================================

  const selectedCrop =
    useMemo(
      () =>
        CROP_OPTIONS.find(
          crop =>
            crop.value ===
            draft.cropName
        ),
      [
        draft.cropName,
      ]
    );


  // =======================================================
  // LOCATION STATUS
  // =======================================================

  const hasLocation =
    Number.isFinite(
      Number(
        latitude
      )
    ) &&
    Number.isFinite(
      Number(
        longitude
      )
    );


  const locationPointCount =
    Array.isArray(
      boundary
    )
      ? boundary.length
      : Array.isArray(
          points
        )
        ? points.length
        : 0;


  // =======================================================
  // FORM CHANGE
  // =======================================================

  const updateField = (
    field,
    value
  ) => {

    setError(
      ""
    );

    setSuccess(
      ""
    );


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

    setError(
      ""
    );

    setSuccess(
      ""
    );


    if (
      !draft.farmName.trim()
    ) {

      setError(
        "أدخل اسم المزرعة أولًا."
      );

      return;

    }


    if (
      !draft.cropName
    ) {

      setError(
        "اختر اسم النبات أولًا."
      );

      return;

    }


    setSavingFarm(
      true
    );


    try {

      let currentFarmId =
        draft.farmId;


      // =================================================
      // CREATE BASE FARM ONLY ONCE
      // =================================================

      if (
        !currentFarmId
      ) {

        if (
          typeof addFarm !==
          "function"
        ) {

          throw new Error(
            "ADD_FARM_NOT_AVAILABLE"
          );

        }


        const createdFarm =
          await addFarm({

            name:
              draft.farmName.trim(),

            status:
              "active",

          });


        currentFarmId =
          createdFarm?.id ??
          createdFarm?._id ??
          createdFarm?.farmId ??
          "";


        if (
          !currentFarmId
        ) {

          throw new Error(
            "FARM_ID_NOT_CREATED"
          );

        }


        currentFarmId =
          String(
            currentFarmId
          );


        setDraft(
          previous => {

            const next = {

              ...previous,

              farmId:
                currentFarmId,

            };


            saveDraft(
              next
            );


            return next;

          }
        );

      }


      setFarmId(
        String(
          currentFarmId
        )
      );


      navigate(
        `/map?farmId=${encodeURIComponent(
          String(
            currentFarmId
          )
        )}&return=new-farm`
      );

    } catch (
      err
    ) {

      console.error(
        "Failed to prepare new farm:",
        err
      );


      setError(
        "تعذر إنشاء المزرعة. حاول مرة أخرى."
      );

    } finally {

      setSavingFarm(
        false
      );

    }

  };


  // =======================================================
  // SAVE FARM + CROP
  // =======================================================

  const saveFarm = async (
    event
  ) => {

    event.preventDefault();


    setError(
      ""
    );

    setSuccess(
      ""
    );


    const currentFarmId =
      draft.farmId ||
      farmId;


    if (
      !currentFarmId
    ) {

      setError(
        "لم يتم إنشاء رقم المزرعة. حدد الموقع أولًا."
      );

      return;

    }


    if (
      !draft.farmName.trim()
    ) {

      setError(
        "أدخل اسم المزرعة."
      );

      return;

    }


    if (
      !draft.cropName
    ) {

      setError(
        "اختر اسم النبات."
      );

      return;

    }


    if (
      !hasLocation
    ) {

      setError(
        "يجب تحديد موقع الحقل من الخريطة أولًا."
      );

      return;

    }


    if (
      !draft.plantingDate
    ) {

      setError(
        "أدخل تاريخ الزراعة."
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


      const cropName =
        selectedCrop?.label ||
        draft.cropName;


      const cultivationType =
        selectedCrop?.cultivationType ||
        draft.cultivationType ||
        "field";


      const locationBoundary =
        Array.isArray(
          boundary
        ) &&
        boundary.length > 0
          ? boundary
          : Array.isArray(
              points
            )
            ? points
            : [];


      await addCrop({

        farmId:
          normalizedFarmId,

        cultivationType:
          cultivationType,

        name:
          cropName,

        seedType:
          draft.seedType.trim(),

        seedVariety:
          "",

        seedQuality:
          "",

        seedQuantity:
          0,

        treeType:
          "",

        treeVariety:
          "",

        plantingDate:
          draft.plantingDate,

        fertilizerType:
          draft.fertilizerType.trim(),

        fertilizerQuantity:
          normalizeNumber(
            draft.fertilizerQuantity
          ),

        harvestDate:
          "",

        expectedProduction:
          0,

        latitude:
          Number(
            latitude
          ),

        longitude:
          Number(
            longitude
          ),

        boundary:
          locationBoundary,

        points:
          locationBoundary,

        climate:
          "",

        recommendedSeeds:
          [],

        notes:
          "",

        status:
          "active",

      });


      clearDraft();


      setSuccess(
        "تم حفظ المزرعة والمحصول بنجاح."
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

    } catch (
      err
    ) {

      console.error(
        "Failed to save farm and crop:",
        err
      );


      setError(
        "تعذر حفظ بيانات المزرعة. حاول مرة أخرى."
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

  const cancel =
    () => {

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
    >

      <div
        className="farms-page-content"
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="farms-selector-header"
        >

          <div
            className="farms-selector-symbol"
            aria-hidden="true"
          >
            🌱
          </div>


          <h1
            className="farms-selector-title"
          >
            مزرعة جديدة
          </h1>


          <div
            className="farms-selector-brand"
          >
            LAVENDER
          </div>


          <p
            className="farms-selector-subtitle"
          >
            تسجيل المزرعة والمحصول وموقع الحقل
          </p>

        </header>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            saveFarm
          }
          className="new-farm-form"
        >

          {/* =================================================
              FARM NAME
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="farm-name"
            >
              اسم المزرعة
            </label>


            <input
              id="farm-name"
              type="text"
              value={
                draft.farmName
              }
              onChange={event =>
                updateField(
                  "farmName",
                  event.target.value
                )
              }
              placeholder="اكتب اسم المزرعة"
              autoComplete="off"
              disabled={
                savingFarm ||
                savingCrop
              }
            />

          </section>


          {/* =================================================
              CROP
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="crop-name"
            >
              🌾 اسم النبات
            </label>


            <select
              id="crop-name"
              value={
                draft.cropName
              }
              onChange={event =>
                updateField(
                  "cropName",
                  event.target.value
                )
              }
              disabled={
                savingFarm ||
                savingCrop
              }
            >

              <option
                value=""
              >
                اختر النبات
              </option>


              {
                CROP_OPTIONS.map(
                  crop => (

                    <option
                      key={
                        crop.value
                      }
                      value={
                        crop.value
                      }
                    >
                      {
                        crop.label
                      }
                    </option>

                  )
                )
              }

            </select>

          </section>


          {/* =================================================
              MAP
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label>
              📍 مكان الحقل
            </label>


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
            >

              {
                savingFarm
                  ? "جاري إنشاء المزرعة..."
                  : "🗺️ تحديد الموقع"
              }

            </button>


            {
              hasLocation && (

                <div
                  className="new-farm-location-summary"
                >

                  <strong>
                    📍 تم تحديد موقع الحقل
                  </strong>


                  <span>
                    خط العرض:{" "}
                    {
                      Number(
                        latitude
                      ).toFixed(
                        6
                      )
                    }
                  </span>


                  <span>
                    خط الطول:{" "}
                    {
                      Number(
                        longitude
                      ).toFixed(
                        6
                      )
                    }
                  </span>


                  {
                    locationPointCount > 0 && (

                      <span>
                        نقاط الحدود:{" "}
                        {
                          locationPointCount
                        }
                      </span>

                    )
                  }

                </div>

              )
            }

          </section>


          {/* =================================================
              SEEDS
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="seed-type"
            >
              🌱 البذور المستخدمة
            </label>


            <input
              id="seed-type"
              type="text"
              value={
                draft.seedType
              }
              onChange={event =>
                updateField(
                  "seedType",
                  event.target.value
                )
              }
              placeholder="اكتب نوع أو اسم البذور"
              autoComplete="off"
              disabled={
                savingCrop
              }
            />

          </section>


          {/* =================================================
              PLANTING DATE
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="planting-date"
            >
              📅 تاريخ الزراعة
            </label>


            <input
              id="planting-date"
              type="date"
              value={
                draft.plantingDate
              }
              onChange={event =>
                updateField(
                  "plantingDate",
                  event.target.value
                )
              }
              disabled={
                savingCrop
              }
            />

          </section>


          {/* =================================================
              PLANT AGE
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label>
              ⏳ عمر النبات
            </label>


            <div
              className="new-farm-readonly"
            >
              {
                plantAge ||
                "يُحسب تلقائيًا بعد إدخال تاريخ الزراعة"
              }
            </div>

          </section>


          {/* =================================================
              FERTILIZER
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="fertilizer-type"
            >
              🧪 سماد الزراعة
            </label>


            <input
              id="fertilizer-type"
              type="text"
              value={
                draft.fertilizerType
              }
              onChange={event =>
                updateField(
                  "fertilizerType",
                  event.target.value
                )
              }
              placeholder="نوع السماد المستخدم عند الزراعة"
              autoComplete="off"
              disabled={
                savingCrop
              }
            />

          </section>


          {/* =================================================
              FERTILIZER QUANTITY
          ================================================= */}

          <section
            className="new-farm-section"
          >

            <label
              htmlFor="fertilizer-quantity"
            >
              كمية السماد
            </label>


            <input
              id="fertilizer-quantity"
              type="number"
              min="0"
              step="any"
              value={
                draft.fertilizerQuantity
              }
              onChange={event =>
                updateField(
                  "fertilizerQuantity",
                  event.target.value
                )
              }
              placeholder="الكمية"
              disabled={
                savingCrop
              }
            />

          </section>


          {/* =================================================
              ERROR
          ================================================= */}

          {
            error && (

              <div
                className="new-farm-error"
                role="alert"
              >
                ⚠️ {error}
              </div>

            )
          }


          {/* =================================================
              SUCCESS
          ================================================= */}

          {
            success && (

              <div
                className="new-farm-success"
                role="status"
              >
                ✅ {success}
              </div>

            )
          }


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="new-farm-actions"
          >

            <button
              type="submit"
              className="new-farm-save-button"
              disabled={
                savingFarm ||
                savingCrop
              }
            >

              {
                savingCrop
                  ? "جاري حفظ المزرعة..."
                  : "💾 حفظ المزرعة"
              }

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
            >
              إلغاء
            </button>

          </div>

        </form>

      </div>

    </main>

  );

}
