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
// EMPTY
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
// AGE
// =========================================================

function calculateAge(date) {

  if (!date) {
    return "";
  }

  /*
   * التاريخ القادم من input type=date
   * يكون بصيغة:
   *
   * YYYY-MM-DD
   *
   * ولا نقوم بتحويله إلى ISO
   * أو تغيير قيمته.
   */

  const parts =
    String(date).split("-");

  if (parts.length !== 3) {
    return "";
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return "";
  }

  const start =
    new Date(
      year,
      month - 1,
      day
    );

  start.setHours(
    0,
    0,
    0,
    0
  );

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

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : "";
}


// =========================================================
// FARM ID
// =========================================================

function normalizeFarmId(value) {

  return String(
    value ?? ""
  ).trim();
}


// =========================================================
// LOCATION
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
    points: boundary,
  };
}


// =========================================================
// FARM → FORM
// =========================================================

function farmToForm(
  farm,
  currentForm
) {

  if (!farm) {

    return {
      ...EMPTY,

      farmId:
        currentForm.farmId,

      cultivationType:
        currentForm.cultivationType ||
        "field",
    };
  }

  const latitude =
    Number(
      farm.latitude ??
      farm.lat
    );

  const longitude =
    Number(
      farm.longitude ??
      farm.lng ??
      farm.lon
    );

  const boundary =
    Array.isArray(
      farm.boundary
    )
      ? farm.boundary
      : Array.isArray(
          farm.points
        )
        ? farm.points
        : [];

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
      Number.isFinite(latitude)
        ? latitude
        : null,

    longitude:
      Number.isFinite(longitude)
        ? longitude
        : null,

    boundary,

    notes:
      String(
        farm.notes ??
        ""
      ).trim(),
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
  // URL FARM
  // =======================================================

  const farmIdFromUrl =
    normalizeFarmId(
      searchParams.get(
        "farmId"
      )
    );


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarmId =
    normalizeFarmId(
      form.farmId
    );


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
  // URL FARM
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
            "field",
        };
      }
    );

  }, [
    farmIdFromUrl,
  ]);


  // =======================================================
  // LOAD FARM + LOCATION
  // =======================================================

  useEffect(() => {

    if (!selectedFarmId) {

      setMapLocation(null);

      return;
    }


    setMessage("");
    setMapLocation(null);


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


        if (!normalized) {
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
  // CHANGE
  // =======================================================

  const handleChange =
    event => {

      const {
        name,
        value,
      } =
        event.target;


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
            "field",
        });


        return;
      }


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


  const refreshMapLocation =
    async () => {

      if (!selectedFarmId) {

        setMessage(
          "اختر المزرعة أولًا"
        );

        return;
      }


      try {

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


  const plantingAge =
    calculateAge(
      form.plantingDate
    );


  // =======================================================
  // ONLY SELECTED FARM
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
       * التاريخ يؤخذ كما هو
       * من input.
       *
       * لا new Date()
       * لا toISOString()
       * لا تاريخ اليوم.
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

        /*
         * التاريخ الأصلي فقط.
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
          value={
            selectedFarmId
          }
          onChange={
            handleChange
          }
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
                key={
                  farm.id
                }
                value={
                  farm.id
                }
              >
                {
                  farm.name ??
                  farm.farmName ??
                  "مزرعة"
                }
              </option>

            )
          )}

        </select>

      </section>


      {/* ================================================= */}
      {/* FARM */}
      {/* ================================================= */}

      {selectedFarm && (

        <section>

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

                if (
                  value === null ||
                  value === undefined ||
                  typeof value === "object" ||
                  String(value).trim() === ""
                ) {
                  return null;
                }

                return (

                  <div
                    key={key}
                  >

                    <strong>
                      {key}:
                    </strong>{" "}

                    {String(value)}

                  </div>

                );
              }
            )}

        </section>
      )}


      {/* ================================================= */}
      {/* TYPE */}
      {/* ================================================= */}

      {selectedFarmId && (

        <section>

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
                  {
                    type.label
                  }
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

        <section>

          <h2>
            3. موقع المزرعة
          </h2>


          {mapLocation ? (

            <>

              <p>
                📍 تم تحديد موقع الأرض
              </p>

              <p>
                خط العرض:{" "}
                {
                  mapLocation.latitude
                }
              </p>

              <p>
                خط الطول:{" "}
                {
                  mapLocation.longitude
                }
              </p>

              <button
                type="button"
                onClick={
                  chooseMapLocation
                }
              >
                تعديل الموقع
              </button>

            </>

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
          >
            🔄 تحميل موقع المزرعة
          </button>

        </section>
      )}


      {/* ================================================= */}
      {/* CLIMATE */}
      {/* ================================================= */}

      {selectedFarmId &&
      climate && (

        <section>

          <h2>
            🌤️ المناخ
          </h2>

          <p>
            {climate}
          </p>

          {recommendedSeeds.length > 0 && (

            <p>
              المحاصيل الموصى بها:{" "}
              {
                recommendedSeeds.join(
                  "، "
                )
              }
            </p>

          )}

        </section>
      )}


      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      {selectedFarmId && (

        <form
          onSubmit={
            handleSave
          }
        >

          <h2>
            4. بيانات المحصول
          </h2>


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
          />


          {plantingAge && (

            <p>
              عمر المحصول:{" "}
              {
                plantingAge
              }
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
              {
                message ||
                error
              }
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
            {
              saving
                ? "جارٍ الحفظ..."
                : "💾 حفظ المحصول"
            }
          </button>

        </form>
      )}


      {/* ================================================= */}
      {/* CROPS */}
      {/* ================================================= */}

      {selectedFarmId && (

        <section>

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
                  key={
                    crop.id
                  }
                >

                  <h3>
                    {
                      crop.treeType ||
                      crop.name ||
                      "محصول"
                    }
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
                      {
                        crop.climate
                      }
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
                      {
                        crop.latitude
                      }
                      {" / "}
                      {
                        crop.longitude
                      }
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
