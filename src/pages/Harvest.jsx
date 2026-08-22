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



export default function Harvest() {


  const {

    farms = [],

    fields = [],

    crops = [],

    harvests = [],

    harvestActions

  } = useContext(FarmContext);



  // =========================
  // Form Model
  // =========================

  const initialForm = {

    farmId: "",

    fieldId: "",

    cropId: "",

    quantity: "",

    quality: "",

    harvestDate: "",

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

  const totalHarvest =
    useMemo(() => {

      return harvests.reduce(

        (sum, item) =>

          sum +
          Number(
            item.quantity || 0
          ),

        0

      );

    }, [

      harvests

    ]);



  // =========================
  // Save
  // =========================

  const save = async () => {

    if (

      !form.farmId ||

      !form.fieldId ||

      !form.cropId

    ) {

      return;

    }


    const data = {

      ...form,

      quantity:
        Number(
          form.quantity || 0
        )

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

      quantity:
        item.quantity ?? "",

      quality:
        item.quality || "",

      harvestDate:
        item.harvestDate || "",

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

    await harvestActions.delete(
      id
    );

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

          type="number"

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
        >

          {

            editId

              ? "حفظ التعديل"

              : "إضافة الحصاد"

          }

        </Button>



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

        {

          harvests.map(
            item => (

              <Card

                key={item.id}

                title="عملية حصاد"

              >

                <p>

                  🚜 الكمية:
                  {" "}

                  {item.quantity}

                  {" "}

                  كغ

                </p>


                <p>

                  🌾 الجودة:
                  {" "}

                  {item.quality}

                </p>


                <p>

                  📅 التاريخ:
                  {" "}

                  {item.harvestDate}

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
