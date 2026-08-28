// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";

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

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number
    : null;
}

function getClimate(latitude) {
  const lat = getNumber(latitude);

  if (lat === null) return "";

  const absolute = Math.abs(lat);

  if (absolute >= 50) return "باردة";
  if (absolute >= 25) return "معتدلة";

  return "حارة";
}

function getRecommendedSeeds(
  latitude,
  type
) {
  const climate = getClimate(latitude);

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

    if (climate === "حارة") {
      return [
        "زيتون",
        "حمضيات",
        "نخيل",
      ];
    }

    return [];
  }

  if (climate === "باردة") {
    return [
      "قمح شتوي",
      "شعير",
      "شوفان",
    ];
  }

  if (climate === "معتدلة") {
    return [
      "قمح",
      "شعير",
      "ذرة",
      "عباد الشمس",
    ];
  }

  if (climate === "حارة") {
    return [
      "ذرة",
      "دخن",
      "سورغم",
      "سمسم",
    ];
  }

  return [];
}

function calculateAge(date) {
  if (!date) return "";

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

    days += previousMonth.getDate();
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

function readMapLocation() {
  const keys = [
    "mapLocation",
    "selectedLocation",
    "selectedFarmLocation",
    "farmLocation",
    "fieldLocation",
  ];

  for (const key of keys) {
    try {
      const raw =
        localStorage.getItem(key);

      if (!raw) continue;

      const value =
        JSON.parse(raw);

      if (
        value &&
        (
          value.latitude ??
          value.lat
        ) !== undefined
      ) {
        return value;
      }
    } catch {
      // تجاهل البيانات غير الصالحة
    }
  }

  return null;
}

function normalizeLocation(location) {
  if (!location) {
    return {
      latitude: "",
      longitude: "",
      boundary: [],
    };
  }

  return {
    latitude:
      location.latitude ??
      location.lat ??
      location.center?.latitude ??
      location.center?.lat ??
      "",

    longitude:
      location.longitude ??
      location.lng ??
      location.center?.longitude ??
      location.center?.lng ??
      "",

    boundary:
      Array.isArray(location.boundary)
        ? location.boundary
        : Array.isArray(location.points)
          ? location.points
          : [],
  };
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

  const [mapLocation, setMapLocation] =
    useState(null);

  useEffect(() => {
    loadCrops().catch(() => {});
  }, [loadCrops]);

  const farmIdFromUrl =
    useMemo(() => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      return (
        params.get("farmId") || ""
      );
    }, []);

  useEffect(() => {
    if (!farmIdFromUrl) return;

    const exists =
      farms.some(
        farm =>
          String(getFarmId(farm)) ===
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

  useEffect(() => {
    const location =
      readMapLocation();

    if (location) {
      setMapLocation(
        normalizeLocation(location)
      );
    }
  }, []);

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            String(getFarmId(farm)) ===
            String(form.farmId)
        ),
      [
        farms,
        form.farmId,
      ]
    );

  const climate =
    getClimate(
      mapLocation?.latitude
    );

  const recommendedSeeds =
    useMemo(
      () =>
        getRecommendedSeeds(
          mapLocation?.latitude,
          form.cultivationType
        ),
      [
        mapLocation?.latitude,
        form.cultivationType,
      ]
    );

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
    setMessage(
      "حدد الأرض من الخريطة أولًا، ثم احفظ موقعها."
    );

    window.location.href =
      `/map?return=crops&farmId=${encodeURIComponent(
        String(form.farmId || "")
      )}`;
  };

  const refreshMapLocation = () => {
    const location =
      readMapLocation();

    if (!location) {
      setMapLocation(null);

      setMessage(
        "لم يتم العثور على موقع محفوظ من الخريطة."
      );

      return;
    }

    setMapLocation(
      normalizeLocation(location)
    );

    setMessage(
      "تم تحديث موقع الأرض من الخريطة."
    );
  };

  const save = async event => {
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

    if (!mapLocation?.latitude) {
      setMessage(
        "يرجى تحديد الأرض من الخريطة أولًا."
      );
      return;
    }

    if (
      form.cultivationType === "trees"
    ) {
      if (!form.treeType.trim()) {
        setMessage(
          "يرجى كتابة نوع الشجرة."
        );
        return;
      }
    } else {
      if (!form.name.trim()) {
        setMessage(
          "يرجى كتابة ماذا زرعت."
        );
        return;
      }
    }

    try {
      await addCrop({
        ...form,

        farmId:
          getFarmId(selectedFarm),

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
          mapLocation.latitude,

        longitude:
          mapLocation.longitude,

        boundary:
          mapLocation.boundary || [],

        climate:
          climate || "",

        recommendedSeeds,
      });

      setMessage(
        "✅ تم حفظ المحصول بنجاح."
      );

      setForm({
        ...EMPTY,
        farmId: form.farmId,
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
            value={form.cultivationType}
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
            onClick={chooseMapLocation}
            style={secondaryButton}
          >
            🗺️ تحديد الأرض من الخريطة
          </button>

          <button
            type="button"
            onClick={refreshMapLocation}
            style={smallButton}
          >
            🔄 تحديث موقع الخريطة
          </button>

          {mapLocation?.latitude ? (
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

              {mapLocation.boundary?.length > 0 && (
                <div>
                  حدود الأرض:{" "}
                  {mapLocation.boundary.length}
                  {" "}نقطة
                </div>
              )}
            </div>
          ) : (
            <p style={mutedStyle}>
              لم يتم تحديد الأرض من الخريطة بعد.
            </p>
          )}
        </section>

        {mapLocation?.latitude && (
          <section style={recommendationStyle}>
            <h2 style={sectionTitle}>
              🌤️ المناخ والتوصية
            </h2>

            <p>
              مناخ الموقع:{" "}
              <strong>
                {climate || "غير محدد"}
              </strong>
            </p>

            {recommendedSeeds.length > 0 ? (
              <>
                <strong>
                  🌱 توصية أولية مناسبة للموقع:
                </strong>

                <div style={tagsStyle}>
                  {recommendedSeeds.map(seed => (
                    <span
                      key={seed}
                      style={tagStyle}
                    >
                      {seed}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p>
                لا توجد توصية كافية حتى الآن.
              </p>
            )}

            <small>
              هذه توصية أولية مبنية على
              المناخ التقريبي للموقع، وليست
              بديلًا عن القرار الزراعي المحلي.
            </small>
          </section>
        )}

        {form.cultivationType === "trees" ? (
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
              value={form.treeVariety}
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
              value={form.seedVariety}
              onChange={change}
              placeholder="🔖 صنف البذور"
              style={inputStyle}
            />

            <input
              name="seedQuality"
              value={form.seedQuality}
              onChange={change}
              placeholder="⭐ جودة البذور"
              style={inputStyle}
            />

            <input
              name="seedQuantity"
              type="number"
              min="0"
              value={form.seedQuantity}
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
            value={form.plantingDate}
            onChange={change}
            style={inputStyle}
          />

          {plantAge && (
            <div style={ageBox}>
              🌿 عمر النبات:
              {" "}
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
            value={form.fertilizerType}
            onChange={change}
            placeholder="🧪 نوع السماد"
            style={inputStyle}
          />

          <input
            name="fertilizerQuantity"
            type="number"
            min="0"
            value={form.fertilizerQuantity}
            onChange={change}
            placeholder="⚖️ كمية السماد بالكيلوغرام"
            style={inputStyle}
          />

          <input
            name="harvestDate"
            type="date"
            value={form.harvestDate}
            onChange={change}
            style={inputStyle}
          />

          <input
            name="expectedProduction"
            type="number"
            min="0"
            value={form.expectedProduction}
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
                String(crop.farmId)
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

              {crop.latitude && (
                <div>
                  📍 الموقع محفوظ
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteCrop(crop.id)
                }
                style={deleteButton}
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
