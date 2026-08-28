// src/pages/Crops.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";


import Card
  from "../components/Card.jsx";

import Button
  from "../components/Button.jsx";


import useFarms
  from "../hooks/useFarms.js";

import useFields
  from "../hooks/useFields.js";

import useCrops
  from "../hooks/useCrops.js";

import useMap
  from "../hooks/useMap.js";


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

    padding: "20px 16px 50px",

    boxSizing: "border-box",

  },


  title: {

    textAlign: "center",

    margin: "10px 0 28px",

    fontSize:
      "clamp(26px, 6vw, 36px)",

  },


  formGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap: "22px",

  },


  group: {

    width: "100%",

  },


  label: {

    display: "block",

    marginBottom: "9px",

    fontSize: "17px",

    fontWeight: "700",

  },


  field: {

    width: "100%",

    minHeight: "60px",

    padding: "15px 17px",

    border:
      "1px solid #cbd5cf",

    borderRadius: "13px",

    background: "#fff",

    fontSize: "18px",

    boxSizing: "border-box",

    outline: "none",

  },


  textarea: {

    width: "100%",

    minHeight: "125px",

    padding: "15px 17px",

    border:
      "1px solid #cbd5cf",

    borderRadius: "13px",

    background: "#fff",

    fontSize: "18px",

    resize: "vertical",

    boxSizing: "border-box",

    outline: "none",

  },


  recommendation: {

    marginTop: "26px",

    padding: "20px",

    borderRadius: "15px",

    background: "#f1f8f2",

    border:
      "1px solid #c9dfce",

  },


  seedOption: {

    padding: "14px 16px",

    marginTop: "10px",

    borderRadius: "11px",

    background: "#fff",

    border:
      "1px solid #d5e2d7",

    fontSize: "17px",

  },


  actions: {

    display: "flex",

    flexWrap: "wrap",

    gap: "12px",

    marginTop: "26px",

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


  // =====================================================
  // Hooks
  // =====================================================

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

    loadCrops,

    addCrop,

    updateCrop,

    deleteCrop,

    searchCrops,

    getRecommendation,

  } = useCrops();


  const {

    locations,

    loadLocations,

  } = useMap();


  // =====================================================
  // Local State
  // =====================================================

  const [farms, setFarms] =
    useState([]);


  const [fields, setFields] =
    useState([]);


  const [form, setForm] =
    useState({
      ...EMPTY_FORM,
    });


  const [editId, setEditId] =
    useState(null);


  const [search, setSearch] =
    useState("");


  const [pageError, setPageError] =
    useState("");


  // =====================================================
  // تحميل البيانات
  // =====================================================

  useEffect(() => {

    let active = true;


    async function load() {

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


        if (!active) {

          return;

        }


        setFarms(
          Array.isArray(farmData)
            ? farmData
            : []
        );


        setFields(
          Array.isArray(fieldData)
            ? fieldData
            : []
        );


      } catch (err) {

        if (active) {

          setPageError(
            err?.message ||
            "تعذر تحميل بيانات المحاصيل."
          );

        }

      }

    }


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


  // =====================================================
  // الحقول التابعة للمزرعة المختارة
  // =====================================================

  const fieldsByFarm =
    useMemo(() => {

      if (!form.farmId) {

        return [];

      }


      return fields.filter(
        field => {

          const farmId =
            field?.farmId ??
            field?.farm_id ??
            field?.farm?.id;


          return (
            String(farmId) ===
            String(form.farmId)
          );

        }
      );

    }, [

      fields,

      form.farmId,

    ]);


  // =====================================================
  // الموقع المرتبط بالحقل
  // =====================================================

  const selectedLocation =
    useMemo(() => {

      if (!form.fieldId) {

        return null;

      }


      return (

        locations.find(
          location => {

            const fieldId =
              location?.fieldId ??
              location?.field_id;


            return (
              String(fieldId) ===
              String(form.fieldId)
            );

          }
        ) ||

        null

      );

    }, [

      locations,

      form.fieldId,

    ]);


  // =====================================================
  // توصية البذور
  // =====================================================

  const recommendation =
    useMemo(() => {

      if (!selectedLocation) {

        return null;

      }


      return getRecommendation(
        selectedLocation
      );

    }, [

      selectedLocation,

      getRecommendation,

    ]);


  // =====================================================
  // البحث
  // =====================================================

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


  // =====================================================
  // تغيير الحقول
  // =====================================================

  const change = ({
    target: {
      name,
      value,
    },
  }) => {

    setPageError("");


    setForm(
      current => ({

        ...current,

        [name]: value,

        ...(name === "farmId"
          ? {
              fieldId: "",
            }
          : {}),

      })
    );

  };


  // =====================================================
  // إعادة النموذج
  // =====================================================

  const reset = () => {

    setForm({
      ...EMPTY_FORM,
    });


    setEditId(null);


    setPageError("");

  };


  // =====================================================
  // حفظ المحصول
  // =====================================================

  const save = async () => {

    setPageError("");


    if (!form.farmId) {

      setPageError(
        "يرجى اختيار المزرعة."
      );

      return;

    }


    if (!form.fieldId) {

      setPageError(
        "يرجى اختيار الحقل."
      );

      return;

    }


    if (!String(form.name).trim()) {

      setPageError(
        "يرجى كتابة اسم المحصول."
      );

      return;

    }


    try {

      const data = {

        ...form,

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

        locationId:
          selectedLocation?.id ||
          null,

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


  // =====================================================
  // تعديل محصول
  // =====================================================

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


    setEditId(
      crop?.id ??
      crop?._id ??
      null
    );


    setPageError("");

  };


  // =====================================================
  // اسم المزرعة
  // =====================================================

  const farmName = (id) => {

    return (

      farms.find(
        farm => {

          const farmId =
            farm?.id ??
            farm?._id ??
            farm?.farmId;


          return (
            String(farmId) ===
            String(id)
          );

        }
      )?.name ||

      "غير محددة"

    );

  };


  // =====================================================
  // اسم الحقل
  // =====================================================

  const fieldName = (id) => {

    return (

      fields.find(
        field => {

          const fieldId =
            field?.id ??
            field?._id ??
            field?.fieldId;


          return (
            String(fieldId) ===
            String(id)
          );

        }
      )?.name ||

      "غير محدد"

    );

  };


  // =====================================================
  // عنصر إدخال
  // =====================================================

  const input = (
    name,
    label,
    type = "text"
  ) => (

    <div style={styles.group}>

      <label style={styles.label}>

        {label}

      </label>


      <input

        name={name}

        type={type}

        value={
          form[name] ?? ""
        }

        onChange={change}

        style={styles.field}

      />

    </div>

  );


  // =====================================================
  // الواجهة
  // =====================================================

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


          {/* المزرعة */}

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


              {farms.map(
                farm => {

                  const farmId =
                    farm?.id ??
                    farm?._id ??
                    farm?.farmId;


                  const farmNameValue =
                    farm?.name ??
                    farm?.farmName ??
                    farm?.title ??
                    "مزرعة بدون اسم";


                  return (

                    <option

                      key={farmId}

                      value={farmId}

                    >

                      {farmNameValue}

                    </option>

                  );

                }
              )}

            </select>

          </div>


          {/* الحقل */}

          <div style={styles.group}>

            <label style={styles.label}>

              📍 الحقل

            </label>


            <select

              name="fieldId"

              value={form.fieldId}

              onChange={change}

              disabled={
                !form.farmId
              }

              style={styles.field}

            >

              <option value="">

                {form.farmId

                  ? fieldsByFarm.length
                    ? "اختر الحقل"
                    : "لا توجد حقول لهذه المزرعة"

                  : "اختر المزرعة أولًا"}

              </option>


              {fieldsByFarm.map(
                field => {

                  const fieldId =
                    field?.id ??
                    field?._id ??
                    field?.fieldId;


                  const fieldNameValue =
                    field?.name ??
                    field?.fieldName ??
                    field?.title ??
                    "حقل بدون اسم";


                  return (

                    <option

                      key={fieldId}

                      value={fieldId}

                    >

                      {fieldNameValue}

                    </option>

                  );

                }
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


          {/* جودة البذور */}

          <div style={styles.group}>

            <label style={styles.label}>

              ⭐ جودة البذور

            </label>


            <select

              name="seedQuality"

              value={
                form.seedQuality
              }

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


          {/* عمر النبات */}

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


        {/* الملاحظات */}

        <div

          style={{

            ...styles.group,

            marginTop: "22px",

          }}

        >

          <label style={styles.label}>

            📝 ملاحظات

          </label>


          <textarea

            name="notes"

            value={
              form.notes ?? ""
            }

            onChange={change}

            placeholder="اكتب أي ملاحظات عن الزراعة أو البذور أو السماد"

            style={styles.textarea}

          />

        </div>


        {/* توصية البذور */}

        {recommendation && (

          <div style={styles.recommendation}>

            <h3>

              🌱 توصية البذور

            </h3>


            <p>

              {recommendation.message}

            </p>


            {Array.isArray(
              recommendation.seeds
            ) &&

              recommendation.seeds.map(
                seed => (

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


        {/* الأزرار */}

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

            <Button
              onClick={reset}
            >

              إلغاء التعديل

            </Button>

          )}

        </div>

      </Card>


      {/* البحث */}

      <Card title="🔎 البحث">

        <input

          value={search}

          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }

          placeholder="ابحث عن محصول أو نوع أو صنف البذور"

          style={styles.field}

        />

      </Card>


      {/* المحاصيل */}

      <h2>

        🌾 المحاصيل المسجلة

      </h2>


      <div style={styles.listGrid}>

        {filteredCrops.map(
          crop => {

            const cropId =
              crop?.id ??
              crop?._id ??
              crop?.cropId;


            return (

              <Card

                key={cropId}

                title={
                  `🌱 ${crop?.name || "محصول"}`
                }

              >

                <div
                  style={styles.cropCard}
                >


                  <p style={styles.info}>

                    🚜 المزرعة:{" "}

                    {farmName(

                      crop?.farmId ??
                      crop?.farm_id

                    )}

                  </p>


                  <p style={styles.info}>

                    📍 الحقل:{" "}

                    {fieldName(

                      crop?.fieldId ??
                      crop?.field_id

                    )}

                  </p>


                  <p style={styles.info}>

                    🌱 البذور:{" "}

                    {crop?.seedType ??
                      crop?.seed_type ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    🔖 الصنف:{" "}

                    {crop?.seedVariety ??
                      crop?.seed_variety ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    ⭐ الجودة:{" "}

                    {crop?.seedQuality ??
                      crop?.seed_quality ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    ⚖️ البذور:{" "}

                    {crop?.seedQuantity ??
                      crop?.seed_quantity ??
                      "--"}{" "}

                    كغ

                  </p>


                  <p style={styles.info}>

                    📅 الزراعة:{" "}

                    {crop?.plantingDate ??
                      crop?.planting_date ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    🧪 السماد:{" "}

                    {crop?.fertilizerType ??
                      crop?.fertilizer_type ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    ⚖️ السماد:{" "}

                    {crop?.fertilizerQuantity ??
                      crop?.fertilizer_quantity ??
                      "--"}{" "}

                    كغ

                  </p>


                  <p style={styles.info}>

                    📅 الحصاد المتوقع:{" "}

                    {crop?.harvestDate ??
                      crop?.harvest_date ??
                      "--"}

                  </p>


                  <p style={styles.info}>

                    📦 الإنتاج المتوقع:{" "}

                    {crop?.expectedProduction ??
                      crop?.expected_production ??
                      "--"}{" "}

                    كغ

                  </p>


                  <p style={styles.info}>

                    📝{" "}

                    {crop?.notes ||
                      "لا توجد ملاحظات"}

                  </p>


                  <div
                    style={styles.actions}
                  >

                    <Button

                      onClick={() =>
                        edit(crop)
                      }

                    >

                      ✏️ تعديل

                    </Button>


                    <Button

                      onClick={() =>
                        deleteCrop(
                          cropId
                        )
                      }

                    >

                      🗑️ حذف

                    </Button>

                  </div>


                </div>

              </Card>

            );

          }
        )}

      </div>

    </main>

  );

}
