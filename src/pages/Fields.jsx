// src/pages/Fields.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Card from "../components/Card";
import Button from "../components/Button";

import useFarms from "../hooks/useFarms";
import useFields from "../hooks/useFields";


export default function Fields() {

  const {
    loadFarms,
  } = useFarms();


  const {
    loadFields,
    addField,
    updateField,
    deleteField,
  } = useFields();


  const [farms, setFarms] =
    useState([]);

  const [fields, setFields] =
    useState([]);


  const emptyForm = {

    farmId: "",
    name: "",
    soilType: "",
    area: "",
    crop: "",
    plantingDate: "",
    notes: "",

  };


  const [form, setForm] =
    useState(emptyForm);

  const [editId, setEditId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [farmFilter, setFarmFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================
  // Load Farms + Fields
  // =========================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          farmsData,
          fieldsData,
        ] = await Promise.all([

          loadFarms(),

          loadFields(),

        ]);


        if (!mounted) {
          return;
        }


        setFarms(
          Array.isArray(farmsData)
            ? farmsData
            : []
        );


        setFields(
          Array.isArray(fieldsData)
            ? fieldsData
            : []
        );


      } catch (err) {

        console.error(
          "Fields loading error:",
          err
        );


        if (mounted) {

          setError(
            err?.message ||
            "تعذر تحميل بيانات الحقول."
          );

          setFarms([]);
          setFields([]);

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    loadData();


    return () => {

      mounted = false;

    };

  }, [
    loadFarms,
    loadFields,
  ]);


  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));


    setError("");

  };


  // =========================
  // Reset
  // =========================

  const clearForm = () => {

    setForm({
      ...emptyForm,
    });

    setEditId(null);

    setError("");

  };


  // =========================
  // Save
  // =========================

  const saveField = async () => {

    setError("");


    if (!form.farmId) {

      setError(
        "يرجى اختيار المزرعة."
      );

      return;

    }


    if (!form.name.trim()) {

      setError(
        "يرجى إدخال اسم الحقل."
      );

      return;

    }


    try {

      setSaving(true);


      const fieldData = {

        ...form,

        farmId: form.farmId,

        area:
          Number(form.area || 0),

        updatedAt:
          new Date().toISOString(),

      };


      if (editId) {

        const updated =
          await updateField(
            editId,
            fieldData
          );


        setFields((prev) =>
          prev.map((field) =>
            String(field.id) ===
            String(editId)
              ? updated
              : field
          )
        );


      } else {

        const created =
          await addField({

            ...fieldData,

            createdAt:
              new Date().toISOString(),

          });


        setFields((prev) => [

          ...prev,

          created,

        ]);

      }


      clearForm();


    } catch (err) {

      console.error(
        "Field save error:",
        err
      );


      setError(
        err?.message ||
        "تعذر حفظ الحقل."
      );


    } finally {

      setSaving(false);

    }

  };


  // =========================
  // Edit
  // =========================

  const editField = (field) => {

    setForm({

      farmId:
        field?.farmId ??
        field?.farm_id ??
        "",

      name:
        field?.name ??
        "",

      soilType:
        field?.soilType ??
        field?.soil_type ??
        "",

      area:
        field?.area ??
        "",

      crop:
        field?.crop ??
        "",

      plantingDate:
        field?.plantingDate ??
        field?.planting_date ??
        "",

      notes:
        field?.notes ??
        "",

    });


    setEditId(
      field?.id ?? null
    );


    setError("");

  };


  // =========================
  // Delete
  // =========================

  const removeField = async (id) => {

    if (!id) {
      return;
    }


    const confirmed =
      window.confirm(
        "هل تريد حذف هذا الحقل؟"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      await deleteField(id);


      setFields((prev) =>
        prev.filter(
          (field) =>
            String(field.id) !==
            String(id)
        )
      );


      if (
        String(editId) ===
        String(id)
      ) {

        clearForm();

      }


    } catch (err) {

      console.error(
        "Field delete error:",
        err
      );


      setError(
        err?.message ||
        "تعذر حذف الحقل."
      );

    }

  };


  // =========================
  // Farm Name
  // =========================

  const getFarmName = (farmId) => {

    const farm =
      farms.find(
        (item) =>
          String(item?.id) ===
          String(farmId)
      );


    return farm?.name ||
      "غير محددة";

  };


  // =========================
  // Filter
  // =========================

  const filteredFields =
    useMemo(() => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      return fields.filter(
        (field) => {

          const fieldName =
            String(
              field?.name ?? ""
            )
              .toLowerCase();


          const fieldFarmId =
            field?.farmId ??
            field?.farm_id ??
            field?.farm?.id ??
            "";


          const searchMatch =
            !searchValue ||
            fieldName.includes(
              searchValue
            );


          const farmMatch =
            !farmFilter ||
            String(fieldFarmId) ===
            String(farmFilter);


          return (
            searchMatch &&
            farmMatch
          );

        }
      );

    }, [

      fields,

      search,

      farmFilter,

    ]);


  // =========================
  // UI
  // =========================

  return (

    <div>

      <h1>
        🌱 إدارة الحقول الذكية
      </h1>


      {error && (

        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >

          ⚠️ {error}

        </div>

      )}


      <Card

        title={
          editId
            ? "✏️ تعديل الحقل"
            : "➕ إضافة حقل"
        }

      >

        <select

          name="farmId"

          value={
            form.farmId
          }

          onChange={
            handleChange
          }

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


        <br />
        <br />


        <input

          name="name"

          placeholder="اسم الحقل"

          value={
            form.name
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          name="soilType"

          placeholder="نوع التربة"

          value={
            form.soilType
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          name="area"

          type="number"

          min="0"

          step="0.01"

          placeholder="مساحة الحقل"

          value={
            form.area
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          name="crop"

          placeholder="المحصول"

          value={
            form.crop
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          name="plantingDate"

          type="date"

          value={
            form.plantingDate
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <textarea

          name="notes"

          placeholder="ملاحظات"

          value={
            form.notes
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <Button

          onClick={
            saveField
          }

          disabled={
            saving
          }

        >

          {saving

            ? "جاري الحفظ..."

            : editId
              ? "حفظ التعديل"
              : "إضافة الحقل"

          }

        </Button>


        {editId && (

          <Button
            onClick={
              clearForm
            }
          >

            إلغاء التعديل

          </Button>

        )}

      </Card>


      <Card
        title="🔎 البحث والفلترة"
      >

        <input

          placeholder="بحث عن حقل"

          value={
            search
          }

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />


        <br />
        <br />


        <select

          value={
            farmFilter
          }

          onChange={(e) =>
            setFarmFilter(
              e.target.value
            )
          }

        >

          <option value="">
            كل المزارع
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

      </Card>


      <h2>
        📋 قائمة الحقول
      </h2>


      {loading ? (

        <p>
          ⏳ جاري تحميل الحقول...
        </p>

      ) : filteredFields.length === 0 ? (

        <p>
          لا توجد حقول مسجلة.
        </p>

      ) : (

        filteredFields.map(
          (field) => (

            <Card

              key={
                field.id
              }

              title={
                `🌱 ${field.name}`
              }

            >

              <p>
                🚜 المزرعة:
                {" "}
                {
                  getFarmName(
                    field.farmId ??
                    field.farm_id ??
                    field.farm?.id
                  )
                }
              </p>


              <p>
                🌍 التربة:
                {" "}
                {
                  field.soilType ??
                  field.soil_type ??
                  ""
                }
              </p>


              <p>
                📏 المساحة:
                {" "}
                {field.area || 0}
                {" "}
                دونم
              </p>


              <p>
                🌾 المحصول:
                {" "}
                {field.crop || ""}
              </p>


              <p>
                📅 الزراعة:
                {" "}
                {
                  field.plantingDate ??
                  field.planting_date ??
                  ""
                }
              </p>


              <p>
                📝
                {" "}
                {
                  field.notes ||
                  "لا يوجد"
                }
              </p>


              <Button

                onClick={() =>
                  editField(field)
                }

              >

                ✏️ تعديل

              </Button>


              <Button

                onClick={() =>
                  removeField(
                    field.id
                  )
                }

              >

                🗑️ حذف

              </Button>


            </Card>

          )
        )

      )}

    </div>

  );

}
