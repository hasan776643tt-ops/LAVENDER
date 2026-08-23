// src/pages/Harvest.jsx

import {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

import useFarms from "../hooks/useFarms";
import useFields from "../hooks/useFields";
import useCrops from "../hooks/useCrops";


export default function Harvest() {

  const {
    harvests = [],
    harvestActions,
  } = useContext(FarmContext);


  const {
    loadFarms,
  } = useFarms();


  const {
    loadFields,
  } = useFields();


  const {
    crops = [],
    loadCrops,
  } = useCrops();


  const [farms, setFarms] =
    useState([]);


  const [fields, setFields] =
    useState([]);


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
    useState("");


  const [saving, setSaving] =
    useState(false);


  // =========================
  // Load Farms / Fields
  // =========================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

      try {

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
          "Harvest data loading error:",
          err
        );


        if (mounted) {

          setFarms([]);
          setFields([]);

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
  // Form
  // =========================

  const updateForm = (
    key,
    value
  ) => {

    setForm((prev) => ({

      ...prev,

      [key]: value,

    }));

    setError("");

  };


  // =========================
  // Farms
  // =========================

  const availableFarms =
    useMemo(() => {

      return Array.isArray(farms)
        ? farms
        : [];

    }, [farms]);


  // =========================
  // Fields By Farm
  // =========================

  const farmFields =
    useMemo(() => {

      if (!form.farmId) {
        return [];
      }


      return fields.filter(
        (field) => {

          const fieldFarmId =

            field?.farmId ??
            field?.farm_id ??
            field?.farm?.id ??
            "";


          return (

            String(fieldFarmId) ===
            String(form.farmId)

          );

        }
      );

    }, [
      fields,
      form.farmId,
    ]);


  // =========================
  // Crops By Field
  // =========================

  const fieldCrops =
    useMemo(() => {

      if (!form.fieldId) {
        return [];
      }


      return crops.filter(
        (crop) => {

          const cropFieldId =

            crop?.fieldId ??
            crop?.field_id ??
            crop?.field?.id ??
            "";


          return (

            String(cropFieldId) ===
            String(form.fieldId)

          );

        }
      );

    }, [
      crops,
      form.fieldId,
    ]);


  // =========================
  // Statistics
  // =========================

  const totalHarvest =
    useMemo(() => {

      return harvests.reduce(

        (sum, item) =>

          sum +
          Number(
            item?.quantity || 0
          ),

        0

      );

    }, [
      harvests
    ]);


  // =========================
  // Names
  // =========================

  const getFarmName =
    (farmId) => {

      const farm =
        availableFarms.find(
          (item) =>
            String(item?.id) ===
            String(farmId)
        );


      return (
        farm?.name ||
        "مزرعة غير معروفة"
      );

    };


  const getFieldName =
    (fieldId) => {

      const field =
        fields.find(
          (item) =>
            String(item?.id) ===
            String(fieldId)
        );


      return (
        field?.name ||
        "حقل غير معروف"
      );

    };


  const getCropName =
    (cropId) => {

      const crop =
        crops.find(
          (item) =>
            String(item?.id) ===
            String(cropId)
        );


      return (
        crop?.name ||
        "محصول غير معروف"
      );

    };


  // =========================
  // Save
  // =========================

  const save = async () => {

    setError("");


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
        "إدارة الحصاد غير متاحة."
      );

      return;

    }


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
        String(
          form.quality || ""
        ).trim(),

      harvestDate:
        form.harvestDate,

      notes:
        String(
          form.notes || ""
        ).trim(),

    };


    try {

      setSaving(true);


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

      setError("");


    } catch (err) {

      console.error(
        "Harvest save error:",
        err
      );


      setError(
        err?.message ||
        "تعذر حفظ عملية الحصاد."
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================
  // Edit
  // =========================

  const edit = (item) => {

    setForm({

      farmId:
        item?.farmId ??
        item?.farm_id ??
        "",

      fieldId:
        item?.fieldId ??
        item?.field_id ??
        "",

      cropId:
        item?.cropId ??
        item?.crop_id ??
        "",

      quantity:
        item?.quantity ??
        "",

      quality:
        item?.quality ??
        "",

      harvestDate:
        item?.harvestDate ??
        item?.harvest_date ??
        "",

      notes:
        item?.notes ??
        "",

    });


    setEditId(
      item?.id ?? null
    );


    setError("");

  };


  // =========================
  // Delete
  // =========================

  const remove = async (id) => {

    if (!id) {
      return;
    }


    const confirmed =
      window.confirm(
        "هل تريد حذف عملية الحصاد؟"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      await harvestActions.delete(
        id
      );


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
  // Cancel
  // =========================

  const cancelEdit = () => {

    setForm({
      ...initialForm,
    });


    setEditId(null);

    setError("");

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


            setError("");

          }}
        >

          <option value="">
            اختر المزرعة
          </option>


          {availableFarms.map(
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


            setError("");

          }}
          disabled={
            !form.farmId ||
            farmFields.length === 0
          }
        >

          <option value="">

            {!form.farmId

              ? "اختر المزرعة أولاً"

              : farmFields.length === 0

              ? "لا توجد حقول لهذه المزرعة"

              : "اختر الحقل"

            }

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


        <br />
        <br />


        <select
          value={form.cropId}
          onChange={(e) =>
            updateForm(
              "cropId",
              e.target.value
            )
          }
          disabled={
            !form.fieldId ||
            fieldCrops.length === 0
          }
        >

          <option value="">

            {!form.fieldId

              ? "اختر الحقل أولاً"

              : fieldCrops.length === 0

              ? "لا توجد محاصيل لهذا الحقل"

              : "اختر المحصول"

            }

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


        <br />
        <br />


        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="كمية الحصاد"
          value={form.quantity}
          onChange={(e) =>
            updateForm(
              "quantity",
              e.target.value
            )
          }
        />


        <br />
        <br />


        <input
          type="text"
          placeholder="جودة المحصول"
          value={form.quality}
          onChange={(e) =>
            updateForm(
              "quality",
              e.target.value
            )
          }
        />


        <br />
        <br />


        <input
          type="date"
          value={form.harvestDate}
          onChange={(e) =>
            updateForm(
              "harvestDate",
              e.target.value
            )
          }
        />


        <br />
        <br />


        <textarea
          placeholder="ملاحظات"
          value={form.notes}
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
            ? "جاري الحفظ..."
            : editId
              ? "حفظ التعديل"
              : "إضافة الحصاد"
          }

        </Button>


        {editId && (

          <Button
            onClick={cancelEdit}
          >

            إلغاء التعديل

          </Button>

        )}

      </Card>


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


      <Card
        title="📋 سجل الحصاد"
      >

        {harvests.length === 0 ? (

          <p>
            لا توجد عمليات حصاد مسجلة حتى الآن.
          </p>

        ) : (

          harvests.map(
            (item) => (

              <Card
                key={item.id}
                title="🚜 عملية حصاد"
              >

                <p>
                  🚜 المزرعة:
                  {" "}
                  {getFarmName(
                    item.farmId ??
                    item.farm_id
                  )}
                </p>


                <p>
                  🏞️ الحقل:
                  {" "}
                  {getFieldName(
                    item.fieldId ??
                    item.field_id
                  )}
                </p>


                <p>
                  🌾 المحصول:
                  {" "}
                  {getCropName(
                    item.cropId ??
                    item.crop_id
                  )}
                </p>


                <p>
                  📦 الكمية:
                  {" "}
                  {item.quantity || 0}
                  {" "}
                  كغ
                </p>


                <p>
                  ⭐ الجودة:
                  {" "}
                  {item.quality || "--"}
                </p>


                <p>
                  📅 التاريخ:
                  {" "}
                  {item.harvestDate ??
                    item.harvest_date ??
                    "--"}
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
                  ✏️ تعديل
                </Button>


                <Button
                  onClick={() =>
                    remove(item.id)
                  }
                >
                  🗑️ حذف
                </Button>

              </Card>

            )
          )

        )}

      </Card>

    </div>

  );

}
