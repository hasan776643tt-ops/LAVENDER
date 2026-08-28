import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useFarms from "../hooks/useFarms.js";
import useFields from "../hooks/useFields.js";
import useCrops from "../hooks/useCrops.js";

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

function climate(latitude) {
  const n = Math.abs(Number(latitude));

  if (!Number.isFinite(n)) return null;
  if (n >= 50) return "باردة";
  if (n >= 25) return "معتدلة";
  return "حارة";
}

function seeds(latitude) {
  const c = climate(latitude);

  if (c === "باردة") {
    return ["قمح شتوي", "شعير", "شوفان"];
  }

  if (c === "معتدلة") {
    return ["قمح", "شعير", "ذرة", "عباد الشمس"];
  }

  if (c === "حارة") {
    return ["ذرة", "دخن", "سورغم", "سمسم"];
  }

  return [];
}

export default function Crops() {
  const {
    farms = [],
    loading: farmsLoading,
  } = useFarms();

  const {
    loadFields,
  } = useFields();

  const {
    crops = [],
    loading,
    error,
    loadCrops,
    addCrop,
    deleteCrop,
  } = useCrops();

  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      loadFields(),
      loadCrops(),
    ]).then(([fieldData]) => {
      setFields(
        Array.isArray(fieldData)
          ? fieldData
          : []
      );
    });
  }, [loadFields, loadCrops]);

  const farmIdFromUrl = useMemo(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    return params.get("farmId") || "";
  }, []);

  useEffect(() => {
    if (
      farmIdFromUrl &&
      farms.some(
        farm =>
          String(farm.id) ===
          String(farmIdFromUrl)
      )
    ) {
      setForm(current => ({
        ...current,
        farmId: farmIdFromUrl,
      }));
    }
  }, [farmIdFromUrl, farms]);

  const farmFields = useMemo(() => {
    if (!form.farmId) return [];

    return fields.filter(field => {
      const id =
        field?.farmId ??
        field?.farm_id ??
        field?.farm?.id;

      return (
        String(id) ===
        String(form.farmId)
      );
    });
  }, [fields, form.farmId]);

  const selectedField = useMemo(
    () =>
      farmFields.find(field => {
        const id =
          field?.id ??
          field?._id ??
          field?.fieldId;

        return (
          String(id) ===
          String(form.fieldId)
        );
      }),
    [farmFields, form.fieldId]
  );

  const latitude =
    selectedField?.latitude ??
    selectedField?.lat ??
    selectedField?.location?.latitude ??
    selectedField?.location?.lat;

  const recommendedSeeds = useMemo(
    () => seeds(latitude),
    [latitude]
  );

  const change = e => {
    const { name, value } = e.target;

    setMessage("");

    setForm(current => ({
      ...current,
      [name]: value,
      ...(name === "farmId"
        ? { fieldId: "" }
        : {}),
    }));
  };

  const save = async e => {
    e.preventDefault();
    setMessage("");

    if (!form.farmId) {
      setMessage("يرجى اختيار المزرعة.");
      return;
    }

    if (!form.fieldId) {
      setMessage("يرجى اختيار الحقل.");
      return;
    }

    if (!form.name.trim()) {
      setMessage("يرجى كتابة اسم المحصول.");
      return;
    }

    await addCrop({
      ...form,
      seedQuantity: Number(form.seedQuantity || 0),
      fertilizerQuantity: Number(
        form.fertilizerQuantity || 0
      ),
      expectedProduction: Number(
        form.expectedProduction || 0
      ),
      latitude: latitude ?? null,
      longitude:
        selectedField?.longitude ??
        selectedField?.lng ??
        selectedField?.location?.longitude ??
        selectedField?.location?.lng ??
        null,
    });

    setForm(EMPTY);
  };

  return (
    <main
      dir="rtl"
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 12,
      }}
    >
      <h1>🌱 المحاصيل</h1>

      {(message || error) && (
        <div
          style={{
            padding: 10,
            marginBottom: 10,
            background: "#fff3cd",
            borderRadius: 8,
          }}
        >
          ⚠️ {message || error?.message}
        </div>
      )}

      <form onSubmit={save}>
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

          {farms.map(farm => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name ??
                farm.farmName ??
                farm.title}
            </option>
          ))}
        </select>

        <select
          name="fieldId"
          value={form.fieldId}
          onChange={change}
          disabled={!form.farmId}
          style={inputStyle}
        >
          <option value="">
            {form.farmId
              ? "اختر الحقل"
              : "اختر المزرعة أولًا"}
          </option>

          {farmFields.map(field => (
            <option
              key={field.id}
              value={field.id}
            >
              {field.name}
            </option>
          ))}
        </select>

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
          value={form.seedQuantity}
          onChange={change}
          placeholder="⚖️ وزن البذور بالكيلوغرام"
          style={inputStyle}
        />

        <input
          name="plantingDate"
          type="date"
          value={form.plantingDate}
          onChange={change}
          style={inputStyle}
        />

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
          style={inputStyle}
        />

        {recommendedSeeds.length > 0 && (
          <section
            style={{
              margin: "10px 0",
              padding: 12,
              borderRadius: 10,
              background: "#eef8ef",
            }}
          >
            <strong>
              🌱 توصية حسب مناخ موقع الحقل
            </strong>

            <p>
              المنطقة مناخيًا:{" "}
              {climate(latitude)}
            </p>

            {recommendedSeeds.map(seed => (
              <div key={seed}>
                🌾 {seed}
              </div>
            ))}
          </section>
        )}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? "جاري الحفظ..."
            : "حفظ المحصول"}
        </button>
      </form>

      <h2>🌾 المحاصيل المسجلة</h2>

      {crops.map(crop => (
        <article
          key={crop.id}
          style={{
            padding: 10,
            marginBottom: 8,
            borderRadius: 10,
            background: "#f5f5f5",
          }}
        >
          <strong>
            🌱 {crop.name}
          </strong>

          <div>
            🌾 {crop.seedType || "--"}
          </div>

          <button
            type="button"
            onClick={() =>
              deleteCrop(crop.id)
            }
          >
            🗑️ حذف
          </button>
        </article>
      ))}
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  marginBottom: 8,
  border: "1px solid #ccd5ce",
  borderRadius: 9,
  fontSize: 16,
  background: "#fff",
};

const buttonStyle = {
  padding: "10px 18px",
  border: 0,
  borderRadius: 9,
  cursor: "pointer",
};
