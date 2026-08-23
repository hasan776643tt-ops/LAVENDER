// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";


import Card from "../components/Card";
import Button from "../components/Button";


import useFarms
  from "../hooks/useFarms";


import useFields
  from "../hooks/useFields";


import useCrops
  from "../hooks/useCrops";


export default function Crops() {


  const {
    loadFarms,
  } = useFarms();


  const {
    loadFields,
  } = useFields();


  const {
    crops,
    loading,
    error,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
  } = useCrops();


  const [
    farms,
    setFarms
  ] = useState([]);


  const [
    fields,
    setFields
  ] = useState([]);


  const emptyForm = {

    farmId: "",
    fieldId: "",
    name: "",
    variety: "",
    plantingDate: "",
    harvestDate: "",
    seedQuantity: "",
    expectedProduction: "",
    status: "",
    notes: "",

  };


  const [
    form,
    setForm
  ] = useState(emptyForm);


  const [
    editId,
    setEditId
  ] = useState(null);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    pageLoading,
    setPageLoading
  ] = useState(true);


  const [
    pageError,
    setPageError
  ] = useState("");


  // =========================
  // Load Farms + Fields
  // =========================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

      try {

        setPageLoading(true);
        setPageError("");


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
          "Crops loading error:",
          err
        );


        if (mounted) {

          setPageError(
            err?.message ||
            "تعذر تحميل بيانات المزارع والحقول."
          );


          setFarms([]);
          setFields([]);

        }

      } finally {

        if (mounted) {

          setPageLoading(false);

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


    if (name === "farmId") {

      setForm((prev) => ({

        ...prev,

        farmId: value,

        fieldId: "",

      }));


      return;

    }


    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));


  };


  // =========================
  // Reset
  // =========================

  const clearForm = () => {

    setForm({
      ...emptyForm,
    });


    setEditId(null);

  };


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
  // Save Crop
  // =========================

  const saveCrop = async () => {

    if (!form.farmId) {

      return;

    }


    if (!form.fieldId) {

      return;

    }


    if (!form.name.trim()) {

      return;

    }


    try {

      const data = {

        ...form,

        farmId:
          form.farmId,

        fieldId:
          form.fieldId,

      };


      if (editId) {

        await updateCrop(
          editId,
          data
        );

      } else {

        await addCrop(
          data
        );

      }


      clearForm();


    } catch (err) {

      console.error(
        "Failed to save crop:",
        err
      );

    }

  };


  // =========================
  // Edit Crop
  // =========================

  const editCrop = (crop) => {

    const farmId =

      crop?.farmId ??
      crop?.farm_id ??
      crop?.farm?.id ??
      "";


    const fieldId =

      crop?.fieldId ??
      crop?.field_id ??
      crop?.field?.id ??
      "";


    setForm({

      farmId,

      fieldId,

      name:
        crop?.name ||
        "",

      variety:
        crop?.variety ||
        "",

      plantingDate:
        crop?.plantingDate ??
        crop?.planting_date ??
        "",

      harvestDate:
        crop?.harvestDate ??
        crop?.harvest_date ??
        "",

      seedQuantity:
        crop?.seedQuantity ??
        crop?.seed_quantity ??
        "",

      expectedProduction:
        crop?.expectedProduction ??
        crop?.expected_production ??
        "",

      status:
        crop?.status ||
        "",

      notes:
        crop?.notes ||
        "",

    });


    setEditId(
      crop?.id ?? null
    );

  };


  // =========================
  // Search
  // =========================

  const filteredCrops =

    useMemo(() => {

      return searchCrops(
        crops,
        search
      );

    }, [

      crops,
      search,
      searchCrops,

    ]);


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


    return (

      farm?.name ||
      "غير محددة"

    );

  };


  // =========================
  // Field Name
  // =========================

  const getFieldName = (fieldId) => {

    const field =
      fields.find(
        (item) =>
          String(item?.id) ===
          String(fieldId)
      );


    return (

      field?.name ||
      "غير محدد"

    );

  };


  // =========================
  // UI
  // =========================

  return (

    <div>


      <h1>
        🌱 إدارة المحاصيل الذكية
      </h1>


      {pageError && (

        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >

          ⚠️ {pageError}

        </div>

      )}


      <Card

        title={
          editId
            ? "✏️ تعديل محصول"
            : "➕ إضافة محصول"
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

          disabled={
            pageLoading
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


        <select

          name="fieldId"

          value={
            form.fieldId
          }

          onChange={
            handleChange
          }

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


        <input

          name="name"

          placeholder="اسم المحصول"

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

          name="variety"

          placeholder="الصنف"

          value={
            form.variety
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          type="date"

          name="plantingDate"

          value={
            form.plantingDate
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          type="date"

          name="harvestDate"

          value={
            form.harvestDate
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          type="number"

          name="seedQuantity"

          placeholder="كمية البذور"

          value={
            form.seedQuantity
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          type="number"

          name="expectedProduction"

          placeholder="الإنتاج المتوقع"

          value={
            form.expectedProduction
          }

          onChange={
            handleChange
          }

        />


        <br />
        <br />


        <input

          name="status"

          placeholder="حالة المحصول"

          value={
            form.status
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
            saveCrop
          }

          disabled={
            loading ||
            pageLoading
          }

        >

          {

            loading

              ? "جاري الحفظ..."

              : editId

              ? "حفظ التعديل"

              : "إضافة المحصول"

          }

        </Button>


      </Card>


      <Card
        title="🔎 البحث"
      >

        <input

          placeholder="ابحث عن محصول"

          value={
            search
          }

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />

      </Card>


      <h2>
        🌾 قائمة المحاصيل
      </h2>


      {filteredCrops.map(
        (crop) => (

          <Card

            key={
              crop.id
            }

            title={
              `🌿 ${crop.name}`
            }

          >

            <p>

              🚜 المزرعة:
              {" "}

              {getFarmName(
                crop.farmId ??
                crop.farm_id
              )}

            </p>


            <p>

              📍 الحقل:
              {" "}

              {getFieldName(
                crop.fieldId ??
                crop.field_id
              )}

            </p>


            <p>

              🌱 الصنف:
              {" "}

              {crop.variety || "--"}

            </p>


            <p>

              📅 الزراعة:
              {" "}

              {crop.plantingDate ??
                crop.planting_date ??
                "--"}

            </p>


            <p>

              📦 الإنتاج المتوقع:
              {" "}

              {crop.expectedProduction ??
                crop.expected_production ??
                "--"}

            </p>


            <p>

              📌 الحالة:
              {" "}

              {crop.status || "--"}

            </p>


            <p>

              📝
              {" "}

              {crop.notes || "--"}

            </p>


            <Button

              onClick={() =>
                editCrop(crop)
              }

            >

              ✏️ تعديل

            </Button>


            <Button

              onClick={() =>
                deleteCrop(
                  crop.id
                )
              }

            >

              🗑️ حذف

            </Button>


          </Card>

        )
      )}


    </div>

  );

}
