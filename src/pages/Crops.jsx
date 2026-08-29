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

const TYPES = [
  {
    value: "trees",
    label: "🌳 أشجار / بستان",
  },
  {
    value: "field",
    label: "🌾 حقل محاصيل",
  },
  {
    value: "vegetables",
    label: "🥬 خضروات",
  },
  {
    value: "other",
    label: "🌱 أخرى",
  },
];

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

  useEffect(() => {
    loadCrops().catch(() => {});
  }, [loadCrops]);

  useEffect(() => {
    loadMapLocations();
  }, [loadMapLocations]);

  /*
   * مهم:
   * عند الرجوع من Map إلى Crops
   * نعيد قراءة locations حتى لا تبقى
   * الشاشة على نسخة قديمة.
   */
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

  const farmIdFromUrl =
    useMemo(() => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      return params.get("farmId") || "";
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

    if (exists) {
      setForm(current => ({
        ...current,
        farmId: farmIdFromUrl,
      }));
    }
  }, [
    farmIdFromUrl,
    farms,
  ]);

  /*
   * الموقع الحقيقي للمزرعة.
   *
   * الأولوية:
   * 1. موقع مرتبط بالمزرعة.
   * 2. موقع مصدره map.
   * 3. أحدث موقع محفوظ.
   *
   * لا نعتمد على المحافظة أو القرية.
   */
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

  /*
   * إذا لم يكن farmId محفوظًا داخل location
   * ولكن يوجد موقع واحد فقط مع إحداثيات،
   * لا نعتبره تلقائيًا موقع المزرعة الأخرى.
   *
   * لذلك لا يحدث خلط بين المزارع.
   */

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            String(
              getFarmId(farm)
            ) ===
            String(form.farmId)
        ),
      [
        farms,
        form.farmId,
      ]
    );

  const locationForRecommendation =
    mapLocation
      ? {
          latitude:
            mapLocation.latitude,
          longitude:
            mapLocation.longitude,
          boundary:
            mapLocation.boundary,
        }
      : null;

  const smartRecommendations =
    useMemo(() => {
      if (!locationForRecommendation) {
        return null;
      }

      return cropService.getSmartRecommendations(
        locationForRecommendation
      );
    }, [
      locationForRecommendation,
    ]);

  const climate =
    smartRecommendations?.climate || "";

  const recommendedSeeds =
    useMemo(() => {
      if (!smartRecommendations) {
        return [];
      }

      if (
        form.cultivationType ===
        "trees"
      ) {
        return [];
      }

      return smartRecommendations.crops
        .map(crop => crop.name);
    }, [
      smartRecommendations,
      form.cultivationType,
    ]);

  const plantAge =
    calculateAge(
      form.plantingDate
    );

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

  const refreshMapLocation =
    async () => {
      setMessage("");

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
          : "لا يوجد موقع محفوظ لهذه المزرعة على الخريطة."
      );
    };

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

      if (!form.cultivationType) {
        setMessage(
          "يرجى اختيار نوع الأرض / الزراعة."
        );
        return;
      }

      /*
       * إعادة القراءة مباشرة قبل الحفظ.
       *
       * هذه النقطة تمنع مشكلة:
       * الخريطة حفظت الموقع
       * لكن Crops كانت تحمل نسخة قديمة.
       */
      const freshLocations =
        await loadMapLocations();

      const freshLocation =
        freshLocations
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
          .filter(hasCoordinates)
          .filter(
            location =>
              String(
                location.source || ""
              ).toLowerCase() ===
              "map"
          )
          .pop() ||
        freshLocations
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
          .filter(hasCoordinates)
          .pop() ||
        null;

      if (!freshLocation) {
        setMessage(
          "لم يتم العثور على موقع أرض محفوظ لهذه المزرعة. افتح الخريطة وحدد الأرض ثم احفظ الموقع."
        );

        return;
      }

      if (
        form.cultivationType ===
        "trees"
      ) {
        if (
          !String(
            form.treeType || ""
          ).trim()
        ) {
          setMessage(
            "يرجى كتابة نوع الشجرة."
          );

          return;
        }
      } else {
        if (
          !String(
            form.name || ""
          ).trim()
        ) {
          setMessage(
            "يرجى كتابة ماذا زرعت."
          );

          return;
        }
      }

      const location =
        normalizeLocation(
          freshLocation
        );

      const recommendations =
        cropService.getSmartRecommendations(
          location
        );

      try {
        await addCrop({
          ...form,

          farmId:
            getFarmId(
              selectedFarm
            ) || form.farmId,

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
            form.cultivationType,
        });
      } catch (err) {
        setMessage(
          err?.message ||
          "تعذر حفظ المحصول."
        );
      }
    };

  return (
    <main
      dir="rtl"
      style={pageStyle}
    >
      <header>
        <h1>🌱 المحاصيل</h1>

        <p style={mutedStyle}>
          تسجيل الزراعة وربطها بالمزرعة
          وموقع الأرض والمناخ.
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
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            2. نوع الأرض / الزراعة
          </h2>

          <select
            name="cultivationType"
            value={
              form.cultivationType
            }
            onChange={change}
            style={inputStyle}
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

        <section style={cardStyle}>
          <h2 style={sectionTitle}>
            3. الأرض والموقع
          </h2>

          <button
            type="button"
            onClick={
              chooseMapLocation
            }
            style={secondaryButton}
          >
            🗺️ تحديد الأرض من الخريطة
          </button>

          <button
            type="button"
            onClick={
              refreshMapLocation
            }
            style={smallButton}
            disabled={
              locationsLoading
            }
          >
            🔄 تحديث موقع الخريطة
          </button>

          {hasCoordinates(
            mapLocation
          ) ? (
            <div style={locationBox}>
              <strong>
                📍 تم تحديد الأرض
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
                    mapLocation
                      .boundary
                      .length
                  }{" "}
                  نقطة
                </div>
              )}
            </div>
          ) : (
            <p style={mutedStyle}>
              {locationsLoading
                ? "جاري تحميل موقع الخريطة..."
                : "لم يتم تحديد الأرض من الخريطة بعد."}
            </p>
          )}
        </section>

        {hasCoordinates(
          mapLocation
        ) && (
          <section
            style={
              recommendationStyle
            }
          >
            <h2 style={sectionTitle}>
              🌤️ المناخ والتوصية
            </h2>

            <p>
              مناخ الموقع:{" "}
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
              الأرض المحفوظة من الخريطة.
            </small>
          </section>
        )}

        {form.cultivationType ===
        "trees" ? (
          <section style={cardStyle}>
            <h2 style={sectionTitle}>
              4. بيانات الأشجار
            </h2>

            <input
              name="treeType"
              value={form.treeType}
              onChange={change}
              placeholder="🌳 نوع الشجرة"
              style={inputStyle}
            />

            <input
              name="treeVariety"
              value={
                form.treeVariety
              }
              onChange={change}
              placeholder="🔖 صنف الشجرة"
              style={inputStyle}
            />
          </section>
        ) : (
          <section style={cardStyle}>
            <h2 style={sectionTitle}>
              4. بيانات المحصول والبذور
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
        )}

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

        <button
          type="submit"
          disabled={loading}
          style={saveButton}
        >
          {loading
            ? "جاري الحفظ..."
            : "💾 حفظ المحصول"}
        </button>
      </form>

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

              <div>
                🌿 النوع:{" "}
                {crop.cultivationType}
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

const secondaryButton = {
  width: "100%",
  padding: "10px",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
  marginBottom: 6,
  fontSize: 15,
};

const smallButton = {
  padding: "7px 10px",
  border: 0,
  borderRadius: 7,
  cursor: "pointer",
  fontSize: 13,
};

const locationBox = {
  marginTop: 8,
  padding: 9,
  borderRadius: 8,
  background: "#eef8ef",
  lineHeight: 1.8,
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
