// src/pages/Harvest.jsx

import {
  useState,
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Harvest() {

  const {
    farms = [],
    fields = [],
    crops = [],
    harvests = [],
    harvestActions,
  } = useContext(FarmContext);


  const initialForm = {
    farmId: "",
    fieldId: "",
    cropId: "",
    quantity: "",
    quality: "",
    harvestDate: "",
    notes: "",
  };


  const [form, setForm] =
    useState(initialForm);

  const [editId, setEditId] =
    useState(null);

  const [error, setError] =
    useState(null);

  const [saving, setSaving] =
    useState(false);


  const updateForm = (
    key,
    value
  ) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError(null);
  };


  // =========================
  // Fields belonging to farm
  // =========================

  const farmFields = useMemo(() => {

    if (!form.farmId) {
      return [];
    }

    return fields.filter(
      (field) =>
        String(field.farmId) ===
        String(form.farmId)
    );

  }, [
    fields,
    form.farmId,
  ]);


  // =========================
  // Crops belonging to field
  // =========================

  const fieldCrops = useMemo(() => {

    if (!form.fieldId) {
      return [];
    }

    return crops.filter(
      (crop) =>
        String(crop.fieldId) ===
        String(form.fieldId)
    );

  }, [
    crops,
    form.fieldId,
  ]);


  // =========================
  // Total Harvest
  // =========================

  const totalHarvest = useMemo(() => {

    return harvests.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.quantity || 0
        ),
      0
    );

  }, [
    harvests,
  ]);


  // =========================
  // Save
  // =========================

  const save = async () => {

    setError(null);


    if (!form.farmId) {

      setError(
        "يرجى اختيار المزرعة."
      );

      return;
    }


    if (!form.fieldId) {

      setError(
        "يرجى اختيار الحقل."
      );

      return;
    }


    if (!form.cropId) {

      setError(
        "يرجى اختيار المحصول."
      );

      return;
    }


    if (
      form.quantity === "" ||
      Number(form.quantity) <= 0
    ) {

      setError(
        "يرجى إدخال كمية حصاد صحيحة."
      );

      return;
    }


    if (!harvestActions) {

      setError(
        "تعذر الوصول إلى نظام الحصاد."
      );

      return;
    }


    try {

      setSaving(true);


      const data = {

        farmId:
          form.farmId,

        fieldId:
          form.fieldId,

        cropId:
          form.cropId,

        quantity:
          Number(form.quantity),

        quality:
          form.quality.trim(),

        harvestDate:
          form.harvestDate,

        notes:
          form.notes.trim(),

      };


      if (editId) {

        await harvestActions.update(
          editId,
          data
        );

      } else {

        await harvestActions.create(
          data
        );

      }


      setForm({
        ...initialForm,
      });

      setEditId(null);


    } catch (err) {

      console.error(
        "Harvest save error:",
        err
      );


      setError(
        err?.message ||
        "تعذر حفظ بيانات الحصاد."
      );


    } finally {

      setSaving(false);

    }

  };


  // =========================
  // Edit
  // =========================

  const edit = (item) => {

    setError(null);


    setForm({

      farmId:
        item?.farmId ?? "",

      fieldId:
        item?.fieldId ?? "",

      cropId:
        item?.cropId ?? "",

      quantity:
        item?.quantity ?? "",

      quality:
        item?.quality ?? "",

      harvestDate:
        item?.harvestDate ?? "",

      notes:
        item?.notes ?? "",

    });


    setEditId(
      item.id
    );

  };


  // =========================
  // Delete
  // =========================

  const remove = async (id) => {

    try {

      setError(null);

      await harvestActions.delete(id);

    } catch (err) {

      console.error(
        "Harvest delete error:",
        err
      );

      setError(
        err?.message ||
        "تعذر حذف عملية الحصاد."
      );

    }

  };


  // =========================
  // UI
  // =========================

  return (

    <div>

      <h1>
        🚜 إدارة الحصاد
      </h1>


      <Card
        title={
          editId
            ? "✏️ تعديل الحصاد"
            : "➕ إضافة حصاد"
        }
      >

        {error && (

          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
            }}
          >

            ⚠️ {error}

          </div>

        )}


        {/* =========================
            Farm
        ========================= */}

        <select

          value={form.farmId}

          onChange={(e) => {

            const farmId =
              e.target.value;

            setForm((prev) => ({

              ...prev,

              farmId,

              fieldId: "",

              cropId: "",

            }));

            setError(null);

          }}

        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(
            (farm) => (

              <option
                key={farm.id}
                value={farm.id}
              >

                {farm.name}

              </option>

            )
          )}

        </select>


        {farms.length === 0 && (

          <p>
            ⚠️ لا توجد مزارع محفوظة.
          </p>

        )}


        <br />
        <br />


        {/* =========================
            Field
        ========================= */}

        <select

          value={form.fieldId}

          onChange={(e) => {

            const fieldId =
              e.target.value;

            setForm((prev) => ({

              ...prev,

              fieldId,

              cropId: "",

            }));

            setError(null);

          }}

          disabled={
            !form.farmId
          }

        >

          <option value="">
            اختر الحقل
          </option>


          {farmFields.map(
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


        {form.farmId &&
          farmFields.length === 0 && (

            <p>
              ⚠️ لا توجد حقول مرتبطة بهذه المزرعة.
            </p>

          )}


        <br />
        <br />


        {/* =========================
            Crop
        ========================= */}

        <select

          value={form.cropId}

          onChange={(e) =>
            updateForm(
              "cropId",
              e.target.value
            )
          }

          disabled={
            !form.fieldId
          }

        >

          <option value="">
            اختر المحصول
          </option>


          {fieldCrops.map(
            (crop) => (

              <option
                key={crop.id}
                value={crop.id}
              >

                {crop.name}

              </option>

            )
          )}

        </select>


        {form.fieldId &&
          fieldCrops.length === 0 && (

            <p>
              ⚠️ لا توجد محاصيل مرتبطة بهذا الحقل.
            </p>

          )}


        <br />
        <br />


        {/* =========================
            Quantity
        ========================= */}

        <input

          type="number"

          min="0"

          placeholder="كمية الحصاد بالكيلوغرام"

          value={
            form.quantity
          }

          onChange={(e) =>
            updateForm(
              "quantity",
              e.target.value
            )
          }

        />


        <br />
        <br />


        {/* =========================
            Quality
        ========================= */}

        <input

          type="text"

          placeholder="جودة المحصول"

          value={
            form.quality
          }

          onChange={(e) =>
            updateForm(
              "quality",
              e.target.value
            )
          }

        />


        <br />
        <br />


        {/* =========================
            Date
        ========================= */}

        <input

          type="date"

          value={
            form.harvestDate
          }

          onChange={(e) =>
            updateForm(
              "harvestDate",
              e.target.value
            )
          }

        />


        <br />
        <br />


        {/* =========================
            Notes
        ========================= */}

        <textarea

          placeholder="ملاحظات"

          value={
            form.notes
          }

          onChange={(e) =>
            updateForm(
              "notes",
              e.target.value
            )
          }

        />


        <br />
        <br />


        <Button
          onClick={save}
          disabled={saving}
        >

          {saving

            ? "⏳ جاري الحفظ..."

            : editId
              ? "💾 حفظ التعديل"
              : "➕ إضافة الحصاد"

          }

        </Button>


        {editId && (

          <Button

            onClick={() => {

              setForm({
                ...initialForm,
              });

              setEditId(null);

              setError(null);

            }}

          >

            إلغاء التعديل

          </Button>

        )}

      </Card>


      {/* =========================
          Statistics
      ========================= */}

      <Card
        title="📊 إحصائيات الحصاد"
      >

        <p>
          عدد عمليات الحصاد:
          {" "}
          {harvests.length}
        </p>


        <p>
          إجمالي الإنتاج:
          {" "}
          {totalHarvest}
          {" "}
          كغ
        </p>

      </Card>


      {/* =========================
          Harvest List
      ========================= */}

      <Card
        title="📋 سجل الحصاد"
      >

        {harvests.length === 0 && (

          <p>
            لا توجد عمليات حصاد محفوظة حتى الآن.
          </p>

        )}


        {harvests.map(
          (item) => (

            <Card
              key={item.id}
              title="🚜 عملية حصاد"
            >

              <p>
                🚜 الكمية:
                {" "}
                {item.quantity ?? 0}
                {" "}
                كغ
              </p>


              <p>
                🌾 الجودة:
                {" "}
                {item.quality || "--"}
              </p>


              <p>
                📅 التاريخ:
                {" "}
                {item.harvestDate || "--"}
              </p>


              <p>
                📝 الملاحظات:
                {" "}
                {item.notes || "--"}
              </p>


              <Button
                onClick={() =>
                  edit(item)
                }
              >

                تعديل

              </Button>


              <Button
                onClick={() =>
                  remove(item.id)
                }
              >

                حذف

              </Button>

            </Card>

          )
        )}

      </Card>

    </div>

  );

}
