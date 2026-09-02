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
// CONSTANTS
// =========================================================

const DRAFT_STORAGE_KEY =
  "lavender:newFarmDraft";


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
      !draft.cropName.trim()
    ) {

      setError(
        "أدخل اسم النبات."
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
        draft.cropName.trim();


      const cultivationType =
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


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
      style={{
        fontSize: "21px",
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
            width: "100%",
            maxWidth: "680px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "26px",
          }}
        >

          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="farm-name"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
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
              autoComplete="off"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="crop-name"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              🌾 اسم النبات
            </label>


            <input
              id="crop-name"
              type="text"
              value={
                draft.cropName
              }
              onChange={event =>
                updateField(
                  "cropName",
                  event.target.value
                )
              }
              autoComplete="off"
              placeholder="اكتب اسم النبات كما تريد"
              disabled={
                savingFarm ||
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
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
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "66px",
                padding: "14px 18px",
                borderRadius: "17px",
                border: "2px solid rgba(255,255,255,.78)",
                fontSize: "21px",
                fontWeight: 800,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            >

              {
                savingFarm
                  ? "جاري إنشاء المزرعة..."
                  : hasLocation
                    ? "🗺️ تعديل موقع الحقل"
                    : "🗺️ تحديد الموقع"
              }

            </button>

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="seed-type"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
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
              autoComplete="off"
              disabled={
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="planting-date"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
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
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              ⏳ عمر النبات
            </label>


            <div
              className="new-farm-readonly"
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                display: "flex",
                alignItems: "center",
                borderRadius: "16px",
                boxSizing: "border-box",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {
                plantAge
              }
            </div>

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="fertilizer-type"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
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
              autoComplete="off"
              disabled={
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          <section
            className="new-farm-section"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <label
              htmlFor="fertilizer-quantity"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                textAlign: "right",
              }}
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
              disabled={
                savingCrop
              }
              style={{
                width: "100%",
                minHeight: "62px",
                padding: "14px 17px",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,.75)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />

          </section>


          {
            error && (

              <div
                className="new-farm-error"
                role="alert"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  padding: "16px",
                  borderRadius: "15px",
                  textAlign: "center",
                }}
              >
                ⚠️ {error}
              </div>

            )
          }


          {
            success && (

              <div
                className="new-farm-success"
                role="status"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  padding: "16px",
                  borderRadius: "15px",
                  textAlign: "center",
                }}
              >
                ✅ {success}
              </div>

            )
          }


          <div
            className="new-farm-actions"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "8px",
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
                width: "100%",
                minHeight: "68px",
                padding: "14px 18px",
                borderRadius: "17px",
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
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
              style={{
                width: "100%",
                minHeight: "64px",
                padding: "14px 18px",
                borderRadius: "17px",
                fontSize: "21px",
                fontWeight: 800,
                lineHeight: 1.5,
                boxSizing: "border-box",
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
