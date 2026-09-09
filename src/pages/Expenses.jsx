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
  // المزرعة المختارة
  // =========================================================

  const [selectedFarmId, setSelectedFarmId] =
    useState("");


  // =========================================================
  // البحث
  // =========================================================

  const [search, setSearch] =
    useState("");


  // =========================================================
  // التعديل
  // =========================================================

  const [editingId, setEditingId] =
    useState(null);


  // =========================================================
  // إنشاء سطر مصروف فارغ
  //
  // ملاحظة:
  // لا نضع تاريخ اليوم هنا.
  // التاريخ يبقى فارغاً حتى يختاره المستخدم.
  // =========================================================

  const createEmptyRow = () => ({

    type: "",

    quantity: "",

    unit: "",

    amount: "",

    currency: "ل.س",

    date: "",

    notes: ""

  });


  const [newRow, setNewRow] =
    useState(
      createEmptyRow()
    );


  // =========================================================
  // بيانات الإنتاج
  // =========================================================

  const [production, setProduction] =
    useState({

      quantity: "",

      unit: "كغ",

      price: "",

      currency: "ل.س"

    });


  // =========================================================
  // تحديث حقل المصروف
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
  // تحديث بيانات الإنتاج
  // =========================================================

  const updateProduction = (
    key,
    value
  ) => {

    setProduction(prev => ({

      ...prev,

      [key]: value

    }));

  };


  // =========================================================
  // مصروفات المزرعة المختارة فقط
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
        String(search || "")
          .trim()
          .toLowerCase();


      if (!text) {
        return farmExpenses;
      }


      return farmExpenses.filter(
        item => {

          const type =
            String(
              item.type || ""
            ).toLowerCase();

          const notes =
            String(
              item.notes || ""
            ).toLowerCase();

          const date =
            String(
              item.date || ""
            ).toLowerCase();


          return (
            type.includes(text) ||
            notes.includes(text) ||
            date.includes(text)
          );

        }
      );

    }, [
      farmExpenses,
      search
    ]);


  // =========================================================
  // تجميع المصروفات حسب العملة
  //
  // مهم:
  // لا نحول الليرة إلى دولار أو العكس.
  // =========================================================

  const expensesByCurrency =
    useMemo(() => {

      const totals = {};


      farmExpenses.forEach(
        item => {

          const currency =
            item.currency ||
            "ل.س";


          const amount =
            Number(
              item.amount || 0
            );


          if (
            !Object.prototype.hasOwnProperty.call(
              totals,
              currency
            )
          ) {

            totals[currency] = 0;

          }


          totals[currency] += amount;

        }
      );


      return totals;

    }, [
      farmExpenses
    ]);


  // =========================================================
  // قيمة الإنتاج
  // =========================================================

  const totalRevenue =
    useMemo(() => {

      const quantity =
        Number(
          production.quantity || 0
        );


      const price =
        Number(
          production.price || 0
        );


      return quantity * price;

    }, [
      production.quantity,
      production.price
    ]);


  // =========================================================
  // العملة المستخدمة في المصروفات
  // =========================================================

  const expenseCurrencies =
    Object.keys(
      expensesByCurrency
    );


  // =========================================================
  // هل المصروفات كلها بعملة واحدة؟
  // =========================================================

  const hasSingleExpenseCurrency =
    expenseCurrencies.length === 1;


  const singleExpenseCurrency =
    hasSingleExpenseCurrency
      ? expenseCurrencies[0]
      : null;


  // =========================================================
  // الربح / الخسارة
  //
  // نحسبه فقط عندما تكون المصروفات كلها
  // بنفس عملة الإنتاج.
  // =========================================================

  const canCalculateProfit =
    hasSingleExpenseCurrency &&
    singleExpenseCurrency ===
      production.currency;


  const netProfit =
    canCalculateProfit

      ? totalRevenue -
        (
          expensesByCurrency[
            production.currency
          ] || 0
        )

      : null;


  // =========================================================
  // اختيار المزرعة
  // =========================================================

  const handleFarmChange = (
    value
  ) => {

    setSelectedFarmId(
      value
    );

    setSearch("");

    setEditingId(null);

    setNewRow(
      createEmptyRow()
    );

    setProduction({

      quantity: "",

      unit: "كغ",

      price: "",

      currency: "ل.س"

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


    if (
      !type ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      return;

    }


    /*
     * التاريخ يؤخذ مباشرة من newRow.date.
     *
     * لا نضع new Date()
     * ولا نضع تاريخ اليوم.
     *
     * لذلك إذا كتب المستخدم:
     * 2024-06-02
     *
     * سيتم حفظ:
     * 2024-06-02
     */

    await expenseActions.create({

      farmId:
        selectedFarmId,

      type:

        type,

      quantity:

        newRow.quantity === ""
          ? ""
          : Number(
              newRow.quantity
            ) || 0,

      unit:

        newRow.unit || "",

      amount:

        amount,

      /*
       * العملة التي اختارها المستخدم
       * تحفظ كما هي.
       */

      currency:

        newRow.currency || "ل.س",

      /*
       * التاريخ الذي اختاره المستخدم
       * يحفظ كما هو.
       */

      date:

        newRow.date || "",

      notes:

        newRow.notes || ""

    });


    setNewRow(
      createEmptyRow()
    );

  };


  // =========================================================
  // بدء تعديل مصروف
  // =========================================================

  const startEdit = (
    item
  ) => {

    setEditingId(
      item.id
    );


    setNewRow({

      type:
        item.type || "",

      quantity:
        item.quantity ?? "",

      unit:
        item.unit || "",

      amount:
        item.amount ?? "",

      currency:
        item.currency || "ل.س",

      /*
       * نستعيد التاريخ المحفوظ.
       * لا نضع تاريخ اليوم.
       */

      date:
        item.date || "",

      notes:
        item.notes || ""

    });

  };


  // =========================================================
  // حفظ تعديل المصروف
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


    if (
      !type ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      return;

    }


    await expenseActions.update(

      editingId,

      {

        farmId:
          selectedFarmId,

        type:
          type,

        quantity:
          newRow.quantity === ""
            ? ""
            : Number(
                newRow.quantity
              ) || 0,

        unit:
          newRow.unit || "",

        amount:
          amount,

        /*
         * نفس العملة التي اختارها المستخدم.
         */

        currency:
          newRow.currency || "ل.س",

        /*
         * نفس التاريخ الذي اختاره المستخدم.
         */

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

  const deleteExpense = async (
    id
  ) => {

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
  // تنسيق الأرقام
  // =========================================================

  const formatNumber = (
    value
  ) => {

    return Number(
      value || 0
    ).toLocaleString(
      "ar-SY"
    );

  };


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
        سجل جميع مصروفات الحقل واحسب تكلفة الإنتاج والربح تلقائياً.
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

            minHeight: "56px",

            padding: "12px 14px",

            fontSize: "18px",

            borderRadius: "10px",

            boxSizing: "border-box"

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

          <p
            style={{
              fontSize: "18px"
            }}
          >

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

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.8"
              }}
            >
              أضف أي عدد من المصروفات.
              الجدول يبقى مفتوحاً طوال مدة المشروع الزراعي.
            </p>


            {/* ===============================================
                نموذج إضافة / تعديل
            ================================================ */}

            <div
              style={{

                display: "grid",

                gap: "14px",

                marginBottom: "24px"

              }}
            >

              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                اسم المصروف
              </label>


              <input
                placeholder="مثال: بذار، سماد، مبيد، عمال، أجار جرار"
                value={newRow.type}
                onChange={(e) =>
                  updateRow(
                    "type",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "58px",

                  padding: "12px 14px",

                  fontSize: "18px",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              />


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                الكمية
              </label>


              <input
                type="number"
                min="0"
                step="any"
                placeholder="مثال: 500"
                value={newRow.quantity}
                onChange={(e) =>
                  updateRow(
                    "quantity",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "58px",

                  padding: "12px 14px",

                  fontSize: "18px",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              />


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                الوحدة
              </label>


              <input
                placeholder="مثال: كيس، كغ، ساعة، يوم"
                value={newRow.unit}
                onChange={(e) =>
                  updateRow(
                    "unit",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "58px",

                  padding: "12px 14px",

                  fontSize: "18px",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              />


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                مبلغ المصروف
              </label>


              <input
                type="number"
                min="0"
                step="any"
                placeholder="اكتب مبلغ المصروف"
                value={newRow.amount}
                onChange={(e) =>
                  updateRow(
                    "amount",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "62px",

                  padding: "12px 14px",

                  fontSize: "20px",

                  fontWeight: "600",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              />


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                العملة
              </label>


              <select
                value={newRow.currency}
                onChange={(e) =>
                  updateRow(
                    "currency",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "58px",

                  padding: "12px 14px",

                  fontSize: "18px",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              >

                <option value="ل.س">
                  ليرة سورية — ل.س
                </option>

                <option value="$">
                  دولار أمريكي — $
                </option>

                <option value="₺">
                  ليرة تركية — ₺
                </option>

                <option value="€">
                  يورو — €
                </option>

              </select>


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                تاريخ المصروف
              </label>


              <input
                type="date"
                value={newRow.date}
                onChange={(e) =>
                  updateRow(
                    "date",
                    e.target.value
                  )
                }
                style={{

                  width: "100%",

                  minHeight: "62px",

                  padding: "12px 14px",

                  fontSize: "19px",

                  borderRadius: "10px",

                  boxSizing: "border-box"

                }}
              />


              <label
                style={{
                  fontSize: "17px",
                  fontWeight: "600"
                }}
              >
                ملاحظات
              </label>


              <textarea
                placeholder="اكتب أي ملاحظة عن المصروف"
                value={newRow.notes}
                onChange={(e) =>
                  updateRow(
                    "notes",
                    e.target.value
                  )
                }
                rows={4}
                style={{

                  width: "100%",

                  minHeight: "110px",

                  padding: "14px",

                  fontSize: "18px",

                  lineHeight: "1.6",

                  borderRadius: "10px",

                  resize: "vertical",

                  boxSizing: "border-box"

                }}
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


            {/* ===============================================
                البحث
            ================================================ */}

            <input
              placeholder="🔎 ابحث عن مصروف أو تاريخ أو ملاحظة"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "58px",

                padding: "12px 14px",

                fontSize: "18px",

                marginBottom: "20px",

                borderRadius: "10px",

                boxSizing: "border-box"

              }}
            />


            {/* ===============================================
                الجدول
            ================================================ */}

            {filteredExpenses.length === 0 ? (

              <p
                style={{
                  fontSize: "17px"
                }}
              >
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

                    minWidth: "850px",

                    fontSize: "16px"

                  }}
                >

                  <thead>

                    <tr>

                      <th>
                        التاريخ
                      </th>

                      <th>
                        المصروف
                      </th>

                      <th>
                        الكمية
                      </th>

                      <th>
                        الوحدة
                      </th>

                      <th>
                        المبلغ
                      </th>

                      <th>
                        العملة
                      </th>

                      <th>
                        ملاحظات
                      </th>

                      <th>
                        إدارة
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredExpenses.map(
                      item => (

                        <tr
                          key={item.id}
                        >

                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            {item.date || "-"}

                          </td>


                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            <strong>
                              {item.type}
                            </strong>

                          </td>


                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            {item.quantity === ""
                              ? "-"
                              : item.quantity}

                          </td>


                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            {item.unit || "-"}

                          </td>


                          <td
                            style={{
                              padding: "12px",
                              fontWeight: "600"
                            }}
                          >

                            {formatNumber(
                              item.amount
                            )}

                          </td>


                          <td
                            style={{
                              padding: "12px",
                              fontWeight: "600"
                            }}
                          >

                            {item.currency || "ل.س"}

                          </td>


                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            {item.notes || "-"}

                          </td>


                          <td
                            style={{
                              padding: "12px"
                            }}
                          >

                            <div
                              style={{
                                display: "flex",
                                gap: "8px"
                              }}
                            >

                              <Button
                                onClick={() =>
                                  startEdit(
                                    item
                                  )
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

                            </div>

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
              إجمالي المصروفات حسب العملة
          ================================================== */}

          <Card
            title="💰 إجمالي المصروفات"
          >

            {expenseCurrencies.length === 0 ? (

              <p>
                لا توجد مصروفات بعد.
              </p>

            ) : (

              expenseCurrencies.map(
                currency => (

                  <div
                    key={currency}
                    style={{
                      marginBottom: "14px"
                    }}
                  >

                    <span
                      style={{
                        fontSize: "17px"
                      }}
                    >
                      إجمالي المصروفات بـ
                      {" "}
                      <strong>
                        {currency}
                      </strong>
                    </span>

                    <h2
                      style={{
                        margin: "5px 0"
                      }}
                    >

                      {formatNumber(
                        expensesByCurrency[
                          currency
                        ]
                      )}

                      {" "}

                      {currency}

                    </h2>

                  </div>

                )
              )

            )}


            <p>
              عدد عمليات المصروف:
              {" "}
              <strong>
                {farmExpenses.length}
              </strong>
            </p>

          </Card>


          {/* =================================================
              الإنتاج
          ================================================== */}

          <Card
            title="🌾 إنتاج الحقل وبيع المحصول"
          >

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.8"
              }}
            >
              أدخل كمية الإنتاج وسعر بيع الوحدة.
              التطبيق يحسب قيمة الإنتاج تلقائياً.
            </p>


            <label
              style={{
                display: "block",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              كمية الإنتاج
            </label>


            <input
              type="number"
              min="0"
              step="any"
              placeholder="مثال: 5000"
              value={production.quantity}
              onChange={(e) =>
                updateProduction(
                  "quantity",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "62px",

                padding: "12px 14px",

                fontSize: "20px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "14px"

              }}
            />


            <label
              style={{
                display: "block",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              وحدة الإنتاج
            </label>


            <select
              value={production.unit}
              onChange={(e) =>
                updateProduction(
                  "unit",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "58px",

                padding: "12px 14px",

                fontSize: "18px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "14px"

              }}
            >

              <option value="كغ">
                كيلوغرام
              </option>

              <option value="طن">
                طن
              </option>

            </select>


            <label
              style={{
                display: "block",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              سعر بيع الوحدة
            </label>


            <input
              type="number"
              min="0"
              step="any"
              placeholder="مثال: سعر بيع الكيلو"
              value={production.price}
              onChange={(e) =>
                updateProduction(
                  "price",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "62px",

                padding: "12px 14px",

                fontSize: "20px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "14px"

              }}
            />


            <label
              style={{
                display: "block",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              عملة البيع
            </label>


            <select
              value={production.currency}
              onChange={(e) =>
                updateProduction(
                  "currency",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "58px",

                padding: "12px 14px",

                fontSize: "18px",

                borderRadius: "10px",

                boxSizing: "border-box"

              }}
            >

              <option value="ل.س">
                ليرة سورية — ل.س
              </option>

              <option value="$">
                دولار أمريكي — $
              </option>

              <option value="₺">
                ليرة تركية — ₺
              </option>

              <option value="€">
                يورو — €
              </option>

            </select>


            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "12px"
              }}
            >

              <h3>
                💵 إجمالي قيمة الإنتاج
              </h3>


              <h2>

                {formatNumber(
                  totalRevenue
                )}

                {" "}

                {production.currency}

              </h2>


              <p>

                {formatNumber(
                  Number(
                    production.quantity || 0
                  )
                )}

                {" "}

                {production.unit}

                {" × "}

                {formatNumber(
                  Number(
                    production.price || 0
                  )
                )}

                {" "}

                {production.currency}

              </p>

            </div>

          </Card>


          {/* =================================================
              النتيجة المالية
          ================================================== */}

          <Card
            title="📊 النتيجة المالية"
          >

            {canCalculateProfit ? (

              <>

                <p
                  style={{
                    fontSize: "18px"
                  }}
                >

                  💰 المصروفات:
                  {" "}

                  <strong>
                    {formatNumber(
                      expensesByCurrency[
                        production.currency
                      ] || 0
                    )}
                    {" "}
                    {production.currency}
                  </strong>

                </p>


                <p
                  style={{
                    fontSize: "18px"
                  }}
                >

                  💵 المبيعات:
                  {" "}

                  <strong>
                    {formatNumber(
                      totalRevenue
                    )}
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

                  {formatNumber(
                    Math.abs(
                      netProfit
                    )
                  )}

                  {" "}

                  {production.currency}

                </h2>

              </>

            ) : (

              <>

                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.8"
                  }}
                >

                  ⚠️ لا يمكن حساب الربح الصافي
                  عند وجود مصروفات بعملات مختلفة
                  عن عملة البيع.

                </p>


                <p>

                  يتم حفظ كل عملة كما اختارها المستخدم
                  دون تحويلها.

                </p>

              </>

            )}

          </Card>

        </>

      )}

    </div>

  );

}
