// src/pages/Crops.jsx

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
// EMPTY CROP
// =========================================================

const EMPTY = {
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

  latitude: null,
  longitude: null,
  boundary: [],

  climate: "",
  recommendedSeeds: [],

  notes: "",
};


// =========================================================
// CULTIVATION TYPES
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
// CLIMATE
// =========================================================

function getClimate(latitude) {

  const lat =
    Number(latitude);

  if (!Number.isFinite(lat)) {
    return "";
  }

  const absolute =
    Math.abs(lat);

  if (absolute >= 50) {
    return "باردة";
  }

  if (absolute >= 25) {
    return "معتدلة";
  }

  return "حارة";
}


// =========================================================
// RECOMMENDED SEEDS
// =========================================================

function getRecommendedSeeds(
  latitude,
  type
) {

  const climate =
    getClimate(latitude);

  if (!climate) {
    return [];
  }

  if (type === "trees") {

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
      "نخيل",
      "زيتون",
      "رمان",
    ];
  }

  if (type === "field") {

    if (climate === "حارة") {
      return [
        "ذرة",
        "دخن",
        "سورغم",
        "سمسم",
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
      "قمح",
      "شعير",
      "شوفان",
    ];
  }

  if (type === "vegetables") {

    if (climate === "حارة") {
      return [
        "طماطم",
        "باذنجان",
        "فلفل",
        "بامية",
      ];
    }

    if (climate === "معتدلة") {
      return [
        "طماطم",
        "خيار",
        "كوسا",
        "بصل",
      ];
    }

    return [
      "بطاطا",
      "ملفوف",
      "بصل",
      "بازلاء",
    ];
  }

  return [];
}


// =========================================================
// DATE AGE
// =========================================================

function calculateAge(date) {

  if (!date) {
    return "";
  }

  const start =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      start.getTime()
    )
  ) {
    return "";
  }

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  if (start > today) {
    return "0 يوم";
  }

  const difference =
    today.getTime() -
    start.getTime();

  const days =
    Math.floor(
      difference /
      86400000
    );

  if (days < 30) {
    return `${days} يوم`;
  }

  const months =
    Math.floor(
      days / 30.4375
    );

  if (months < 12) {
    return `${months} شهر`;
  }

  const years =
    Math.floor(
      months / 12
    );

  const remainingMonths =
    months % 12;

  if (!remainingMonths) {
    return `${years} سنة`;
  }

  return `${years} سنة و${remainingMonths} شهر`;
}


// =========================================================
// NUMBER
// =========================================================

function numberOrEmpty(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  return Number.isFinite(
    Number(value)
  )
    ? Number(value)
    : "";
}


// =========================================================
// LOCATION NORMALIZATION
// =========================================================

function normalizeLocation(
  location
) {

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

  const boundary =
    Array.isArray(
      location.boundary
    )
      ? location.boundary
      : Array.isArray(
          location.points
        )
        ? location.points
        : [];

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    ...location,

    latitude,
    longitude,

    boundary,

    points:
      boundary,
  };
}


// =========================================================
// FARM ID
// =========================================================

function normalizeFarmId(
  value
) {

  return String(
    value ?? ""
  ).trim();
}


// =========================================================
// FARM DATA → FORM
// =========================================================

function farmToForm(
  farm,
  currentForm
) {

  if (
    !farm ||
    typeof farm !== "object"
  ) {
    return {
      ...EMPTY,
      farmId:
        currentForm.farmId,
      cultivationType:
        currentForm.cultivationType ||
        "field",
    };
  }

  /*
   * مهم:
   * بيانات المزرعة يتم استخدامها
   * لتعبئة الحقول المشتركة الموجودة
   * في نموذج المحصول فقط.
   *
   * لا نأخذ plantingDate من المزرعة.
   * تاريخ الزراعة يخص المحصول.
   */

  return {
    ...EMPTY,

    farmId:
      normalizeFarmId(
        farm.id
      ),

    cultivationType:
      currentForm.cultivationType ||
      "field",

    latitude:
      Number.isFinite(
        Number(
          farm.latitude ??
          farm.lat
        )
      )
        ? Number(
            farm.latitude ??
            farm.lat
          )
        : null,

    longitude:
      Number.isFinite(
        Number(
          farm.longitude ??
          farm.lng ??
          farm.lon
        )
      )
        ? Number(
            farm.longitude ??
            farm.lng ??
            farm.lon
          )
        : null,

    boundary:
      Array.isArray(
        farm.boundary
      )
        ? farm.boundary
        : Array.isArray(
            farm.points
          )
          ? farm.points
          : [],

    notes:
      String(
        farm.notes ??
        ""
      ).trim(),
  };
}


// =========================================================
// DISPLAY VALUE
// =========================================================

function displayValue(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    return "";
  }

  return String(value);
}


// =========================================================
// COMPONENT
// =========================================================

export default function Crops() {

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const {
    farms = [],
  } =
    useFarms();

  const {
    crops = [],
    loading,
    error,
    addCrop,
    deleteCrop,
  } =
    useCrops();

  const [
    form,
    setForm,
  ] =
    useState(EMPTY);

  const [
    mapLocation,
    setMapLocation,
  ] =
    useState(null);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);


  // =======================================================
  // FARM FROM URL
  // =======================================================

  const farmIdFromUrl =
    normalizeFarmId(
      searchParams.get(
        "farmId"
      )
    );


  // =======================================================
  // SELECTED FARM ID
  // =======================================================

  const selectedFarmId =
    normalizeFarmId(
      form.farmId
    );


  // =======================================================
  // LOAD SELECTED FARM
  // =======================================================

  const {
    farm:
      loadedFarm,
    loading:
      selectedFarmLoading,
  } =
    useFarm(
      selectedFarmId ||
      null
    );


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarm =
    useMemo(
      () => {

        if (loadedFarm) {
          return loadedFarm;
        }

        return farms.find(
          farm =>
            normalizeFarmId(
              farm?.id
            ) ===
            selectedFarmId
        ) || null;

      },
      [
        loadedFarm,
        farms,
        selectedFarmId,
      ]
    );


  // =======================================================
  // INITIAL FARM FROM URL
  // =======================================================

  useEffect(() => {

    if (!farmIdFromUrl) {
      return;
    }

    setForm(
      current => {

        if (
          normalizeFarmId(
            current.farmId
          ) ===
          farmIdFromUrl
        ) {
          return current;
        }

        return {
          ...EMPTY,

          farmId:
            farmIdFromUrl,

          cultivationType:
            current.cultivationType ||
            "field",
        };
      }
    );

  }, [
    farmIdFromUrl,
  ]);


  // =======================================================
  // FARM CHANGE
  // =======================================================

  useEffect(() => {

    if (!selectedFarmId) {

      setMapLocation(null);

      return;
    }


    /*
     * عند تغيير المزرعة:
     * لا نسمح ببقاء بيانات المزرعة السابقة.
     */

    setMessage("");

    setMapLocation(null);


    /*
     * أولًا نضع بيانات المزرعة
     * نفسها داخل النموذج.
     */

    if (selectedFarm) {

      setForm(
        current =>
          farmToForm(
            selectedFarm,
            {
              ...current,
              farmId:
                selectedFarmId,
            }
          )
      );
    }


    /*
     * ثم نحاول تحميل موقع المزرعة
     * المحفوظ بواسطة mapService.
     */

    let cancelled = false;

    (async () => {

      try {

        const location =
          await mapService
            .getLocationByFarmId(
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

          setForm(
            current => ({
              ...current,

              farmId:
                selectedFarmId,

              latitude:
                normalized.latitude,

              longitude:
                normalized.longitude,

              boundary:
                normalized.boundary ||
                [],
            })
          );
        }

      } catch (err) {

        console.error(
          "Farm location loading failed:",
          err
        );

      }

    })();


    return () => {
      cancelled = true;
    };

  }, [
    selectedFarmId,
    selectedFarm,
  ]);


  // =======================================================
  // MAP LOCATION
  // =======================================================

  const refreshMapLocation =
    async () => {

      if (!selectedFarmId) {

        setMessage(
          "اختر المزرعة أولًا"
        );

        return;
      }

      try {

        setMessage("");

        const location =
          await mapService
            .getLocationByFarmId(
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

        setForm(
          current => ({
            ...current,

            farmId:
              selectedFarmId,

            latitude:
              normalized.latitude,

            longitude:
              normalized.longitude,

            boundary:
              normalized.boundary ||
              [],
          })
        );

        setMessage(
          "تم تحميل موقع المزرعة"
        );

      } catch (err) {

        console.error(err);

        setMessage(
          "تعذر تحميل موقع المزرعة"
        );
      }
    };


  // =======================================================
  // CHANGE
  // =======================================================

  const handleChange =
    event => {

      const {
        name,
        value,
      } =
        event.target;


      // -----------------------------------------------------
      // FARM CHANGE
      // -----------------------------------------------------

      if (name === "farmId") {

        const farmId =
          normalizeFarmId(
            value
          );

        setMessage("");

        setMapLocation(null);

        setForm({
          ...EMPTY,

          farmId,

          cultivationType:
            form.cultivationType ||
            "field",
        });

        return;
      }


      // -----------------------------------------------------
      // NORMAL FIELD
      // -----------------------------------------------------

      setForm(
        current => ({
          ...current,

          [name]:
            value,
        })
      );
    };


  // =======================================================
  // MAP
  // =======================================================

  const chooseMapLocation =
    () => {

      if (!selectedFarmId) {

        setMessage(
          "اختر المزرعة أولًا"
        );

        return;
      }

      navigate(
        `/map?return=crops&farmId=${encodeURIComponent(
          selectedFarmId
        )}`
      );
    };


  // =======================================================
  // CLIMATE
  // =======================================================

  const climate =
    useMemo(
      () =>
        getClimate(
          mapLocation?.latitude ??
          form.latitude
        ),
      [
        mapLocation,
        form.latitude,
      ]
    );


  // =======================================================
  // RECOMMENDATIONS
  // =======================================================

  const recommendedSeeds =
    useMemo(
      () =>
        getRecommendedSeeds(
          mapLocation?.latitude ??
          form.latitude,
          form.cultivationType
        ),
      [
        mapLocation,
        form.latitude,
        form.cultivationType,
      ]
    );


  // =======================================================
  // AGE
  // =======================================================

  const plantingAge =
    calculateAge(
      form.plantingDate
    );


  // =======================================================
  // SELECTED FARM CROPS
  // =======================================================

  const selectedFarmCrops =
    useMemo(
      () => {

        if (!selectedFarmId) {
          return [];
        }

        return crops.filter(
          crop =>
            normalizeFarmId(
              crop?.farmId
            ) ===
            selectedFarmId
        );

      },
      [
        crops,
        selectedFarmId,
      ]
    );


  // =======================================================
  // SAVE
  // =======================================================

  const handleSave =
    async event => {

      event.preventDefault();

      setMessage("");


      if (!selectedFarmId) {

        setMessage(
          "اختر المزرعة أولًا"
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
        !Number.isFinite(
          latitude
        ) ||
        !Number.isFinite(
          longitude
        )
      ) {

        setMessage(
          "يجب تحديد موقع المزرعة على الخريطة"
        );

        return;
      }


      /*
       * مهم جدًا:
       *
       * لا نستخدم new Date()
       * لإنشاء plantingDate.
       *
       * نأخذ القيمة من input كما أدخلها المستخدم.
       */

      const plantingDate =
        String(
          form.plantingDate ??
          ""
        ).trim();


      if (!plantingDate) {

        setMessage(
          "أدخل تاريخ الزراعة"
        );

        return;
      }


      if (
        form.cultivationType ===
        "trees"
      ) {

        if (
          !String(
            form.treeType ??
            ""
          ).trim()
        ) {

          setMessage(
            "أدخل نوع الشجرة"
          );

          return;
        }

      } else {

        if (
          !String(
            form.name ??
            ""
          ).trim()
        ) {

          setMessage(
            "أدخل اسم المحصول"
          );

          return;
        }
      }


      /*
       * نُنشئ نسخة مستقلة من بيانات
       * المزرعة المختارة.
       *
       * ولا نسمح لأي farmId آخر
       * بالدخول إلى السجل.
       */

      const payload = {

        ...form,

        farmId:
          selectedFarmId,

        name:
          String(
            form.name ??
            ""
          ).trim(),

        treeType:
          String(
            form.treeType ??
            ""
          ).trim(),

        treeVariety:
          String(
            form.treeVariety ??
            ""
          ).trim(),

        seedType:
          String(
            form.seedType ??
            ""
          ).trim(),

        seedVariety:
          String(
            form.seedVariety ??
            ""
          ).trim(),

        seedQuality:
          String(
            form.seedQuality ??
            ""
          ).trim(),

        seedQuantity:
          numberOrEmpty(
            form.seedQuantity
          ),

        fertilizerType:
          String(
            form.fertilizerType ??
            ""
          ).trim(),

        fertilizerQuantity:
          numberOrEmpty(
            form.fertilizerQuantity
          ),

        expectedProduction:
          numberOrEmpty(
            form.expectedProduction
          ),

        /*
         * التاريخ الذي أدخله المستخدم
         * حرفيًا.
         */
        plantingDate,

        harvestDate:
          String(
            form.harvestDate ??
            ""
          ).trim(),

        latitude,

        longitude,

        boundary:
          mapLocation?.boundary ??
          form.boundary ??
          [],

        climate,

        recommendedSeeds,

        notes:
          String(
            form.notes ??
            ""
          ).trim(),
      };


      try {

        setSaving(true);

        const saved =
          await addCrop(
            payload
          );


        if (!saved) {
          throw new Error(
            "CROP_SAVE_FAILED"
          );
        }


        /*
         * بعد الحفظ:
         * نبدأ نموذج محصول جديد
         * لكن نبقي المزرعة المختارة.
         */

        setForm(
          current => ({
            ...EMPTY,

            farmId:
              selectedFarmId,

            cultivationType:
              current.cultivationType ||
              "field",

            latitude,

            longitude,

            boundary:
              mapLocation?.boundary ??
              [],
          })
        );


        setMessage(
          "تم حفظ المحصول بنجاح"
        );

      } catch (err) {

        console.error(
          "Crop save failed:",
          err
        );

        setMessage(
          err?.message ||
          "تعذر حفظ المحصول"
        );

      } finally {

        setSaving(false);
      }
    };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete =
    async id => {

      if (!id) {
        return;
      }

      try {

        await deleteCrop(id);

        setMessage(
          "تم حذف المحصول"
        );

      } catch (err) {

        console.error(
          err
        );

        setMessage(
          "تعذر حذف المحصول"
        );
      }
    };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      dir="rtl"
      style={{
        padding: "16px",
      }}
    >

      <h1>
        🌱 المحاصيل
      </h1>


      {/* ================================================= */}
      {/* FARM */}
      {/* ================================================= */}

      <section>

        <h2>
          1. المزرعة
        </h2>

        <select
          name="farmId"
          value={selectedFarmId}
          onChange={handleChange}
          disabled={
            selectedFarmLoading
          }
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
                {farm.name ??
                 farm.farmName ??
                 "مزرعة"}
              </option>

            )
          )}

        </select>

      </section>


      {/* ================================================= */}
      {/* SELECTED FARM DATA */}
      {/* ================================================= */}

      {selectedFarm && (

        <section
          style={{
            marginTop: "16px",
          }}
        >

          <h2>
            🏡 المزرعة المختارة
          </h2>

          <strong>
            {
              selectedFarm.name ??
              selectedFarm.farmName ??
              "مزرعة"
            }
          </strong>


          <div
            style={{
              marginTop: "10px",
            }}
          >

            {Object.entries(
              selectedFarm
            )
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "name",
                    "farmName",
                    "createdAt",
                    "updatedAt",
                  ].includes(key)
              )
              .map(
                ([key, value]) => {

                  const text =
                    displayValue(
                      value
                    );

                  if (!text) {
                    return null;
                  }

                  return (
                    <div
                      key={key}
                    >
                      <strong>
                        {key}:
                      </strong>{" "}
                      {text}
                    </div>
                  );
                }
              )}

          </div>

        </section>
      )}


      {/* ================================================= */}
      {/* CULTIVATION */}
      {/* ================================================= */}

      {selectedFarmId && (

        <section
          style={{
            marginTop: "16px",
          }}
        >

          <h2>
            2. نوع المحصول
          </h2>

          <select
            name="cultivationType"
            value={
              form.cultivationType
            }
            onChange={
              handleChange
            }
          >

            {TYPES.map(
              type => (

                <option
                  key={
                    type.value
                  }
                  value={
                    type.value
                  }
                >
                  {type.label}
                </option>

              )
            )}

          </select>

        </section>
      )}


      {/* ================================================= */}
      {/* LOCATION */}
      {/* ================================================= */}

      {selectedFarmId && (

        <section
          style={{
            marginTop: "16px",
          }}
        >

          <h2>
            3. موقع المزرعة
          </h2>


          {mapLocation ? (

            <div>

              <p>
                📍 تم تحديد موقع الأرض
              </p>

              <p>
                خط العرض:{" "}
                {mapLocation.latitude}
              </p>

              <p>
                خط الطول:{" "}
                {mapLocation.longitude}
              </p>

              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
              >
                تعديل الموقع
              </button>

            </div>

          ) : (

            <button
              type="button"
              onClick={
                chooseMapLocation
              }
            >
              📍 تحديد موقع المزرعة
            </button>

          )}


          <button
            type="button"
            onClick={
              refreshMapLocation
            }
            style={{
              marginRight: "8px",
            }}
          >
            🔄 تحميل موقع المزرعة
          </button>

        </section>
      )}


      {/* ================================================= */}
      {/* CLIMATE */}
      {/* ================================================= */}

      {selectedFarmId && climate && (

        <section
          style={{
            marginTop: "16px",
          }}
        >

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


      {/* ================================================= */}
      {/* CROP FORM */}
      {/* ================================================= */}

      {selectedFarmId && (

        <form
          onSubmit={
            handleSave
          }
          style={{
            marginTop: "16px",
          }}
        >

          <h2>
            4. بيانات المحصول
          </h2>


          {/* TREE */}

          {form.cultivationType ===
          "trees" ? (

            <>
              <label>
                نوع الشجرة
              </label>

              <input
                name="treeType"
                value={
                  form.treeType
                }
                onChange={
                  handleChange
                }
                required
              />


              <label>
                صنف الشجرة
              </label>

              <input
                name="treeVariety"
                value={
                  form.treeVariety
                }
                onChange={
                  handleChange
                }
              />
            </>

          ) : (

            <>
              <label>
                اسم المحصول
              </label>

              <input
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                required
              />


              <label>
                نوع البذار
              </label>

              <input
                name="seedType"
                value={
                  form.seedType
                }
                onChange={
                  handleChange
                }
              />


              <label>
                صنف البذار
              </label>

              <input
                name="seedVariety"
                value={
                  form.seedVariety
                }
                onChange={
                  handleChange
                }
              />


              <label>
                جودة البذار
              </label>

              <input
                name="seedQuality"
                value={
                  form.seedQuality
                }
                onChange={
                  handleChange
                }
              />


              <label>
                كمية البذار
              </label>

              <input
                type="number"
                name="seedQuantity"
                value={
                  form.seedQuantity
                }
                onChange={
                  handleChange
                }
              />
            </>
          )}


          {/* ================================================= */}
          {/* PLANTING DATE */}
          {/* ================================================= */}

          <label>
            تاريخ الزراعة
          </label>

          <input
            type="date"
            name="plantingDate"
            value={
              form.plantingDate
            }
            onChange={
              handleChange
            }
            required
          />


          {plantingAge && (

            <p>
              عمر المحصول:{" "}
              {plantingAge}
            </p>

          )}


          {/* ================================================= */}
          {/* FERTILIZER */}
          {/* ================================================= */}

          <label>
            نوع السماد
          </label>

          <input
            name="fertilizerType"
            value={
              form.fertilizerType
            }
            onChange={
              handleChange
            }
          />


          <label>
            كمية السماد
          </label>

          <input
            type="number"
            name="fertilizerQuantity"
            value={
              form.fertilizerQuantity
            }
            onChange={
              handleChange
            }
          />


          {/* ================================================= */}
          {/* HARVEST */}
          {/* ================================================= */}

          <label>
            تاريخ الحصاد
          </label>

          <input
            type="date"
            name="harvestDate"
            value={
              form.harvestDate
            }
            onChange={
              handleChange
            }
          />


          <label>
            الإنتاج المتوقع
          </label>

          <input
            type="number"
            name="expectedProduction"
            value={
              form.expectedProduction
            }
            onChange={
              handleChange
            }
          />


          {/* ================================================= */}
          {/* NOTES */}
          {/* ================================================= */}

          <label>
            ملاحظات
          </label>

          <textarea
            name="notes"
            value={
              form.notes
            }
            onChange={
              handleChange
            }
          />


          {/* ================================================= */}
          {/* MESSAGE */}
          {/* ================================================= */}

          {(message || error) && (

            <p>
              {message ||
               error}
            </p>

          )}


          {/* ================================================= */}
          {/* SAVE */}
          {/* ================================================= */}

          <button
            type="submit"
            disabled={
              saving ||
              loading ||
              selectedFarmLoading
            }
          >
            {saving
              ? "جارٍ الحفظ..."
              : "💾 حفظ المحصول"}
          </button>

        </form>
      )}


      {/* ================================================= */}
      {/* FARM CROPS */}
      {/* ================================================= */}

      {selectedFarmId && (

        <section
          style={{
            marginTop: "24px",
          }}
        >

          <h2>
            🌱 محاصيل المزرعة
          </h2>


          {selectedFarmCrops.length === 0 ? (

            <p>
              لا توجد محاصيل مسجلة لهذه المزرعة.
            </p>

          ) : (

            selectedFarmCrops.map(
              crop => (

                <article
                  key={crop.id}
                  style={{
                    border:
                      "1px solid #ddd",
                    padding: "12px",
                    marginBottom:
                      "10px",
                  }}
                >

                  <h3>
                    {crop.treeType ||
                     crop.name ||
                     "محصول"}
                  </h3>


                  <p>
                    المزرعة:{" "}
                    {
                      selectedFarm.name ??
                      selectedFarm.farmName ??
                      "مزرعة"
                    }
                  </p>


                  <p>
                    تاريخ الزراعة:{" "}
                    {
                      crop.plantingDate ||
                      "غير محدد"
                    }
                  </p>


                  {crop.plantingDate && (

                    <p>
                      العمر:{" "}
                      {
                        calculateAge(
                          crop.plantingDate
                        )
                      }
                    </p>

                  )}


                  {crop.climate && (

                    <p>
                      المناخ:{" "}
                      {crop.climate}
                    </p>

                  )}


                  {Number.isFinite(
                    crop.latitude
                  ) &&
                  Number.isFinite(
                    crop.longitude
                  ) && (

                    <p>
                      الموقع:{" "}
                      {crop.latitude}
                      {" / "}
                      {crop.longitude}
                    </p>

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

              )
            )
          )}

        </section>
      )}

    </div>
  );
}
