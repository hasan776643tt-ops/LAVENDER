// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useFarms
  from "../hooks/useFarms.js";

import useFields
  from "../hooks/useFields.js";

import useCrops
  from "../hooks/useCrops.js";

const EMPTY = {
  farmId: "",
  fieldId: "",
  name: "",
  seedType: "",
  seedVariety: "",
  seedQuality: "",
  seedQuantity: "",
  plantingDate: "",
  fertilizerType: "",
  fertilizerQuantity: "",
  harvestDate: "",
  expectedProduction: "",
  notes: "",
};

function idOf(item) {
  return (
    item?.id ??
    item?._id ??
    item?.farmId ??
    item?.fieldId ??
    ""
  );
}

function nameOf(item) {
  return (
    item?.name ??
    item?.farmName ??
    item?.fieldName ??
    item?.title ??
    ""
  );
}

function getCoordinates(field) {
  const latitude =
    field?.latitude ??
    field?.lat ??
    field?.location?.latitude ??
    field?.location?.lat ??
    field?.center?.latitude ??
    field?.center?.lat ??
    null;

  const longitude =
    field?.longitude ??
    field?.lng ??
    field?.location?.longitude ??
    field?.location?.lng ??
    field?.center?.longitude ??
    field?.center?.lng ??
    null;

  if (
    latitude !== null &&
    longitude !== null
  ) {
    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  }

  const coordinates =
    field?.location?.coordinates ??
    field?.geometry?.coordinates ??
    field?.coordinates;

  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    !Array.isArray(coordinates[0])
  ) {
    return {
      longitude: Number(coordinates[0]),
      latitude: Number(coordinates[1]),
    };
  }

  return {
    latitude: null,
    longitude: null,
  };
}

function climateOf(latitude) {
  const n = Math.abs(Number(latitude));

  if (!Number.isFinite(n)) {
    return null;
  }

  if (n >= 50) return "باردة";
  if (n >= 25) return "معتدلة";

  return "حارة";
}

function recommendedSeeds(latitude) {
  const climate =
    climateOf(latitude);

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

function plantAge(date) {
  if (!date) return null;

  const start =
    new Date(`${date}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const now = new Date();

  const days = Math.max(
    0,
    Math.floor(
      (now - start) /
        (1000 * 60 * 60 * 24)
    )
  );

  const months =
    Math.floor(days / 30);

  const remainingDays =
    days % 30;

  return {
    days,
    months,
    remainingDays,
  };
}

export default function Crops() {
  const {
    farms = [],
    loading: farmsLoading,
    error: farmsError,
  } = useFarms();

  const {
    fields = [],
    loading: fieldsLoading,
    error: fieldsError,
    loadFields,
  } = useFields();

  const {
    crops = [],
    loading: cropsLoading,
    error: cropsError,
    addCrop,
    deleteCrop,
  } = useCrops();

  const [form, setForm] =
    useState(EMPTY);

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadFields().catch(() => {});
  }, [loadFields]);

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
          String(idOf(farm)) ===
          String(farmIdFromUrl)
      );

    if (exists) {
      setForm(current => ({
        ...current,
        farmId: farmIdFromUrl,
        fieldId: "",
      }));
    }
  }, [farmIdFromUrl, farms]);

  const farmFields =
    useMemo(() => {
      if (!form.farmId) {
        return [];
      }

      return fields.filter(field => {
        const fieldFarmId =
          field?.farmId ??
          field?.farm_id ??
          field?.farm?.id ??
          field?.farm?._id ??
          "";

        return (
          String(fieldFarmId) ===
          String(form.farmId)
        );
      });
    }, [fields, form.farmId]);

  const selectedField =
    useMemo(() => {
      return farmFields.find(field => {
        return (
          String(idOf(field)) ===
          String(form.fieldId)
        );
      });
    }, [farmFields, form.fieldId]);

  const coordinates =
    useMemo(
      () =>
        getCoordinates(
          selectedField
        ),
      [selectedField]
    );

  const climate =
    climateOf(
      coordinates.latitude
    );

  const seeds =
    recommendedSeeds(
      coordinates.latitude
    );

  const age =
    plantAge(
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
      ...(name === "farmId"
        ? {
            fieldId: "",
          }
        : {}),
    }));
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

    if (!form.fieldId) {
      setMessage(
        "يرجى اختيار الحقل."
      );
      return;
    }

    if (!form.name.trim()) {
      setMessage(
        "يرجى كتابة ماذا زرعت."
      );
      return;
    }

    setSaving(true);

    try {
      await addCrop({
        ...form,

        farmId:
          form.farmId,

        fieldId:
          form.fieldId,

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        locationName:
          nameOf(selectedField),

        climate:
          climate || null,

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
      });

      setMessage(
        "تم حفظ المحصول بنجاح."
      );

      setForm(EMPTY);
    } catch (err) {
      setMessage(
        err?.message ||
          "تعذر حفظ المحصول."
      );
    } finally {
      setSaving(false);
    }
  };

  const pageError =
    farmsError ||
    fieldsError ||
    cropsError;

  return (
    <main
      dir="rtl"
      style={pageStyle}
    >
      <h1 style={titleStyle}>
        🌱 المحاصيل
      </h1>

      {(message || pageError) && (
        <div
          style={messageStyle}
        >
          ⚠️{" "}
          {message ||
            pageError?.message ||
            "حدث خطأ."}
        </div>
      )}

      <form
        onSubmit={save}
        style={formStyle}
      >
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
              : farms.length
                ? "اختر المزرعة"
                : "لا توجد مزارع مسجلة"}
          </option>

          {farms.map(farm => {
            const id =
              idOf(farm);

            const name =
              nameOf(farm);

            if (!id || !name) {
              return null;
            }

            return (
              <option
                key={String(id)}
                value={String(id)}
              >
                {name}
              </option>
            );
          })}
        </select>

        <select
          name="fieldId"
          value={form.fieldId}
          onChange={change}
          disabled={
            !form.farmId ||
            fieldsLoading
          }
          style={inputStyle}
        >
          <option value="">
            {!form.farmId
              ? "اختر المزرعة أولًا"
              : fieldsLoading
                ? "جاري تحميل الحقول..."
                : farmFields.length
                  ? "اختر الحقل"
                  : "لا توجد حقول لهذه المزرعة"}
          </option>

          {farmFields.map(field => {
            const id =
              idOf(field);

            const name =
              nameOf(field) ||
              `حقل ${String(id).slice(0, 6)}`;

            return (
              <option
                key={String(id)}
                value={String(id)}
              >
                {name}
              </option>
            );
          })}
        </select>

        {selectedField && (
          <section
            style={locationStyle}
          >
            <strong>
              📍 دليل موقع الحقل
            </strong>

            <div>
              الحقل:{" "}
              {nameOf(selectedField)}
            </div>

            <div>
              خط العرض:{" "}
              {coordinates.latitude ??
                "غير مسجل"}
            </div>

            <div>
              خط الطول:{" "}
              {coordinates.longitude ??
                "غير مسجل"}
            </div>

            {climate && (
              <div>
                🌤️ المناخ: {climate}
              </div>
            )}
          </section>
        )}

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

        <select
          name="seedQuality"
          value={form.seedQuality}
          onChange={change}
          style={inputStyle}
        >
          <option value="">
            ⭐ اختر جودة البذور
          </option>
          <option value="ممتازة">
            ممتازة
          </option>
          <option value="جيدة">
            جيدة
          </option>
          <option value="متوسطة">
            متوسطة
          </option>
        </select>

        <input
          name="seedQuantity"
          type="number"
          min="0"
          value={form.seedQuantity}
          onChange={change}
          placeholder="⚖️ وزن البذور بالكيلوغرام"
          style={inputStyle}
        />

        <label style={labelStyle}>
          📅 متى زرعت؟
        </label>

        <input
          name="plantingDate"
          type="date"
          value={form.plantingDate}
          onChange={change}
          style={inputStyle}
        />

        {age && (
          <div
            style={ageStyle}
          >
            🌿 عمر النبات الآن:{" "}
            {age.months} شهر و{" "}
            {age.remainingDays} يوم
            {" "}
            ({age.days} يوم)
          </div>
        )}

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

        <label style={labelStyle}>
          📅 موعد الحصاد المتوقع
        </label>

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

        <textarea
          name="notes"
          value={form.notes}
          onChange={change}
          placeholder="📝 ملاحظات"
          rows={3}
          style={inputStyle}
        />

        {seeds.length > 0 && (
          <section
            style={recommendationStyle}
          >
            <strong>
              🌱 توصية البذور حسب موقع الحقل
            </strong>

            <div>
              المناخ: {climate}
            </div>

            <p>
              بذور مناسبة مبدئيًا:
            </p>

            {seeds.map(seed => (
              <div key={seed}>
                🌾 {seed}
              </div>
            ))}
          </section>
        )}

        {selectedField &&
          coordinates.latitude === null && (
            <div
              style={warningStyle}
            >
              ⚠️ هذا الحقل لا يحتوي حاليًا
              على إحداثيات جغرافية محفوظة،
              لذلك لا يمكن إعطاء توصية
              مناخية دقيقة.
            </div>
          )}

        <button
          type="submit"
          disabled={
            saving ||
            cropsLoading ||
            !farms.length ||
            !form.farmId ||
            !form.fieldId
          }
          style={buttonStyle}
        >
          {saving
            ? "جاري الحفظ..."
            : "حفظ المحصول"}
        </button>
      </form>

      <h2 style={sectionTitle}>
        🌾 المحاصيل المسجلة
      </h2>

      {!crops.length && (
        <div style={emptyStyle}>
          لا توجد محاصيل مسجلة حتى الآن.
        </div>
      )}

      {crops.map(crop => {
        const cropAge =
          plantAge(
            crop?.plantingDate
          );

        return (
          <article
            key={crop.id}
            style={cropCardStyle}
          >
            <strong>
              🌱 {crop.name}
            </strong>

            <div>
              🏡 المزرعة:{" "}
              {crop.farmName || "--"}
            </div>

            <div>
              📍 الحقل:{" "}
              {crop.locationName || "--"}
            </div>

            <div>
              🌾 البذور:{" "}
              {crop.seedType || "--"}
            </div>

            <div>
              🔖 الصنف:{" "}
              {crop.seedVariety || "--"}
            </div>

            {crop.plantingDate && (
              <div>
                📅 الزراعة:{" "}
                {crop.plantingDate}
              </div>
            )}

            {cropAge && (
              <div>
                🌿 العمر:{" "}
                {cropAge.months} شهر و{" "}
                {cropAge.remainingDays} يوم
              </div>
            )}

            {crop.climate && (
              <div>
                🌤️ المناخ:{" "}
                {crop.climate}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                deleteCrop(
                  crop.id
                )
              }
              style={deleteStyle}
            >
              🗑️ حذف
            </button>
          </article>
        );
      })}
    </main>
  );
}

const pageStyle = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "10px 12px 24px",
};

const titleStyle = {
  margin: "4px 0 10px",
};

const sectionTitle = {
  margin: "16px 0 8px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 11px",
  border: "1px solid #ccd5ce",
  borderRadius: 9,
  fontSize: 16,
  background: "#fff",
};

const labelStyle = {
  fontSize: 14,
  marginTop: 2,
};

const messageStyle = {
  padding: "8px 10px",
  marginBottom: 8,
  background: "#fff3cd",
  borderRadius: 8,
};

const locationStyle = {
  padding: "8px 10px",
  borderRadius: 9,
  background: "#eef7ef",
  lineHeight: 1.7,
};

const recommendationStyle = {
  padding: "9px 11px",
  borderRadius: 9,
  background: "#edf8ef",
  lineHeight: 1.7,
};

const ageStyle = {
  padding: "7px 10px",
  borderRadius: 8,
  background: "#f1f7f2",
};

const warningStyle = {
  padding: "8px 10px",
  borderRadius: 8,
  background: "#fff3cd",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  border: 0,
  borderRadius: 9,
  cursor: "pointer",
  fontSize: 16,
};

const emptyStyle = {
  padding: 10,
  borderRadius: 9,
  background: "#f5f5f5",
};

const cropCardStyle = {
  padding: 9,
  marginBottom: 7,
  borderRadius: 9,
  background: "#f5f5f5",
  lineHeight: 1.7,
};

const deleteStyle = {
  marginTop: 5,
  padding: "6px 10px",
  border: 0,
  borderRadius: 7,
  cursor: "pointer",
};
