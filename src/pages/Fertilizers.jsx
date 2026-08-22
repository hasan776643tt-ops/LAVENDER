// src/pages/Fertilizers.jsx

import {
  useState,
  useContext,
  useMemo
} from "react";


import {
  FarmContext
} from "../context/FarmContext";


import Card from "../components/Card";
import Button from "../components/Button";



export default function Fertilizers() {


  const {

    farms = [],

    fields = [],

    crops = [],

    fertilizers = [],

    fertilizerActions

  } = useContext(FarmContext);



  // =========================
  // Form Model
  // =========================

  const initialForm = {

    farmId: "",

    fieldId: "",

    cropId: "",

    type: "",

    category: "كيميائي",

    quantity: "",

    unit: "كغ",

    method: "تربة",

    stage: "",

    supplier: "",

    cost: "",

    currency: "ل.س",

    date: "",

    status: "scheduled",

    priority: "medium",

    notes: ""

  };



  const [form, setForm] =
    useState(initialForm);


  const [editId, setEditId] =
    useState(null);



  // =========================
  // Update Form
  // =========================

  const updateForm = (
    key,
    value
  ) => {

    setForm(prev => ({

      ...prev,

      [key]: value

    }));

  };



  // =========================
  // Filter Fields
  // =========================

  const farmFields =
    useMemo(() => {

      return fields.filter(

        field =>

          String(field.farmId) ===
          String(form.farmId)

      );

    }, [

      fields,

      form.farmId

    ]);



  // =========================
  // Filter Crops
  // =========================

  const fieldCrops =
    useMemo(() => {

      return crops.filter(

        crop =>

          String(crop.fieldId) ===
          String(form.fieldId)

      );

    }, [

      crops,

      form.fieldId

    ]);



  // =========================
  // Statistics
  // =========================

  const totalQuantity =
    useMemo(() => {

      return fertilizers.reduce(

        (sum, item) =>

          sum +
          Number(
            item.quantity || 0
          ),

        0

      );

    }, [

      fertilizers

    ]);



  const totalCost =
    useMemo(() => {

      return fertilizers.reduce(

        (sum, item) =>

          sum +
          Number(
            item.cost || 0
          ),

        0

      );

    }, [

      fertilizers

    ]);



  // =========================
  // Smart Advice
  // =========================

  const smartAdvice =
    useMemo(() => {

      if (
        form.category === "عضوي"
      ) {

        return "🌱 السماد العضوي يحسن بنية التربة.";

      }


      if (
        form.category === "كيميائي"
      ) {

        return "⚠️ يجب الالتزام بالجرعة المناسبة للمحصول.";

      }


      if (
        form.priority === "high"
      ) {

        return "🚨 أولوية عالية، يفضل تنفيذ التسميد قريباً.";

      }


      return "✅ خطة التسميد مناسبة.";

    }, [

      form.category,

      form.priority

    ]);



  // =========================
  // Save
  // =========================

  const save = async () => {

    if (

      !form.farmId ||

      !form.fieldId ||

      !form.type

    ) {

      return;

    }


    const data = {

      ...form,

      quantity:
        Number(
          form.quantity || 0
        ),

      cost:
        Number(
          form.cost || 0
        )

    };


    if (editId) {

      await fertilizerActions.update(

        editId,

        data

      );

    } else {

      await fertilizerActions.create(
        data
      );

    }


    setForm({
      ...initialForm
    });


    setEditId(null);

  };



  // =========================
  // Edit
  // =========================

  const edit = (item) => {

    setForm({

      farmId:
        item.farmId || "",

      fieldId:
        item.fieldId || "",

      cropId:
        item.cropId || "",

      type:
        item.type || "",

      category:
        item.category || "كيميائي",

      quantity:
        item.quantity ?? "",

      unit:
        item.unit || "كغ",

      method:
        item.method || "تربة",

      stage:
        item.stage || "",

      supplier:
        item.supplier || "",

      cost:
        item.cost ?? "",

      currency:
        item.currency || "ل.س",

      date:
        item.date || "",

      status:
        item.status || "scheduled",

      priority:
        item.priority || "medium",

      notes:
        item.notes || ""

    });


    setEditId(
      item.id
    );

  };



  // =========================
  // Delete
  // =========================

  const remove = async (id) => {

    await fertilizerActions.delete(
      id
    );

  };



  // =========================
  // UI
  // =========================

  return (

    <div>

      <h1>
        🌾 نظام إدارة الأسمدة الذكي
      </h1>



      <Card

        title={

          editId

            ? "✏️ تعديل عملية تسميد"

            : "➕ إضافة عملية تسميد"

        }

      >

        <select

          value={form.farmId}

          onChange={(e) => {

            updateForm(
              "farmId",
              e.target.value
            );

            updateForm(
              "fieldId",
              ""
            );

            updateForm(
              "cropId",
              ""
            );

          }}

        >

          <option value="">
            اختر المزرعة
          </option>


          {

            farms.map(
              farm => (

                <option

                  key={farm.id}

                  value={farm.id}

                >

                  {farm.name}

                </option>

              )
            )

          }

        </select>



        <br />
        <br />



        <select

          value={form.fieldId}

          onChange={(e) => {

            updateForm(
              "fieldId",
              e.target.value
            );

            updateForm(
              "cropId",
              ""
            );

          }}

        >

          <option value="">
            اختر الحقل
          </option>


          {

            farmFields.map(
              field => (

                <option

                  key={field.id}

                  value={field.id}

                >

                  {field.name}

                </option>

              )
            )

          }

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

        >

          <option value="">
            اختر المحصول
          </option>


          {

            fieldCrops.map(
              crop => (

                <option

                  key={crop.id}

                  value={crop.id}

                >

                  {crop.name}

                </option>

              )
            )

          }

        </select>



        <br />
        <br />



        <input

          placeholder="نوع السماد"

          value={form.type}

          onChange={(e) =>

            updateForm(
              "type",
              e.target.value
            )

          }

        />



        <br />
        <br />



        <select

          value={form.category}

          onChange={(e) =>

            updateForm(
              "category",
              e.target.value
            )

          }

        >

          <option value="عضوي">
            عضوي
          </option>

          <option value="كيميائي">
            كيميائي
          </option>

          <option value="ورقي">
            ورقي
          </option>

          <option value="مركب">
            مركب
          </option>

        </select>



        <br />
        <br />



        <input

          type="number"

          placeholder="الكمية"

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



        <select

          value={form.unit}

          onChange={(e) =>

            updateForm(
              "unit",
              e.target.value
            )

          }

        >

          <option value="كغ">
            كغ
          </option>

          <option value="طن">
            طن
          </option>

          <option value="لتر">
            لتر
          </option>

        </select>



        <br />
        <br />



        <select

          value={form.method}

          onChange={(e) =>

            updateForm(
              "method",
              e.target.value
            )

          }

        >

          <option value="تربة">
            تربة
          </option>

          <option value="رش ورقي">
            رش ورقي
          </option>

          <option value="مع الري">
            مع الري
          </option>

        </select>



        <br />
        <br />



        <input

          placeholder="مرحلة المحصول"

          value={form.stage}

          onChange={(e) =>

            updateForm(
              "stage",
              e.target.value
            )

          }

        />



        <br />
        <br />



        <input

          placeholder="المورد"

          value={form.supplier}

          onChange={(e) =>

            updateForm(
              "supplier",
              e.target.value
            )

          }

        />



        <br />
        <br />



        <input

          type="number"

          placeholder="التكلفة"

          value={form.cost}

          onChange={(e) =>

            updateForm(
              "cost",
              e.target.value
            )

          }

        />



        <br />
        <br />



        <select

          value={form.currency}

          onChange={(e) =>

            updateForm(
              "currency",
              e.target.value
            )

          }

        >

          <option value="ل.س">
            ل.س
          </option>

          <option value="$">
            $
          </option>

          <option value="€">
            €
          </option>

          <option value="₺">
            ₺
          </option>

        </select>



        <br />
        <br />



        <input

          type="date"

          value={form.date}

          onChange={(e) =>

            updateForm(
              "date",
              e.target.value
            )

          }

        />



        <br />
        <br />



        <select

          value={form.priority}

          onChange={(e) =>

            updateForm(
              "priority",
              e.target.value
            )

          }

        >

          <option value="low">
            منخفضة
          </option>

          <option value="medium">
            متوسطة
          </option>

          <option value="high">
            عالية
          </option>

        </select>



        <br />
        <br />



        <select

          value={form.status}

          onChange={(e) =>

            updateForm(
              "status",
              e.target.value
            )

          }

        >

          <option value="scheduled">
            مجدول
          </option>

          <option value="done">
            منفذ
          </option>

          <option value="pending">
            مؤجل
          </option>

        </select>



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



        <p>

          🤖 التوصية:
          {" "}

          {smartAdvice}

        </p>



        <Button
          onClick={save}
        >

          {

            editId

              ? "حفظ التعديل"

              : "إضافة التسميد"

          }

        </Button>



      </Card>



      <Card
        title="📊 إحصائيات الأسمدة"
      >

        <p>

          عدد العمليات:
          {" "}

          {fertilizers.length}

        </p>


        <p>

          إجمالي الكمية:
          {" "}

          {totalQuantity}

        </p>


        <p>

          إجمالي التكلفة:
          {" "}

          {totalCost}
          {" "}
          {form.currency}

        </p>

      </Card>



      <Card
        title="📋 سجل عمليات التسميد"
      >

        {

          fertilizers.map(
            item => (

              <Card

                key={item.id}

                title={item.type}

              >

                <p>

                  🌱 التصنيف:
                  {" "}

                  {item.category}

                </p>


                <p>

                  📦 الكمية:
                  {" "}

                  {item.quantity}
                  {" "}
                  {item.unit}

                </p>


                <p>

                  🚜 الطريقة:
                  {" "}

                  {item.method}

                </p>


                <p>

                  📅 التاريخ:
                  {" "}

                  {item.date}

                </p>


                <p>

                  🚦 الحالة:
                  {" "}

                  {item.status}

                </p>


                <p>

                  ⭐ الأولوية:
                  {" "}

                  {item.priority}

                </p>


                <p>

                  💰 التكلفة:
                  {" "}

                  {item.cost}
                  {" "}
                  {item.currency}

                </p>


                <p>

                  📝
                  {" "}

                  {item.notes}

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
          )

        }

      </Card>



    </div>

  );

}
