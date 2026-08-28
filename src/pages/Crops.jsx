// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

import useFarms from "../hooks/useFarms.js";
import useFields from "../hooks/useFields.js";
import useCrops from "../hooks/useCrops.js";
import useMap from "../hooks/useMap.js";

const EMPTY_FORM = {
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

const styles = {
  page: {
    direction: "rtl",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "18px 14px 40px",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    margin: "8px 0 24px",
    fontSize: "clamp(25px, 6vw, 34px)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },

  field: {
    width: "100%",
    minHeight: "58px",
    padding: "15px 16px",
    border: "1px solid #cbd5cf",
    borderRadius: "12px",
    background: "#fff",
    fontSize: "18px",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "15px 16px",
    border: "1px solid #cbd5cf",
    borderRadius: "12px",
    background: "#fff",
    fontSize: "18px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "17px",
    fontWeight: "600",
  },

  group: {
    marginBottom: "2px",
  },

  recommendation: {
    marginTop: "24px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f1f8f2",
    border: "1px solid #c9dfce",
  },

  seedOption: {
    padding: "13px 15px",
    marginTop: "10px",
    borderRadius: "10px",
    background: "#fff",
    border: "1px solid #d5e2d7",
    fontSize: "17px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "24px",
  },

  listGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  cropCard: {
    minWidth: 0,
  },

  info: {
    margin: "9px 0",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "12px",
    background: "#fff0f0",
    color: "#a00020",
    fontSize: "17px",
  },
};

export default function Crops() {
  const {
    farms = [],
    loadFarms,
  } = useFarms();

  const {
    loadFields,
  } = useFields();

  const {
    crops,
    loading,
    error,
    loadCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
    getRecommendation,
  } = useCrops();

  const {
    locations = [],
    loadLocations,
  } = useMap();

  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [
          farmData,
          fieldData,
          cropData,
          locationData,
        ] = await Promise.all([
          loadFarms(),
          loadFields(),
          loadCrops(),
          loadLocations(),
        ]);

        if (!active) return;

        setFields(
          Array.isArray(fieldData)
            ? fieldData
            : []
        );

        void farmData;
        void cropData;
        void locationData;
      } catch (err) {
        if (active) {
          setPageError(
            err?.message ||
            "تعذر تحميل بيانات المحاصيل."
          );
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [
    loadFarms,
    loadFields,
    loadCrops,
    loadLocations,
  ]);

  const fieldsByFarm = useMemo(() => {
    if (!form.farmId) return [];

    return fields.filter((field) => {
      const id =
        field?.farmId ??
        field?.farm_id ??
        field?.farm?.id;

      return String(id) === String(form.farmId);
    });
  }, [fields, form.farmId]);

  const selectedLocation = useMemo(() => {
    if (!form.fieldId) return null;

    return (
      locations.find((location) => {
        const id =
          location?.fieldId ??
          location?.field_id;

        return (
          String(id) ===
          String(form.fieldId)
        );
      }) || null
    );
  }, [locations, form.fieldId]);

  const recommendation = useMemo(
    () =>
      getRecommendation(
        selectedLocation
      ),
    [
      selectedLocation,
      getRecommendation,
    ]
  );

  const filteredCrops = useMemo(
    () =>
      searchCrops(
        crops,
        search
      ),
    [
      crops,
      search,
      searchCrops,
    ]
  );

  const change = ({
    target: { name, value },
  }) => {
    setPageError("");

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "farmId"
        ? { fieldId: "" }
        : {}),
    }));
  };

  const reset = () => {
    setForm({
      ...EMPTY_FORM,
    });
    setEditId(null);
    setPageError("");
  };

  const save = async () => {
    setPageError("");

    if (!form.farmId) {
      setPageError("يرجى اختيار المزرعة.");
      return;
    }

    if (!form.fieldId) {
      setPageError("يرجى اختيار الحقل.");
      return;
    }

    if (!form.name.trim()) {
      setPageError(
        "يرجى كتابة اسم المحصول."
      );
      return;
    }

    try {
      const data = {
        ...form,

        seedQuantity:
          Number(form.seedQuantity || 0),

        fertilizerQuantity:
          Number(
            form.fertilizerQuantity || 0
          ),

        expectedProduction:
          Number(
            form.expectedProduction || 0
          ),

        locationId:
          selectedLocation?.id || null,

        latitude:
          selectedLocation?.latitude ??
          null,

        longitude:
          selectedLocation?.longitude ??
          null,
      };

      if (editId) {
        await updateCrop(
          editId,
          data
        );
      } else {
        await addCrop(data);
      }

      reset();
    } catch (err) {
      setPageError(
        err?.message ||
        "تعذر حفظ المحصول."
      );
    }
  };

  const edit = (crop) => {
    setForm({
      ...EMPTY_FORM,
      ...crop,

      farmId:
        crop?.farmId ??
        crop?.farm_id ??
        "",

      fieldId:
        crop?.fieldId ??
        crop?.field_id ??
        "",

      seedType:
        crop?.seedType ??
        crop?.seed_type ??
        "",

      seedVariety:
        crop?.seedVariety ??
        crop?.seed_variety ??
        "",

      seedQuality:
        crop?.seedQuality ??
        crop?.seed_quality ??
        "",

      seedQuantity:
        crop?.seedQuantity ??
        crop?.seed_quantity ??
        "",

      plantingDate:
        crop?.plantingDate ??
        crop?.planting_date ??
        "",

      fertilizerType:
        crop?.fertilizerType ??
        crop?.fertilizer_type ??
        "",

      fertilizerQuantity:
        crop?.fertilizerQuantity ??
        crop?.fertilizer_quantity ??
        "",

      harvestDate:
        crop?.harvestDate ??
        crop?.harvest_date ??
        "",

      expectedProduction:
        crop?.expectedProduction ??
        crop?.expected_production ??
        "",
    });

    setEditId(crop?.id || null);
    setPageError("");
  };

  const farmName = (id) =>
    farms.find(
      (farm) =>
        String(
          farm?.id ??
          farm?._id ??
          farm?.farmId
        ) === String(id)
    )?.name ||
    "غير محددة";

  const fieldName = (id) =>
    fields.find(
      (field) =>
        String(field?.id) ===
        String(id)
    )?.name ||
    "غير محدد";

  const input = (
    name,
    placeholder,
    type = "text"
  ) => (
    <div style={styles.group}>
      <label style={styles.label}>
        {placeholder}
      </label>

      <input
        name={name}
        type={type}
        value={form[name] ?? ""}
        onChange={change}
        style={styles.field}
      />
    </div>
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>
        🌱 المحاصيل
      </h1>

      {(pageError || error) && (
        <div style={styles.error}>
          ⚠️{" "}
          {pageError ||
            error?.message ||
            "حدث خطأ غير معروف."}
        </div>
      )}

      <Card
        title={
          editId
            ? "✏️ تعديل بيانات المحصول"
            : "➕ تسجيل محصول جديد"
        }
      >
        <div style={styles.formGrid}>

          <div style={styles.group}>
            <label style={styles.label}>
              🚜 المزرعة
            </label>

            <select
              name="farmId"
              value={form.farmId}
              onChange={change}
              style={styles.field}
            >
              <option value="">
                اختر المزرعة
              </option>

              {farms.map((farm) => {
                const id =
                  farm?.id ??
                  farm?._id ??
                  farm?.farmId;

                const name =
                  farm?.name ??
                  farm?.farmName ??
                  farm?.title ??
                  "مزرعة";

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>
              📍 الحقل
            </label>

            <select
              name="fieldId"
              value={form.fieldId}
              onChange={change}
              disabled={!form.farmId}
              style={styles.field}
            >
              <option value="">
                {form.farmId
                  ? "اختر الحقل"
                  : "اختر المزرعة أولًا"}
              </option>

              {fieldsByFarm.map(
                (field) => (
                  <option
                    key={field.id}
                    value={field.id}
                  >
                    {field.name}
                  </option>
                )
              )}
            </select>
          </div>

          {input(
            "name",
            "🌾 ماذا زرعت؟"
          )}

          {input(
            "seedType",
            "🌱 نوع البذور"
          )}

          {input(
            "seedVariety",
            "🔖 صنف البذور"
          )}

          <div style={styles.group}>
            <label style={styles.label}>
              ⭐ جودة البذور
            </label>

            <select
              name="seedQuality"
              value={form.seedQuality}
              onChange={change}
              style={styles.field}
            >
              <option value="">
                اختر الجودة
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
          </div>

          {input(
            "seedQuantity",
            "⚖️ وزن البذور بالكيلوغرام",
            "number"
          )}

          {input(
            "plantingDate",
            "📅 تاريخ الزراعة",
            "date"
          )}

          {input(
            "fertilizerType",
            "🧪 نوع السماد"
          )}

          {input(
            "fertilizerQuantity",
            "⚖️ كمية السماد بالكيلوغرام",
            "number"
          )}

          {input(
            "harvestDate",
            "📅 موعد الحصاد المتوقع",
            "date"
          )}

          {input(
            "expectedProduction",
            "📦 الإنتاج المتوقع بالكيلوغرام",
            "number"
          )}

          <div style={styles.group}>
            <label style={styles.label}>
              🌿 عمر النبات
            </label>

            <input
              value={
                form.plantingDate
                  ? Math.max(
                      0,
                      Math.floor(
                        (
                          Date.now() -
                          new Date(
                            form.plantingDate
                          )
                        ) /
                        86400000
                      )
                    )
                  : ""
              }
              readOnly
              placeholder="يُحسب من تاريخ الزراعة"
              style={styles.field}
            />
          </div>
        </div>

        <div
          style={{
            ...styles.group,
            marginTop: "20px",
          }}
        >
          <label style={styles.label}>
            📝 ملاحظات
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={change}
            placeholder="اكتب أي ملاحظات عن الزراعة أو البذور أو السماد"
            style={styles.textarea}
          />
        </div>

        {recommendation && (
          <div style={styles.recommendation}>
            <h3>
              🌱 توصية بزراعة بذور مناسبة للمنطقة
            </h3>

            <p>
              {recommendation.message}
            </p>

            {recommendation.seeds.map(
              (seed) => (
                <div
                  key={seed}
                  style={styles.seedOption}
                >
                  🌾 {seed}
                </div>
              )
            )}
          </div>
        )}

        <div style={styles.actions}>
          <Button
            onClick={save}
            disabled={loading}
          >
            {loading
              ? "جاري الحفظ..."
              : editId
                ? "حفظ التعديل"
                : "حفظ المحصول"}
          </Button>

          {editId && (
            <Button onClick={reset}>
              إلغاء التعديل
            </Button>
          )}
        </div>
      </Card>

      <Card title="🔎 البحث">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="ابحث عن محصول أو نوع أو صنف البذور"
          style={styles.field}
        />
      </Card>

      <h2>
        🌾 المحاصيل المسجلة
      </h2>

      <div style={styles.listGrid}>
        {filteredCrops.map((crop) => (
          <Card
            key={crop.id}
            title={`🌱 ${crop.name}`}
          >
            <div style={styles.cropCard}>

              <p style={styles.info}>
                🚜 المزرعة:{" "}
                {farmName(
                  crop.farmId ??
                  crop.farm_id
                )}
              </p>

              <p style={styles.info}>
                📍 الحقل:{" "}
                {fieldName(
                  crop.fieldId ??
                  crop.field_id
                )}
              </p>

              <p style={styles.info}>
                🌱 البذور:{" "}
                {crop.seedType ??
                  crop.seed_type ??
                  "--"}
              </p>

              <p style={styles.info}>
                🔖 الصنف:{" "}
                {crop.seedVariety ??
                  crop.seed_variety ??
                  "--"}
              </p>

              <p style={styles.info}>
                ⭐ الجودة:{" "}
                {crop.seedQuality ??
                  crop.seed_quality ??
                  "--"}
              </p>

              <p style={styles.info}>
                ⚖️ البذور:{" "}
                {crop.seedQuantity ??
                  crop.seed_quantity ??
                  "--"}{" "}
                كغ
              </p>

              <p style={styles.info}>
                📅 الزراعة:{" "}
                {crop.plantingDate ??
                  crop.planting_date ??
                  "--"}
              </p>

              <p style={styles.info}>
                🧪 السماد:{" "}
                {crop.fertilizerType ??
                  crop.fertilizer_type ??
                  "--"}
              </p>

              <p style={styles.info}>
                ⚖️ السماد:{" "}
                {crop.fertilizerQuantity ??
                  crop.fertilizer_quantity ??
                  "--"}{" "}
                كغ
              </p>

              <p style={styles.info}>
                📅 الحصاد المتوقع:{" "}
                {crop.harvestDate ??
                  crop.harvest_date ??
                  "--"}
              </p>

              <p style={styles.info}>
                📦 الإنتاج المتوقع:{" "}
                {crop.expectedProduction ??
                  crop.expected_production ??
                  "--"}{" "}
                كغ
              </p>

              <p style={styles.info}>
                📝{" "}
                {crop.notes ||
                  "لا توجد ملاحظات"}
              </p>

              <div style={styles.actions}>
                <Button
                  onClick={() =>
                    edit(crop)
                  }
                >
                  ✏️ تعديل
                </Button>

                <Button
                  onClick={() =>
                    deleteCrop(crop.id)
                  }
                >
                  🗑️ حذف
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
