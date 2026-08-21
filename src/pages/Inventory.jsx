// src/pages/Inventory.jsx

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


export default function Inventory() {


  const {

    farms = [],

    inventory = [],

    inventoryActions,

  } = useContext(FarmContext);



  const initialForm = {

    farmId: "",

    name: "",

    category: "",

    quantity: "",

    unit: "",

    minimumStock: "",

    supplier: "",

    notes: "",

  };



  const [form, setForm] =
    useState(initialForm);


  const [editId, setEditId] =
    useState(null);


  const updateForm = (
    key,
    value
  ) => {

    setForm((prev) => ({

      ...prev,

      [key]: value,

    }));

  };



  const totalItems =
    useMemo(() => {

      return inventory.length;

    }, [inventory]);



  const lowStockItems =
    useMemo(() => {

      return inventory.filter(

        (item) =>

          Number(
            item.quantity || 0
          ) <=

          Number(
            item.minimumStock || 0
          )

      ).length;

    }, [inventory]);



  const save = async () => {

    if (
      !form.farmId ||
      !form.name
    ) {

      return;

    }


    if (editId) {

      await inventoryActions.update(
        editId,
        form
      );

    } else {

      await inventoryActions.create(
        form
      );

    }


    setForm({
      ...initialForm
    });


    setEditId(null);

  };



  const edit = (item) => {

    setForm({

      farmId:
        item.farmId || "",

      name:
        item.name || "",

      category:
        item.category || "",

      quantity:
        item.quantity || "",

      unit:
        item.unit || "",

      minimumStock:
        item.minimumStock || "",

      supplier:
        item.supplier || "",

      notes:
        item.notes || "",

    });


    setEditId(
      item.id
    );

  };



  const remove = async (id) => {

    await inventoryActions.delete(
      id
    );

  };



  return (

    <div>

      <h1>
        📦 إدارة المخزون
      </h1>


      <Card

        title={

          editId

            ? "✏️ تعديل مادة"

            : "➕ إضافة مادة"

        }

      >

        <select

          value={form.farmId}

          onChange={(e) =>

            updateForm(
              "farmId",
              e.target.value
            )

          }

        >

          <option value="">
            اختر المزرعة
          </option>


          {

            farms.map((farm) => (

              <option

                key={farm.id}

                value={farm.id}

              >

                {farm.name}

              </option>

            ))

          }

        </select>


        <br />
        <br />


        <input

          placeholder="اسم المادة"

          value={form.name}

          onChange={(e) =>

            updateForm(
              "name",
              e.target.value
            )

          }

        />


        <br />
        <br />


        <input

          placeholder="التصنيف"

          value={form.category}

          onChange={(e) =>

            updateForm(
              "category",
              e.target.value
            )

          }

        />


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


        <input

          placeholder="الوحدة"

          value={form.unit}

          onChange={(e) =>

            updateForm(
              "unit",
              e.target.value
            )

          }

        />


        <br />
        <br />


        <input

          type="number"

          placeholder="الحد الأدنى للمخزون"

          value={form.minimumStock}

          onChange={(e) =>

            updateForm(
              "minimumStock",
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

              : "إضافة للمخزون"

          }

        </Button>

      </Card>


      <Card
        title="📊 إحصائيات المخزون"
      >

        <p>
          عدد المواد:
          {" "}
          {totalItems}
        </p>


        <p>
          مواد تحتاج إعادة تزويد:
          {" "}
          {lowStockItems}
        </p>

      </Card>


      <Card
        title="📋 سجل المخزون"
      >

        {

          inventory.map((item) => (

            <Card

              key={item.id}

              title={item.name}

            >

              <p>
                📦 التصنيف:
                {" "}
                {item.category}
              </p>


              <p>
                🔢 الكمية:
                {" "}
                {item.quantity}
                {" "}
                {item.unit}
              </p>


              <p>
                ⚠️ الحد الأدنى:
                {" "}
                {item.minimumStock}
              </p>


              <p>
                🏢 المورد:
                {" "}
                {item.supplier}
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

          ))

        }

      </Card>

    </div>

  );

}
