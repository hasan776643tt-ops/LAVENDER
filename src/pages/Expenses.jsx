// src/pages/Expenses.jsx

import {
  useContext,
  useMemo,
  useState
} from "react";

import {
  FarmContext
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Expenses() {

  const {
    farms = [],
    expenses = [],
    expenseActions
  } = useContext(FarmContext);


  // =========================================================
  // الحالة الأساسية
  // =========================================================

  const [selectedFarmId, setSelectedFarmId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);


  // =========================================================
  // سطر مصروف جديد
  // =========================================================

  const createEmptyRow = () => ({
    id:
      globalThis.crypto?.randomUUID?.() ||
      Date.now().toString(),

    type: "",

    quantity: "",

    unit: "",

    amount: "",

    currency: "$",

    date:
      new Date()
        .toISOString()
        .slice(0, 10),

    notes: ""
  });


  const [newRow, setNewRow] =
    useState(createEmptyRow());


  // =========================================================
  // الإنتاج والبيع
  // =========================================================

  const [production, setProduction] =
    useState({
      quantity: "",
      unit: "كغ",
      price: "",
      currency: "$"
    });


  // =========================================================
  // تحديث سطر الإدخال
  // =========================================================

  const updateRow = (
    key,
    value
  ) => {

    setNewRow(prev => ({
      ...prev,
      [key]: value
    }));

  };


  // =========================================================
  // المصروفات الخاصة بالمزرعة المختارة
  // =========================================================

  const farmExpenses =
    useMemo(() => {

      if (!selectedFarmId) {
        return [];
      }

      return expenses.filter(
        item =>
          String(item.farmId) ===
          String(selectedFarmId)
      );

    }, [
      expenses,
      selectedFarmId
    ]);


  // =========================================================
  // البحث
  // =========================================================

  const filteredExpenses =
    useMemo(() => {

      const text =
        search
          .trim()
          .toLowerCase();

      if (!text) {
        return farmExpenses;
      }

      return farmExpenses.filter(
        item => {

          return (
            String(item.type || "")
              .toLowerCase()
              .includes(text)
            ||
            String(item.notes || "")
              .toLowerCase()
              .includes(text)
          );

        }
      );

    }, [
      farmExpenses,
      search
    ]);


  // =========================================================
  // إجمالي المصروفات
  // =========================================================

  const totalExpenses =
    useMemo(() => {

      return farmExpenses.reduce(
        (
          total,
          item
        ) => {

          return (
            total +
            (
              Number(
                item.amount
              ) || 0
            )
          );

        },
        0
      );

    }, [
      farmExpenses
    ]);


  // =========================================================
  // إجمالي الإنتاج
  // =========================================================

  const totalRevenue =
    useMemo(() => {

      const quantity =
        Number(
          production.quantity
        ) || 0;

      const price =
        Number(
          production.price
        ) || 0;

      return quantity * price;

    }, [
      production.quantity,
      production.price
    ]);


  // =========================================================
  // صافي الربح / الخسارة
  // =========================================================

  const netProfit =
    useMemo(() => {

      return (
        totalRevenue -
        totalExpenses
      );

    }, [
      totalRevenue,
      totalExpenses
    ]);


  // =========================================================
  // اختيار المزرعة
  // =========================================================

  const handleFarmChange = (value) => {

    setSelectedFarmId(value);

    setEditingId(null);

    setSearch("");

    setNewRow(
      createEmptyRow()
    );

    setProduction({
      quantity: "",
      unit: "كغ",
      price: "",
      currency: "$"
    });

  };


  // =========================================================
  // إضافة مصروف
  // =========================================================

  const addExpense = async () => {

    if (!selectedFarmId) {
      return;
    }

    const type =
      String(
        newRow.type || ""
      ).trim();

    const amount =
      Number(
        newRow.amount
      );

    if (!type || !amount || amount <= 0) {
      return;
    }


    await expenseActions.create({

      farmId:
        selectedFarmId,

      type,

      quantity:
        newRow.quantity === ""
          ? ""
          : Number(
              newRow.quantity
            ) || 0,

      unit:
        newRow.unit || "",

      amount,

      currency:
        newRow.currency || "$",

      date:
        newRow.date || "",

      notes:
        newRow.notes || "",

      createdAt:
        new Date().toISOString()

    });


    setNewRow(
      createEmptyRow()
    );

  };


  // =========================================================
  // تعديل مصروف
  // =========================================================

  const startEdit = (item) => {

    setEditingId(
      item.id
    );

    setNewRow({

      id:
        item.id,

      type:
        item.type || "",

      quantity:
        item.quantity ?? "",

      unit:
        item.unit || "",

      amount:
        item.amount ?? "",

      currency:
        item.currency || "$",

      date:
        item.date || "",

      notes:
        item.notes || ""

    });

  };


  // =========================================================
  // حفظ التعديل
  // =========================================================

  const saveEdit = async () => {

    if (!editingId) {
      return;
    }

    const type =
      String(
        newRow.type || ""
      ).trim();

    const amount =
      Number(
        newRow.amount
      );

    if (!type || !amount || amount <= 0) {
      return;
    }


    await expenseActions.update(

      editingId,

      {

        farmId:
          selectedFarmId,

        type,

        quantity:
          newRow.quantity === ""
            ? ""
            : Number(
                newRow.quantity
              ) || 0,

        unit:
          newRow.unit || "",

        amount,

        currency:
          newRow.currency || "$",

        date:
          newRow.date || "",

        notes:
          newRow.notes || ""

      }

    );


    setEditingId(null);

    setNewRow(
      createEmptyRow()
    );

  };


  // =========================================================
  // حذف
  // =========================================================

  const deleteExpense = async (id) => {

    await expenseActions.delete(
      id
    );

  };


  // =========================================================
  // المزرعة الحالية
  // =========================================================

  const selectedFarm =
    farms.find(
      farm =>
        String(farm.id) ===
        String(selectedFarmId)
    );


  // =========================================================
  // الواجهة
  // =========================================================

  return (

    <div
      dir="rtl"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "16px",
        boxSizing: "border-box"
      }}
    >

      <h1>
        💰 الإدارة المالية للمشروع الزراعي
      </h1>


      <p>
        سجل جميع مصروفات الحقل واحسب
        تكلفة الإنتاج والربح تلقائياً.
      </p>


      {/* =====================================================
          اختيار المزرعة
      ====================================================== */}

      <Card
        title="🏡 اختيار المزرعة"
      >

        <select
          value={selectedFarmId}
          onChange={(e) =>
            handleFarmChange(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px"
          }}
        >

          <option value="">
            اختر المزرعة
          </option>

          {farms.map(
            farm => (

              <option
                key={farm.id}
                value={farm.id}
              >
                {farm.name}
              </option>

            )
          )}

        </select>


        {selectedFarm && (

          <p>
            🏡 المزرعة المختارة:
            {" "}
            <strong>
              {selectedFarm.name}
            </strong>
          </p>

        )}

      </Card>


      {selectedFarmId && (

        <>

          {/* =================================================
              جدول المصروفات
          ================================================== */}

          <Card
            title="📑 جدول مصروفات الحقل"
          >

            <p>
              أضف أي عدد من المصروفات.
              الجدول يبقى مفتوحاً طوال مدة المشروع الزراعي.
            </p>


            {/* إضافة مصروف */}

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginBottom: "20px"
              }}
            >

              <input
                placeholder="المصروف — مثال: بذار، سماد، مبيد، عمال، جرار"
                value={newRow.type}
                onChange={(e) =>
                  updateRow(
                    "type",
                    e.target.value
                  )
                }
              />


              <input
                type="number"
                min="0"
                placeholder="الكمية — اختياري"
                value={newRow.quantity}
                onChange={(e) =>
                  updateRow(
                    "quantity",
                    e.target.value
                  )
                }
              />


              <input
                placeholder="الوحدة — كغ، كيس، ساعة، يوم..."
                value={newRow.unit}
                onChange={(e) =>
                  updateRow(
                    "unit",
                    e.target.value
                  )
                }
              />


              <input
                type="number"
                min="0"
                step="any"
                placeholder="المبلغ"
                value={newRow.amount}
                onChange={(e) =>
                  updateRow(
                    "amount",
                    e.target.value
                  )
                }
              />


              <select
                value={newRow.currency}
                onChange={(e) =>
                  updateRow(
                    "currency",
                    e.target.value
                  )
                }
              >

                <option value="$">
                  $
                </option>

                <option value="ل.س">
                  ل.س
                </option>

                <option value="€">
                  €
                </option>

                <option value="₺">
                  ₺
                </option>

              </select>


              <input
                type="date"
                value={newRow.date}
                onChange={(e) =>
                  updateRow(
                    "date",
                    e.target.value
                  )
                }
              />


              <input
                placeholder="ملاحظة — اختياري"
                value={newRow.notes}
                onChange={(e) =>
                  updateRow(
                    "notes",
                    e.target.value
                  )
                }
              />


              {editingId ? (

                <Button
                  onClick={saveEdit}
                >
                  💾 حفظ التعديل
                </Button>

              ) : (

                <Button
                  onClick={addExpense}
                >
                  ➕ إضافة المصروف إلى الجدول
                </Button>

              )}


              {editingId && (

                <Button
                  onClick={() => {

                    setEditingId(null);

                    setNewRow(
                      createEmptyRow()
                    );

                  }}
                >
                  إلغاء التعديل
                </Button>

              )}

            </div>


            {/* البحث */}

            <input
              placeholder="🔎 البحث في المصروفات"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                boxSizing: "border-box"
              }}
            />


            {/* الجدول */}

            {filteredExpenses.length === 0 ? (

              <p>
                لا توجد مصروفات لهذا الحقل حتى الآن.
              </p>

            ) : (

              <div
                style={{
                  overflowX: "auto"
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "700px"
                  }}
                >

                  <thead>

                    <tr>

                      <th>التاريخ</th>

                      <th>المصروف</th>

                      <th>الكمية</th>

                      <th>الوحدة</th>

                      <th>المبلغ</th>

                      <th>ملاحظات</th>

                      <th>إدارة</th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredExpenses.map(
                      item => (

                        <tr
                          key={item.id}
                        >

                          <td>
                            {item.date || "-"}
                          </td>

                          <td>
                            <strong>
                              {item.type}
                            </strong>
                          </td>

                          <td>
                            {item.quantity === ""
                              ? "-"
                              : item.quantity}
                          </td>

                          <td>
                            {item.unit || "-"}
                          </td>

                          <td>
                            {Number(
                              item.amount || 0
                            ).toLocaleString()}
                            {" "}
                            {item.currency || "$"}
                          </td>

                          <td>
                            {item.notes || "-"}
                          </td>

                          <td>

                            <Button
                              onClick={() =>
                                startEdit(item)
                              }
                            >
                              تعديل
                            </Button>


                            <Button
                              onClick={() =>
                                deleteExpense(
                                  item.id
                                )
                              }
                            >
                              حذف
                            </Button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </Card>


          {/* =================================================
              إجمالي المصروفات
          ================================================== */}

          <Card
            title="💰 إجمالي المصروفات"
          >

            <h2>
              {totalExpenses.toLocaleString()}
              {" "}
              $
            </h2>

            <p>
              عدد عمليات المصروف:
              {" "}
              {farmExpenses.length}
            </p>

          </Card>


          {/* =================================================
              الإنتاج والبيع
          ================================================== */}

          <Card
            title="🌾 إنتاج الحقل وبيع المحصول"
          >

            <p>
              أدخل كمية الإنتاج وسعر البيع،
              وسيحسب التطبيق قيمة الإنتاج تلقائياً.
            </p>


            <input
              type="number"
              min="0"
              step="any"
              placeholder="كمية الإنتاج"
              value={production.quantity}
              onChange={(e) =>
                setProduction(prev => ({
                  ...prev,
                  quantity:
                    e.target.value
                }))
              }
            />


            <select
              value={production.unit}
              onChange={(e) =>
                setProduction(prev => ({
                  ...prev,
                  unit:
                    e.target.value
                }))
              }
            >

              <option value="كغ">
                كيلوغرام
              </option>

              <option value="طن">
                طن
              </option>

            </select>


            <input
              type="number"
              min="0"
              step="any"
              placeholder="سعر بيع وحدة الإنتاج"
              value={production.price}
              onChange={(e) =>
                setProduction(prev => ({
                  ...prev,
                  price:
                    e.target.value
                }))
              }
            />


            <select
              value={production.currency}
              onChange={(e) =>
                setProduction(prev => ({
                  ...prev,
                  currency:
                    e.target.value
                }))
              }
            >

              <option value="$">
                $
              </option>

              <option value="ل.س">
                ل.س
              </option>

              <option value="€">
                €
              </option>

              <option value="₺">
                ₺
              </option>

            </select>


            <div
              style={{
                marginTop: "20px"
              }}
            >

              <h3>
                💵 إجمالي قيمة الإنتاج
              </h3>

              <strong>
                {totalRevenue.toLocaleString()}
                {" "}
                {production.currency}
              </strong>

            </div>

          </Card>


          {/* =================================================
              النتيجة المالية
          ================================================== */}

          <Card
            title="📊 النتيجة المالية"
          >

            <p>
              💰 إجمالي المصروفات:
              {" "}
              <strong>
                {totalExpenses.toLocaleString()}
                {" "}
                $
              </strong>
            </p>


            <p>
              💵 إجمالي المبيعات:
              {" "}
              <strong>
                {totalRevenue.toLocaleString()}
                {" "}
                {production.currency}
              </strong>
            </p>


            <hr />


            <h2>

              {netProfit >= 0
                ? "📈 الربح الصافي"
                : "📉 الخسارة"}

              :
              {" "}

              {Math.abs(
                netProfit
              ).toLocaleString()}

              {" "}

              {production.currency}

            </h2>

          </Card>

        </>

      )}

    </div>
  );
}
