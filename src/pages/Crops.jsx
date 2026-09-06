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
import { useFarms } from "../hooks/useFarms.js";
import { useCrops } from "../hooks/useCrops.js";
import { useFarm } from "../hooks/useFarm.js";


// =========================================================
// EMPTY FORM
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
// FIELD STYLE
// =========================================================

const FIELD_STYLE = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
  background: "#fff",
};


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
      "حمضيات",
    ];
  }

  if (type === "field") {
    if (climate === "باردة") {
      return [
        "قمح",
        "شعير",
        "بطاطا",
      ];
    }

    if (climate === "معتدلة") {
      return [
        "قمح",
        "ذرة",
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

  if (type === "vegetables") {
    if (climate === "باردة") {
      return [
        "ملفوف",
        "بروكلي",
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
      "فلفل",
      "بامية",
    ];
  }

  return [];
}


// =========================================================
// AGE CALCULATOR
// =========================================================

function calculateAge(date) {
  if (!date) {
    return "";
  }

  const planted =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      planted.getTime()
    )
  ) {
    return "";
  }

  const today =
    new Date();

  if (planted > today) {
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

  const result = [];

  if (years > 0) {
    result.push(
      `${years} سنة`
    );
  }

  if (months > 0) {
    result.push(
      `${months} شهر`
    );
  }

  if (
    days > 0 ||
    result.length === 0
  ) {
    result.push(
      `${days} يوم`
    );
  }

  return result.join(" و ");
}


// =========================================================
// NORMALIZE LOCATION
// =========================================================

function normalizeLocation(
  location
) {
  if (!location) {
    return null;
  }

  const latitude =
    Number(location.latitude);

  const longitude =
    Number(location.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,

    boundary:
      Array.isArray(location.boundary)
        ? location.boundary
        : Array.isArray(location.points)
          ? location.points
          : [],

    points:
      Array.isArray(location.points)
        ? location.points
        : Array.isArray(location.boundary)
          ? location.boundary
          : [],

    province:
      location.province ??
      location.governorate ??
      location.administrativeArea ??
      "",

    district:
      location.district ??
      "",

    village:
      location.village ??
      location.locality ??
      location.town ??
      "",
  };
}


// =========================================================
// SAFE VALUE
// =========================================================

function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
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
// PAGE
// =========================================================

export default function Crops() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const {
    farms = [],
    loading: farmsLoading,
  } = useFarms();

  const {
    crops = [],
    loading: cropsLoading,
    addCrop,
    deleteCrop,
  } = useCrops();


  const [
    form,
    setForm,
  ] = useState(EMPTY);


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
  // FARM FROM URL
  // =======================================================

  const farmIdFromUrl =
    searchParams.get(
      "farmId"
    );


  // =======================================================
  // SELECTED FARM ID
  // =======================================================

  const selectedFarmId =
    String(
      form.farmId ?? ""
    ).trim();


  // =======================================================
  // LOAD SELECTED FARM DATA
  // =======================================================

  const {
    farm: loadedFarm,
    loading: selectedFarmLoading,
  } = useFarm(
    selectedFarmId || null
  );


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarm =
    loadedFarm ||
    farms.find(
      farm =>
        String(
          farm?.id
        ) ===
        selectedFarmId
    ) ||
    null;


  // =======================================================
  // FARM FROM URL
  // =======================================================

  useEffect(() => {
    if (!farmIdFromUrl) {
      return;
    }

    setForm(current => ({
      ...current,

      farmId:
        String(
          farmIdFromUrl
        ),
    }));
  }, [
    farmIdFromUrl,
  ]);


  // =======================================================
  // LOAD FARM LOCATION
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    async function loadLocation() {
      const farmId =
        selectedFarmId;

      /*
       * مهم:
       * عند تغيير المزرعة نمسح الموقع السابق
       * مؤقتًا حتى لا يظهر موقع مزرعة أخرى.
       *
       * هذا لا يحذف LocationData من التخزين.
       */

      setMapLocation(null);

      if (!farmId) {
        return;
      }

      try {
        const location =
          await mapService.getLocationByFarmId(
            farmId
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
        } else {
          setMapLocation(null);
        }

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "CROP LOCATION ERROR:",
          error
        );

        setMapLocation(null);
      }
    }

    loadLocation();

    return () => {
      cancelled = true;
    };
  }, [
    selectedFarmId,
  ]);


  // =======================================================
  // AUTO LOAD FARM INFORMATION
  // =======================================================

  useEffect(() => {
    if (!selectedFarm) {
      return;
    }

    /*
     * لا ننسخ FarmData داخل CropData.
     *
     * selectedFarm يبقى المصدر الأصلي
     * لمعلومات المزرعة.
     *
     * CropData يحتفظ فقط بـ farmId.
     */

    setMessage("");

  }, [
    selectedFarm,
  ]);


  // =======================================================
  // CHANGE
  // =======================================================

  function change(event) {
    const {
      name,
      value,
    } = event.target;

    /*
     * عند تغيير المزرعة:
     * farmId فقط يتغير.
     *
     * لا يتم حذف أي سجل.
     * لا يتم نقل أي محصول.
     * لا يتم مسح localStorage.
     */

    if (name === "farmId") {
      const newFarmId =
        String(
          value ?? ""
        ).trim();

      setForm(current => ({
        ...EMPTY,

        farmId:
          newFarmId,

        cultivationType:
          current.cultivationType ||
          "field",
      }));

      setMapLocation(null);

      setMessage("");

      return;
    }

    setForm(current => ({
      ...current,

      [name]:
        value,
    }));
  }


  // =======================================================
  // LOCATION
  // =======================================================

  async function refreshMapLocation() {
    const farmId =
      selectedFarmId;

    if (!farmId) {
      setMessage(
        "يرجى اختيار المزرعة أولًا."
      );

      return;
    }

    try {
      const location =
        await mapService.getLocationByFarmId(
          farmId
        );

      const normalized =
        normalizeLocation(
          location
        );

      if (!normalized) {
        setMapLocation(null);

        setMessage(
          "لم يتم العثور على موقع محفوظ لهذه المزرعة."
        );

        return;
      }

      setMapLocation(
        normalized
      );

      setMessage(
        "تم تحميل موقع الأرض الخاص بالمزرعة المختارة."
      );

    } catch (error) {
      console.error(
        "REFRESH LOCATION ERROR:",
        error
      );

      setMessage(
        "تعذر تحميل موقع الأرض."
      );
    }
  }


  // =======================================================
  // OPEN MAP
  // =======================================================

  function chooseMapLocation() {
    if (!selectedFarmId) {
      setMessage(
        "يرجى اختيار المزرعة أولًا."
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
  // RECOMMENDATIONS
  // =======================================================

  const recommendations =
    useMemo(() => {
      if (!mapLocation) {
        return {
          climate: "",
          recommendedSeeds: [],
        };
      }

      return {
        climate:
          getClimate(
            mapLocation.latitude
          ),

        recommendedSeeds:
          getRecommendedSeeds(
            mapLocation.latitude,
            form.cultivationType
          ),
      };
    }, [
      mapLocation,
      form.cultivationType,
    ]);


  // =======================================================
  // AGE
  // =======================================================

  const plantingAge =
    useMemo(
      () =>
        calculateAge(
          form.plantingDate
        ),
      [
        form.plantingDate,
      ]
    );


  // =======================================================
  // CROPS OF SELECTED FARM ONLY
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
  // SAVE
  // =======================================================

  async function save(event) {
    event.preventDefault();

    setMessage("");

    if (!selectedFarmId) {
      setMessage(
        "يرجى اختيار المزرعة."
      );

      return;
    }

    if (!mapLocation) {
      setMessage(
        "يرجى تحديد موقع الأرض من الخريطة."
      );

      return;
    }

    if (!form.plantingDate) {
      setMessage(
        "يرجى إدخال تاريخ الزراعة."
      );

      return;
    }

    if (
      form.cultivationType ===
        "trees" &&
      !form.treeType.trim()
    ) {
      setMessage(
        "يرجى إدخال نوع الشجرة."
      );

      return;
    }

    if (
      form.cultivationType !==
        "trees" &&
      !form.name.trim()
    ) {
      setMessage(
        "يرجى إدخال اسم المحصول."
      );

      return;
    }


    const plantingDate =
      String(
        form.plantingDate
      ).trim();


    const payload = {
      ...form,

      /*
       * المصدر الوحيد للربط هو farmId.
       */
      farmId:
        selectedFarmId,

      name:
        String(
          form.name ?? ""
        ).trim(),

      treeType:
        String(
          form.treeType ?? ""
        ).trim(),

      treeVariety:
        String(
          form.treeVariety ?? ""
        ).trim(),

      plantingDate,

      harvestDate:
        String(
          form.harvestDate ?? ""
        ).trim(),

      seedQuantity:
        form.seedQuantity === ""
          ? 0
          : Number(
              form.seedQuantity
            ),

      fertilizerQuantity:
        form.fertilizerQuantity === ""
          ? 0
          : Number(
              form.fertilizerQuantity
            ),

      expectedProduction:
        form.expectedProduction === ""
          ? 0
          : Number(
              form.expectedProduction
            ),

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

      points:
        Array.isArray(
          mapLocation.points
        )
          ? mapLocation.points
          : [],

      climate:
        recommendations.climate,

      recommendedSeeds:
        recommendations.recommendedSeeds,
    };


    if (
      payload.plantingDate !==
      plantingDate
    ) {
      setMessage(
        "حدث خطأ في تاريخ الزراعة."
      );

      return;
    }


    setSaving(true);

    try {
      const saved =
        await addCrop(
          payload
        );

      if (!saved) {
        throw new Error(
          "فشل حفظ المحصول."
        );
      }

      setMessage(
        "تم حفظ المحصول بنجاح."
      );


      /*
       * تنظيف نموذج المحصول فقط.
       *
       * farmId يبقى للمزرعة الحالية.
       *
       * لا يتم حذف أي محصول قديم.
       */

      setForm(current => ({
        ...EMPTY,

        farmId:
          current.farmId,

        cultivationType:
          current.cultivationType,
      }));

    } catch (error) {
      console.error(
        "CROP SAVE ERROR:",
        error
      );

      setMessage(
        error?.message ||
        "حدث خطأ أثناء حفظ المحصول."
      );

    } finally {
      setSaving(false);
    }
  }


  // =======================================================
  // DELETE
  // =======================================================

  async function removeCrop(id) {
    if (!id) {
      return;
    }

    try {
      await deleteCrop(id);

      setMessage(
        "تم حذف المحصول."
      );

    } catch (error) {
      console.error(
        "CROP DELETE ERROR:",
        error
      );

      setMessage(
        "تعذر حذف المحصول."
      );
    }
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      dir="rtl"
      style={{
        padding: "16px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >

      <h1>
        🌱 المحاصيل
      </h1>


      {/* ================================================= */}
      {/* FARM */}
      {/* ================================================= */}

      <section
        style={{
          marginBottom: "20px",
        }}
      >
        <h2>
          1. المزرعة
        </h2>

        <select
          name="farmId"
          value={selectedFarmId}
          onChange={change}
          style={FIELD_STYLE}
          disabled={farmsLoading}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map(farm => (
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

        {(selectedFarm ||
          selectedFarmLoading) && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "#f5f8f5",
              border: "1px solid #ddd",
            }}
          >

            {selectedFarmLoading ? (
              <p>
                جاري تحميل بيانات المزرعة...
              </p>
            ) : selectedFarm ? (
              <>
                <p>
                  🏡 المزرعة المختارة:{" "}
                  <strong>
                    {selectedFarm.name ||
                      selectedFarm.farmName ||
                      selectedFarm.id}
                  </strong>
                </p>

                {Object.entries(
                  selectedFarm
                ).map(
                  ([key, value]) => {
                    /*
                     * لا نعرض الحقول الداخلية.
                     */
                    if (
                      [
                        "id",
                        "name",
                        "farmName",
                        "createdAt",
                        "updatedAt",
                      ].includes(key)
                    ) {
                      return null;
                    }

                    const text =
                      displayValue(
                        value
                      );

                    if (!text) {
                      return null;
                    }

                    return (
                      <p
                        key={key}
                        style={{
                          margin:
                            "6px 0",
                        }}
                      >
                        <strong>
                          {key}:
                        </strong>{" "}
                        {text}
                      </p>
                    );
                  }
                )}
              </>
            ) : null}

          </div>
        )}
      </section>


      {/* ================================================= */}
      {/* CULTIVATION TYPE */}
      {/* ================================================= */}

      <section
        style={{
          marginBottom: "20px",
        }}
      >
        <h2>
          2. نوع الزراعة
        </h2>

        <select
          name="cultivationType"
          value={
            form.cultivationType
          }
          onChange={change}
          style={FIELD_STYLE}
        >
          {TYPES.map(type => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </select>
      </section>


      {/* ================================================= */}
      {/* LOCATION */}
      {/* ================================================= */}

      <section
        style={{
          marginBottom: "20px",
        }}
      >
        <h2>
          3. موقع الأرض
        </h2>

        {mapLocation ? (
          <div>

            <p>
              📍 تم تحميل موقع الأرض المحفوظ
              للمزرعة المختارة.
            </p>

            <p>
              خط العرض:{" "}
              {mapLocation.latitude}
            </p>

            <p>
              خط الطول:{" "}
              {mapLocation.longitude}
            </p>

            {mapLocation.province && (
              <p>
                المحافظة:{" "}
                {mapLocation.province}
              </p>
            )}

            {mapLocation.district && (
              <p>
                المنطقة:{" "}
                {mapLocation.district}
              </p>
            )}

            {mapLocation.village && (
              <p>
                القرية:{" "}
                {mapLocation.village}
              </p>
            )}

            <p>
              عدد نقاط الحدود:{" "}
              {
                mapLocation.boundary
                  ?.length || 0
              }
            </p>

            <button
              type="button"
              onClick={
                refreshMapLocation
              }
            >
              🔄 تحديث الموقع
            </button>

          </div>
        ) : selectedFarmId ? (
          <p>
            لم يتم العثور على موقع محفوظ
            لهذه المزرعة.
          </p>
        ) : (
          <p>
            اختر المزرعة أولًا.
          </p>
        )}

        <button
          type="button"
          onClick={
            chooseMapLocation
          }
          style={{
            marginTop: "10px",
            padding: "12px",
            width: "100%",
          }}
        >
          📍 تحديد موقع الأرض من الخريطة
        </button>
      </section>


      {/* ================================================= */}
      {/* CLIMATE */}
      {/* ================================================= */}

      {recommendations.climate && (
        <section
          style={{
            marginBottom: "20px",
          }}
        >
          <h2>
            🌤️ المناخ
          </h2>

          <p>
            {recommendations.climate}
          </p>

          {recommendations
            .recommendedSeeds
            .length > 0 && (
            <p>
              🌱 الأصناف المقترحة:{" "}
              {recommendations
                .recommendedSeeds
                .join("، ")}
            </p>
          )}
        </section>
      )}


      {/* ================================================= */}
      {/* CROP FORM */}
      {/* ================================================= */}

      <form
        onSubmit={save}
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
              value={form.treeType}
              onChange={change}
              style={FIELD_STYLE}
              placeholder="مثال: زيتون"
            />

            <label>
              صنف الشجرة
            </label>

            <input
              name="treeVariety"
              value={
                form.treeVariety
              }
              onChange={change}
              style={FIELD_STYLE}
              placeholder="الصنف"
            />
          </>
        ) : (
          <>
            <label>
              اسم المحصول
            </label>

            <input
              name="name"
              value={form.name}
              onChange={change}
              style={FIELD_STYLE}
              placeholder="اسم المحصول"
            />

            <label>
              نوع البذور
            </label>

            <input
              name="seedType"
              value={form.seedType}
              onChange={change}
              style={FIELD_STYLE}
            />

            <label>
              صنف البذور
            </label>

            <input
              name="seedVariety"
              value={
                form.seedVariety
              }
              onChange={change}
              style={FIELD_STYLE}
            />

            <label>
              جودة البذور
            </label>

            <input
              name="seedQuality"
              value={
                form.seedQuality
              }
              onChange={change}
              style={FIELD_STYLE}
            />

            <label>
              كمية البذور
            </label>

            <input
              name="seedQuantity"
              type="number"
              value={
                form.seedQuantity
              }
              onChange={change}
              style={FIELD_STYLE}
            />
          </>
        )}


        {/* ================================================= */}
        {/* PLANTING DATE */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label
            htmlFor="planting-date"
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
            style={FIELD_STYLE}
          />

          {plantingAge && (
            <p>
              ⏳ عمر النبات:{" "}
              <strong>
                {plantingAge}
              </strong>
            </p>
          )}
        </div>


        {/* ================================================= */}
        {/* FERTILIZER */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            نوع السماد
          </label>

          <input
            name="fertilizerType"
            value={
              form.fertilizerType
            }
            onChange={change}
            style={FIELD_STYLE}
          />

          <label>
            كمية السماد
          </label>

          <input
            name="fertilizerQuantity"
            type="number"
            value={
              form.fertilizerQuantity
            }
            onChange={change}
            style={FIELD_STYLE}
          />
        </div>


        {/* ================================================= */}
        {/* HARVEST */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            📅 تاريخ الحصاد المتوقع
          </label>

          <input
            type="date"
            name="harvestDate"
            value={
              form.harvestDate
            }
            onChange={change}
            style={FIELD_STYLE}
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
            onChange={change}
            style={FIELD_STYLE}
          />
        </div>


        {/* ================================================= */}
        {/* NOTES */}
        {/* ================================================= */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            ملاحظات
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={change}
            style={{
              ...FIELD_STYLE,
              minHeight: "100px",
            }}
          />
        </div>


        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "10px",
              background: "#eef7ee",
            }}
          >
            {message}
          </div>
        )}


        {/* ================================================= */}
        {/* SAVE */}
        {/* ================================================= */}

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            cursor: saving
              ? "wait"
              : "pointer",
            fontSize: "17px",
          }}
        >
          {saving
            ? "جاري الحفظ..."
            : "💾 حفظ المحصول"}
        </button>

      </form>


      {/* ================================================= */}
      {/* CROPS LIST — SELECTED FARM ONLY */}
      {/* ================================================= */}

      <section
        style={{
          marginTop: "35px",
        }}
      >
        <h2>
          🌱 المحاصيل المسجلة
        </h2>

        {!selectedFarmId ? (
          <p>
            اختر المزرعة لعرض محاصيلها.
          </p>

        ) : cropsLoading ? (
          <p>
            جاري تحميل المحاصيل...
          </p>

        ) : selectedFarmCrops.length === 0 ? (
          <p>
            لا توجد محاصيل مسجلة لهذه المزرعة.
          </p>

        ) : (
          selectedFarmCrops.map(
            crop => (
              <div
                key={crop.id}
                style={{
                  padding: "15px",
                  marginBottom: "12px",
                  borderRadius: "12px",
                  border:
                    "1px solid #ddd",
                }}
              >

                <h3>
                  {crop.name ||
                    crop.treeType ||
                    "محصول"}
                </h3>

                <p>
                  🏡 المزرعة:{" "}
                  <strong>
                    {selectedFarm?.name ||
                      selectedFarm?.farmName ||
                      selectedFarmId}
                  </strong>
                </p>

                {crop.plantingDate && (
                  <p>
                    📅 الزراعة:{" "}
                    <strong>
                      {crop.plantingDate}
                    </strong>
                  </p>
                )}

                {crop.plantingDate && (
                  <p>
                    ⏳ العمر:{" "}
                    <strong>
                      {calculateAge(
                        crop.plantingDate
                      )}
                    </strong>
                  </p>
                )}

                {crop.climate && (
                  <p>
                    🌤️ المناخ:{" "}
                    {crop.climate}
                  </p>
                )}

                {Number.isFinite(
                  Number(
                    crop.latitude
                  )
                ) && (
                  <p>
                    📍 الموقع:{" "}
                    {crop.latitude},{" "}
                    {crop.longitude}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    removeCrop(
                      crop.id
                    )
                  }
                >
                  🗑️ حذف
                </button>

              </div>
            )
          )
        )}
      </section>

    </div>
  );
}
