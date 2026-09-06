// =========================================================
// LAVENDER — CROPS PAGE
// src/pages/Crops.jsx
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

import mapService from "../services/mapService.js";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";
import useFarm from "../hooks/useFarm.js";


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
// FERTILIZERS
// =========================================================

const FERTILIZERS = [
  "عضوي",
  "يوريا",
  "نترات الأمونيوم",
  "سوبر فوسفات",
  "فوسفات",
  "بوتاسيوم",
  "مركب NPK",
  "سماد ورقي",
  "أخرى",
];


// =========================================================
// CLIMATE
// =========================================================

function getClimate(latitude) {
  const lat = Number(latitude);

  if (!Number.isFinite(lat)) {
    return "";
  }

  const absoluteLatitude = Math.abs(lat);

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

function getRecommendedSeeds(latitude, cultivationType) {
  const climate = getClimate(latitude);

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
  if (!location || typeof location !== "object") {
    return null;
  }

  const latitude = Number(
    location.latitude ??
    location.lat
  );

  const longitude = Number(
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

  return {
    latitude,
    longitude,
    boundary: Array.isArray(location.boundary)
      ? location.boundary
      : [],
  };
}


// =========================================================
// DATE AGE
// =========================================================

function calculateAge(date) {
  if (!date) {
    return 0;
  }

  const plantingDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(plantingDate.getTime())) {
    return 0;
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const planted = new Date(
    plantingDate.getFullYear(),
    plantingDate.getMonth(),
    plantingDate.getDate()
  );

  const difference =
    today.getTime() -
    planted.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
}


// =========================================================
// FARM → FORM
// =========================================================

function farmToForm(farm, currentForm) {
  if (!farm) {
    return currentForm;
  }

  const location = normalizeLocation(
    farm.location ??
    farm.mapLocation ??
    farm.fieldLocation ??
    farm
  );

  return {
    ...currentForm,

    farmId: String(
      farm.id ??
      currentForm.farmId ??
      ""
    ),

    cultivationType:
      farm.cultivationType ??
      currentForm.cultivationType ??
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
      farm.notes ??
      currentForm.notes ??
      "",
  };
}


// =========================================================
// COMPONENT
// =========================================================

export default function Crops() {
  const navigate = useNavigate();

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
      searchParams.get("farmId") ??
      ""
    ).trim();

  const {
    farm: loadedFarm,
    loading: farmLoading,
  } = useFarm(
    selectedFarmId || null
  );

  const selectedFarm = useMemo(() => {
    if (loadedFarm) {
      return loadedFarm;
    }

    return farms.find(
      (farm) =>
        String(farm?.id ?? "").trim() ===
        selectedFarmId
    ) || null;
  }, [
    loadedFarm,
    farms,
    selectedFarmId,
  ]);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [mapLocation, setMapLocation] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // =======================================================
  // INITIAL FARM FROM URL
  // =======================================================

  useEffect(() => {
    if (!selectedFarmId) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      farmId: selectedFarmId,
    }));
  }, [
    selectedFarmId,
  ]);


  // =======================================================
  // LOAD FARM DATA INTO FORM
  // =======================================================

  useEffect(() => {
    if (!selectedFarm) {
      return;
    }

    setForm((previous) =>
      farmToForm(
        selectedFarm,
        {
          ...EMPTY_FORM,
          ...previous,
          farmId: selectedFarmId,
        }
      )
    );
  }, [
    selectedFarm,
    selectedFarmId,
  ]);


  // =======================================================
  // LOAD SAVED FARM LOCATION
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
          normalizeLocation(location);

        if (normalized) {
          setMapLocation(normalized);

          setForm((previous) => ({
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

  const climate = useMemo(() => {
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
  // SELECTED FARM CROPS ONLY
  // =======================================================

  const selectedFarmCrops =
    useMemo(() => {
      if (!selectedFarmId) {
        return [];
      }

      return crops.filter(
        (crop) =>
          String(
            crop?.farmId ?? ""
          ).trim() === selectedFarmId
      );
    }, [
      crops,
      selectedFarmId,
    ]);


  // =======================================================
  // INPUT CHANGE
  // =======================================================

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
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
      setForm(EMPTY_FORM);
      setMapLocation(null);
      setMessage("");
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
  }


  // =======================================================
  // CULTIVATION TYPE
  // =======================================================

  function handleCultivationType(
    event
  ) {
    const cultivationType =
      event.target.value;

    setForm((previous) => ({
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
  // REFRESH MAP LOCATION
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
        normalizeLocation(location);

      if (!normalized) {
        setMapLocation(null);

        setMessage(
          "لا يوجد موقع محفوظ لهذه المزرعة"
        );

        return;
      }

      setMapLocation(normalized);

      setForm((previous) => ({
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
        form.name ??
        form.treeType ??
        ""
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

    setSaving(true);

    try {
      const payload = {
        ...form,

        id: undefined,

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

        /*
         * مهم:
         * تاريخ الزراعة يبقى كما أدخله المستخدم
         * ولا يتم تحويله إلى تاريخ اليوم.
         */
        plantingDate:
          String(
            form.plantingDate ?? ""
          ).trim(),

        harvestDate:
          String(
            form.harvestDate ?? ""
          ).trim(),

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

      delete payload.id;

      await addCrop(payload);

      setMessage(
        "تم حفظ المحصول بنجاح"
      );

      setForm((previous) => ({
        ...EMPTY_FORM,

        farmId:
          selectedFarmId,

        cultivationType:
          previous.cultivationType,

        latitude,

        longitude,

        boundary:
          mapLocation?.boundary ??
          previous.boundary ??
          [],

        climate,

        recommendedSeeds,
      }));
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
    if (!id) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteCrop(id);

      setMessage(
        "تم حذف المحصول"
      );
    } catch (error) {
      setMessage(
        error?.message ||
        "تعذر حذف المحصول"
      );
    } finally {
      setDeletingId(null);
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

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="crops-header">
        <h1>
          🌱 المحاصيل
        </h1>
      </header>


      {/* =================================================
          STATUS
      ================================================= */}

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
          1 — FARM
      ================================================= */}

      <section className="crops-section">

        <h2>
          1. المزرعة
        </h2>

        <select
          value={selectedFarmId}
          onChange={handleFarmChange}
          disabled={farmsLoading}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name ||
                farm.farmName ||
                `مزرعة ${farm.id}`}
            </option>
          ))}
        </select>

      </section>


      {/* =================================================
          SELECTED FARM
      ================================================= */}

      {selectedFarm && (
        <section className="crops-section">

          <h2>
            🏡 المزرعة المختارة
          </h2>

          <div>
            <strong>
              {selectedFarm.name ||
                selectedFarm.farmName ||
                "المزرعة"}
            </strong>
          </div>

          {selectedFarm.status && (
            <div>
              <strong>
                status:
              </strong>{" "}
              {selectedFarm.status}
            </div>
          )}

          {farmLoading && (
            <div>
              جاري تحميل بيانات المزرعة...
            </div>
          )}

        </section>
      )}


      {/* =================================================
          2 — CULTIVATION TYPE
      ================================================= */}

      <section className="crops-section">

        <h2>
          2. نوع المحصول
        </h2>

        <select
          name="cultivationType"
          value={
            form.cultivationType
          }
          onChange={
            handleCultivationType
          }
        >
          {CULTIVATION_TYPES.map(
            (type) => (
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


      {/* =================================================
          3 — FARM LOCATION
      ================================================= */}

      <section className="crops-section">

        <h2>
          3. موقع المزرعة
        </h2>

        {mapLocation ? (
          <div>
            <strong>
              📍 تم تحديد موقع الأرض
            </strong>

            <p>
              خط العرض:{" "}
              {mapLocation.latitude}
            </p>

            <p>
              خط الطول:{" "}
              {mapLocation.longitude}
            </p>
          </div>
        ) : (
          <div>
            لم يتم تحديد موقع الأرض
          </div>
        )}

        <div className="crops-actions">

          <button
            type="button"
            onClick={
              chooseMapLocation
            }
          >
            📍 تعديل الموقع
          </button>

          <button
            type="button"
            onClick={
              refreshMapLocation
            }
          >
            🔄 تحميل موقع المزرعة
          </button>

        </div>

      </section>


      {/* =================================================
          CLIMATE
      ================================================= */}

      {climate && (
        <section className="crops-section">

          <h2>
            🌤️ المناخ
          </h2>

          <p>
            {climate}
          </p>

          {recommendedSeeds.length > 0 && (
            <p>
              المحاصيل الموصى بها:{" "}
              {recommendedSeeds.join(
                "، "
              )}
            </p>
          )}

        </section>
      )}


      {/* =================================================
          4 — CROP DATA
      ================================================= */}

      <section className="crops-section">

        <h2>
          4. بيانات المحصول
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* =============================================
              TREE
          ============================================= */}

          {form.cultivationType ===
            "trees" ? (
            <>
              <label>
                نوع الشجرة

                <input
                  type="text"
                  name="treeType"
                  value={
                    form.treeType
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              <label>
                صنف الشجرة

                <input
                  type="text"
                  name="treeVariety"
                  value={
                    form.treeVariety
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>
            </>
          ) : (
            <>
              {/* =========================================
                  CROP NAME
              ========================================= */}

              <label>
                اسم المحصول

                <input
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              {/* =========================================
                  SEED TYPE
              ========================================= */}

              <label>
                نوع البذار

                <input
                  type="text"
                  name="seedType"
                  value={
                    form.seedType
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              {/* =========================================
                  SEED VARIETY
              ========================================= */}

              <label>
                صنف البذار

                <input
                  type="text"
                  name="seedVariety"
                  value={
                    form.seedVariety
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              {/* =========================================
                  SEED QUALITY
              ========================================= */}

              <label>
                جودة البذار

                <input
                  type="text"
                  name="seedQuality"
                  value={
                    form.seedQuality
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              {/* =========================================
                  SEED QUANTITY
              ========================================= */}

              <label>
                كمية البذار

                <input
                  type="number"
                  name="seedQuantity"
                  value={
                    form.seedQuantity
                  }
                  onChange={
                    handleChange
                  }
                  inputMode="decimal"
                />
              </label>
            </>
          )}


          {/* =============================================
              PLANTING DATE
              هذا هو حقل التاريخ الأول فقط
          ============================================= */}

          <label>
            تاريخ الزراعة

            <input
              type="date"
              name="plantingDate"
              value={
                form.plantingDate || ""
              }
              onChange={
                handleChange
              }
            />
          </label>


          {/* =============================================
              FERTILIZER TYPE
              مهم جداً:
              هذا SELECT وليس DATE
          ============================================= */}

          <label>
            نوع السماد

            <select
              id="fertilizerType"
              name="fertilizerType"
              value={
                form.fertilizerType || ""
              }
              onChange={
                handleChange
              }
              autoComplete="off"
            >
              <option value="">
                اختر نوع السماد
              </option>

              {FERTILIZERS.map(
                (fertilizer) => (
                  <option
                    key={fertilizer}
                    value={fertilizer}
                  >
                    {fertilizer}
                  </option>
                )
              )}
            </select>
          </label>


          {/* =============================================
              FERTILIZER QUANTITY
          ============================================= */}

          <label>
            كمية السماد

            <input
              type="number"
              name="fertilizerQuantity"
              value={
                form.fertilizerQuantity
              }
              onChange={
                handleChange
              }
              inputMode="decimal"
            />
          </label>


          {/* =============================================
              HARVEST DATE
              هذا هو حقل التاريخ الثاني والأخير
          ============================================= */}

          <label>
            تاريخ الحصاد

            <input
              type="date"
              name="harvestDate"
              value={
                form.harvestDate || ""
              }
              onChange={
                handleChange
              }
            />
          </label>


          {/* =============================================
              NOTES
          ============================================= */}

          <label>
            ملاحظات

            <textarea
              name="notes"
              value={
                form.notes || ""
              }
              onChange={
                handleChange
              }
              autoComplete="off"
            />
          </label>


          {/* =============================================
              SAVE
          ============================================= */}

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "جاري الحفظ..."
              : "💾 حفظ المحصول"}
          </button>

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
        ) : selectedFarmCrops.length ===
          0 ? (
          <p>
            لا توجد محاصيل مسجلة لهذه
            المزرعة
          </p>
        ) : (
          <div className="crops-list">

            {selectedFarmCrops.map(
              (crop) => {

                const cropName =
                  crop.name ||
                  crop.treeType ||
                  "محصول";

                const farmName =
                  selectedFarm?.name ||
                  selectedFarm?.farmName ||
                  "المزرعة";

                return (
                  <article
                    key={crop.id}
                    className="crop-card"
                  >

                    <h3>
                      {cropName}
                    </h3>

                    <p>
                      المزرعة:{" "}
                      {farmName}
                    </p>

                    {crop.plantingDate && (
                      <p>
                        تاريخ الزراعة:{" "}
                        {crop.plantingDate}
                      </p>
                    )}

                    {crop.plantingDate && (
                      <p>
                        العمر:{" "}
                        {calculateAge(
                          crop.plantingDate
                        )}{" "}
                        يوم
                      </p>
                    )}

                    {Number.isFinite(
                      Number(
                        crop.latitude
                      )
                    ) &&
                    Number.isFinite(
                      Number(
                        crop.longitude
                      )
                    ) &&
                    !(
                      Number(
                        crop.latitude
                      ) === 0 &&
                      Number(
                        crop.longitude
                      ) === 0
                    ) && (
                      <p>
                        الموقع:{" "}
                        {crop.latitude},{" "}
                        {crop.longitude}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        crop.id
                      }
                      onClick={() =>
                        handleDelete(
                          crop.id
                        )
                      }
                    >
                      {deletingId ===
                      crop.id
                        ? "جاري الحذف..."
                        : "🗑️ حذف"}
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
