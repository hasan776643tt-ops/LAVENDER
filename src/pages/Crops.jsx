// src/pages/Crops.jsx

import { useEffect, useMemo, useState } from "react";

import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

import useFarms from "../hooks/useFarms.js";
import useFields from "../hooks/useFields.js";
import useCrops from "../hooks/useCrops.js";

const emptyForm = {
  farmId: "",
  fieldId: "",
  name: "",
  seedType: "",
  variety: "",
  seedSource: "",
  seedQuality: "",
  seedQuantity: "",
  seedUnit: "كغ",
  area: "",
  plantingDate: "",
  harvestDate: "",
  fertilizerType: "",
  fertilizerQuantity: "",
  fertilizerUnit: "كغ",
  plantingMethod: "",
  season: "",
  expectedProduction: "",
  notes: "",
};

const plantAge = (date) => {
  if (!date) return "--";

  const start = new Date(date);
  const today = new Date();

  if (Number.isNaN(start.getTime()) || start > today) return "--";

  const days = Math.floor(
    (today - start) / 86400000
  );

  const months = Math.floor(days / 30);
  const remaining = days % 30;

  return months
    ? `${months} شهر${remaining ? ` و${remaining} يوم` : ""}`
    : `${days} يوم`;
};

export default function Crops() {
  const { loadFarms } = useFarms();
  const { loadFields } = useFields();

  const {
    crops,
    loading,
    error,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
  } = useCrops();

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([loadFarms(), loadFields()])
      .then(([farmData, fieldData]) => {
        if (!active) return;

        setFarms(Array.isArray(farmData) ? farmData : []);
        setFields(Array.isArray(fieldData) ? fieldData : []);
      })
      .catch((err) => {
        if (active) {
          setPageError(
            err?.message ||
            "تعذر تحميل بيانات المزارع والحقول."
          );
        }
      })
      .finally(() => {
        if (active) setPageLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadFarms, loadFields]);

  const farmFields = useMemo(
    () =>
      fields.filter((field) =>
        String(
          field?.farmId ??
          field?.farm_id ??
          field?.farm?.id ??
          ""
        ) === String(form.farmId)
      ),
    [fields, form.farmId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "farmId" ? { fieldId: "" } : {}),
    }));

    setPageError("");
  };

  const clearForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
  };

  const saveCrop = async () => {
    if (!form.farmId || !form.fieldId || !form.name.trim()) {
      setPageError(
        "يرجى اختيار المزرعة والحقل وإدخال اسم المحصول."
      );
      return;
    }

    try {
      const data = {
        ...form,
        seedQuantity: Number(form.seedQuantity || 0),
        area: Number(form.area || 0),
        fertilizerQuantity: Number(
          form.fertilizerQuantity || 0
        ),
        expectedProduction: Number(
          form.expectedProduction || 0
        ),
      };

      if (editId) {
        await updateCrop(editId, data);
      } else {
        await addCrop(data);
      }

      clearForm();
    } catch (err) {
      setPageError(
        err?.message || "تعذر حفظ بيانات المحصول."
      );
    }
  };

  const editCrop = (crop) => {
    setForm({
      ...emptyForm,
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
      seedSource:
        crop?.seedSource ??
        crop?.seed_source ??
        "",
      seedQuality:
        crop?.seedQuality ??
        crop?.seed_quality ??
        "",
      seedQuantity:
        crop?.seedQuantity ??
        crop?.seed_quantity ??
        "",
      seedUnit:
        crop?.seedUnit ??
        crop?.seed_unit ??
        "كغ",
      fertilizerType:
        crop?.fertilizerType ??
        crop?.fertilizer_type ??
        "",
      fertilizerQuantity:
        crop?.fertilizerQuantity ??
        crop?.fertilizer_quantity ??
        "",
      fertilizerUnit:
        crop?.fertilizerUnit ??
        crop?.fertilizer_unit ??
        "كغ",
      plantingDate:
        crop?.plantingDate ??
        crop?.planting_date ??
        "",
      plantingMethod:
        crop?.plantingMethod ??
        crop?.planting_method ??
        "",
    });

    setEditId(crop?.id ?? null);
  };

  const filteredCrops = useMemo(
    () => searchCrops(crops, search),
    [crops, search, searchCrops]
  );

  const getName = (items, id, fallback) =>
    items.find(
      (item) => String(item?.id) === String(id)
    )?.name || fallback;

  return (
    <div dir="rtl">
      <h1>🌱 المحاصيل</h1>

      {(pageError || error) && (
        <div className="crop-error">
          ⚠️ {pageError || error?.message}
        </div>
      )}

      <Card
        title={
          editId
            ? "✏️ تعديل المحصول"
            : "➕ تسجيل محصول جديد"
        }
      >
        <select
          name="farmId"
          value={form.farmId}
          onChange={handleChange}
          disabled={pageLoading}
        >
          <option value="">اختر المزرعة</option>

          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>

        <select
          name="fieldId"
          value={form.fieldId}
          onChange={handleChange}
          disabled={!form.farmId}
        >
          <option value="">
            {form.farmId
              ? "اختر الحقل"
              : "اختر المزرعة أولًا"}
          </option>

          {farmFields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="ماذا زرعت؟"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="seedType"
          placeholder="نوع البذار"
          value={form.seedType}
          onChange={handleChange}
        />

        <input
          name="variety"
          placeholder="صنف البذار"
          value={form.variety}
          onChange={handleChange}
        />

        <input
          name="seedSource"
          placeholder="مصدر البذار"
          value={form.seedSource}
          onChange={handleChange}
        />

        <input
          name="seedQuality"
          placeholder="جودة البذار"
          value={form.seedQuality}
          onChange={handleChange}
        />

        <input
          type="number"
          min="0"
          name="seedQuantity"
          placeholder="كمية البذار"
          value={form.seedQuantity}
          onChange={handleChange}
        />

        <select
          name="seedUnit"
          value={form.seedUnit}
          onChange={handleChange}
        >
          <option value="كغ">كغ</option>
          <option value="طن">طن</option>
        </select>

        <input
          type="number"
          min="0"
          name="area"
          placeholder="المساحة المزروعة"
          value={form.area}
          onChange={handleChange}
        />

        <input
          type="date"
          name="plantingDate"
          value={form.plantingDate}
          onChange={handleChange}
        />

        {form.plantingDate && (
          <p>
            📅 عمر النبات:{" "}
            <strong>{plantAge(form.plantingDate)}</strong>
          </p>
        )}

        <input
          type="date"
          name="harvestDate"
          value={form.harvestDate}
          onChange={handleChange}
        />

        <input
          name="fertilizerType"
          placeholder="نوع السماد المستخدم"
          value={form.fertilizerType}
          onChange={handleChange}
        />

        <input
          type="number"
          min="0"
          name="fertilizerQuantity"
          placeholder="كمية السماد"
          value={form.fertilizerQuantity}
          onChange={handleChange}
        />

        <select
          name="fertilizerUnit"
          value={form.fertilizerUnit}
          onChange={handleChange}
        >
          <option value="كغ">كغ</option>
          <option value="طن">طن</option>
        </select>

        <input
          name="plantingMethod"
          placeholder="طريقة الزراعة"
          value={form.plantingMethod}
          onChange={handleChange}
        />

        <input
          name="season"
          placeholder="الموسم الزراعي"
          value={form.season}
          onChange={handleChange}
        />

        <input
          type="number"
          min="0"
          name="expectedProduction"
          placeholder="الإنتاج المتوقع"
          value={form.expectedProduction}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="ملاحظات الزراعة"
          value={form.notes}
          onChange={handleChange}
        />

        <Button
          onClick={saveCrop}
          disabled={loading || pageLoading}
        >
          {loading
            ? "جاري الحفظ..."
            : editId
              ? "حفظ التعديل"
              : "حفظ المحصول"}
        </Button>

        {editId && (
          <Button onClick={clearForm}>
            إلغاء التعديل
          </Button>
        )}
      </Card>

      <Card title="🔎 البحث">
        <input
          placeholder="ابحث عن محصول"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <h2>🌾 المحاصيل المسجلة</h2>

      {filteredCrops.map((crop) => (
        <Card
          key={crop.id}
          title={`🌱 ${crop.name}`}
        >
          <p>
            🚜 المزرعة:{" "}
            {getName(
              farms,
              crop.farmId ?? crop.farm_id,
              "غير محددة"
            )}
          </p>

          <p>
            📍 الحقل:{" "}
            {getName(
              fields,
              crop.fieldId ?? crop.field_id,
              "غير محدد"
            )}
          </p>

          <p>
            🌱 البذار:{" "}
            {crop.seedType || "--"}{" "}
            {crop.variety || ""}
          </p>

          <p>
            📦 الكمية:{" "}
            {crop.seedQuantity || 0}{" "}
            {crop.seedUnit || "كغ"}
          </p>

          <p>
            📅 الزراعة:{" "}
            {crop.plantingDate || "--"}
          </p>

          <p>
            🌿 العمر:{" "}
            {plantAge(crop.plantingDate)}
          </p>

          <p>
            📏 المساحة:{" "}
            {crop.area || 0}
          </p>

          <p>
            🧪 السماد:{" "}
            {crop.fertilizerType || "--"}{" "}
            {crop.fertilizerQuantity || 0}{" "}
            {crop.fertilizerUnit || "كغ"}
          </p>

          <p>
            📝 {crop.notes || "--"}
          </p>

          <Button onClick={() => editCrop(crop)}>
            ✏️ تعديل
          </Button>

          <Button
            onClick={() => deleteCrop(crop.id)}
          >
            🗑️ حذف
          </Button>
        </Card>
      ))}
    </div>
  );
}
