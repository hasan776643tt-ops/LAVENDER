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
  // وضع التعديل
  // =========================================================

  const [editingId, setEditingId] =
    useState(null);


  // =========================================================
  // نموذج المصروف
  //
  // فقط:
  // اسم المصروف
  // المبلغ
  // العملة
  // التاريخ
  // الملاحظات
  // =========================================================

  const createEmptyRow = () => ({

    type: "",

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
  // تحديث نموذج المصروف
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
  // تحديث الإنتاج
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
  // مصروفات المزرعة المختارة
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
  // مجموع المصروفات حسب العملة
  //
  // لا يوجد أي تحويل بين العملات.
  // =========================================================

  const expensesByCurrency =
    useMemo(() => {

      const totals = {};


      farmExpenses.forEach(
        item => {

          const currency =
            String(
              item.currency || "ل.س"
            );


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


  const expenseCurrencies =
    Object.keys(
      expensesByCurrency
    );


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
  // إمكانية حساب الربح
  // =========================================================

  const canCalculateProfit =
    expenseCurrencies.length === 1 &&
    expenseCurrencies[0] ===
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
     * التاريخ هنا نص عادي.
     *
     * إذا كتب المستخدم:
     *
     * 2006 7 2024
     *
     * نحفظ نفس النص:
     *
     * 2006 7 2024
     *
     * ولا نستعمل تاريخ اليوم.
     */

    const expenseData = {

      farmId:
        selectedFarmId,

      type:
        type,

      amount:
        amount,

      currency:
        newRow.currency || "ل.س",

      date:
        String(
          newRow.date || ""
        ),

      notes:
        String(
          newRow.notes || ""
        )

    };


    await expenseActions.create(
      expenseData
    );


    /*
     * بعد الحفظ نفتح سطراً جديداً
     * بدون وضع تاريخ اليوم.
     */

    setNewRow(
      createEmptyRow()
    );

  };


  // =========================================================
  // تعديل مصروف
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

      amount:
        item.amount ?? "",

      currency:
        item.currency || "ل.س",

      /*
       * استعادة التاريخ نفسه.
       */

      date:
        String(
          item.date || ""
        ),

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

        amount:
          amount,

        currency:
          newRow.currency || "ل.س",

        /*
         * لا نغير التاريخ أثناء التعديل.
         */

        date:
          String(
            newRow.date || ""
          ),

        notes:
          String(
            newRow.notes || ""
          )

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


      <p
        style={{
          fontSize: "17px",
          lineHeight: "1.8"
        }}
      >
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

            minHeight: "60px",

            padding: "14px",

            fontSize: "19px",

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
              كل مصروف تضيفه سيظهر كسطر مستقل في الجدول.
              يمكنك إضافة عدد غير محدود من المصروفات.
            </p>


            {/* =================================================
                اسم المصروف
            ================================================== */}

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              اسم المصروف
            </label>


            <input
              placeholder="مثال: أجار جرار، بذار، سماد، عمال"
              value={newRow.type}
              onChange={(e) =>
                updateRow(
                  "type",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "62px",

                padding: "14px",

                fontSize: "19px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

              }}
            />


            {/* =================================================
                مبلغ المصروف
            ================================================== */}

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px"
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

                minHeight: "64px",

                padding: "14px",

                fontSize: "21px",

                fontWeight: "600",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

              }}
            />


            {/* =================================================
                العملة
            ================================================== */}

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px"
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

                minHeight: "62px",

                padding: "14px",

                fontSize: "19px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

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


            {/* =================================================
                التاريخ
            ================================================== */}

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              تاريخ المصروف
            </label>


            {/*
             * مهم جداً:
             * هذا حقل نص وليس type="date".
             *
             * السبب:
             * المستخدم يريد أن يكتب التاريخ بنفس الصيغة
             * التي يريدها، ويجب حفظ النص نفسه.
             */}

            <input
              type="text"
              inputMode="text"
              placeholder="مثال: 2006 7 2024"
              value={newRow.date}
              onChange={(e) =>
                updateRow(
                  "date",
                  e.target.value
                )
              }
              style={{

                width: "100%",

                minHeight: "64px",

                padding: "14px",

                fontSize: "20px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

              }}
            />


            {/* =================================================
                الملاحظات
            ================================================== */}

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              ملاحظات — اختياري
            </label>


            <textarea
              placeholder="مثال: حرث الحقل، 10 عمال، جرار مان..."
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

                minHeight: "120px",

                padding: "14px",

                fontSize: "19px",

                lineHeight: "1.7",

                borderRadius: "10px",

                boxSizing: "border-box",

                resize: "vertical",

                marginBottom: "18px"

              }}
            />


            {/* =================================================
                زر الإضافة / التعديل
            ================================================== */}

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


            {/* =================================================
                البحث
            ================================================== */}

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

                minHeight: "60px",

                padding: "14px",

                fontSize: "18px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginTop: "22px"

              }}
            />


            {/* =================================================
                الجدول
            ================================================== */}

            <div
              style={{
                overflowX: "auto",
                marginTop: "20px"
              }}
            >

              {filteredExpenses.length === 0 ? (

                <p
                  style={{
                    fontSize: "17px"
                  }}
                >
                  لا توجد مصروفات لهذا الحقل حتى الآن.
                </p>

              ) : (

                <table
                  style={{

                    width: "100%",

                    minWidth: "700px",

                    borderCollapse: "collapse",

                    fontSize: "17px"

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
                        المبلغ
                      </th>

                      <th>
                        العملة
                      </th>

                      <th>
                        الملاحظات
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
                              padding: "14px"
                            }}
                          >
                            {item.date || "-"}
                          </td>


                          <td
                            style={{
                              padding: "14px"
                            }}
                          >

                            <strong>
                              {item.type}
                            </strong>

                          </td>


                          <td
                            style={{
                              padding: "14px",
                              fontWeight: "600"
                            }}
                          >

                            {formatNumber(
                              item.amount
                            )}

                          </td>


                          <td
                            style={{
                              padding: "14px",
                              fontWeight: "600"
                            }}
                          >

                            {item.currency || "ل.س"}

                          </td>


                          <td
                            style={{
                              padding: "14px"
                            }}
                          >

                            {item.notes || "-"}

                          </td>


                          <td
                            style={{
                              padding: "14px"
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

              )}

            </div>

          </Card>


          {/* =================================================
              المجموع الدائم
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
                      padding: "14px 0"
                    }}
                  >

                    <p
                      style={{
                        fontSize: "18px",
                        margin: "0 0 5px"
                      }}
                    >
                      إجمالي المصروفات بـ
                      {" "}
                      <strong>
                        {currency}
                      </strong>
                    </p>


                    <h2
                      style={{
                        margin: 0,
                        fontSize: "28px"
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


            <p
              style={{
                fontSize: "18px"
              }}
            >
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
              أدخل كمية الإنتاج وسعر البيع.
              التطبيق يضرب الكمية بسعر الوحدة تلقائياً.
            </p>


            <label
              style={{
                display: "block",
                fontSize: "18px",
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

                minHeight: "64px",

                padding: "14px",

                fontSize: "21px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

              }}
            />


            <label
              style={{
                display: "block",
                fontSize: "18px",
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

                minHeight: "62px",

                padding: "14px",

                fontSize: "19px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

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
                fontSize: "18px",
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

                minHeight: "64px",

                padding: "14px",

                fontSize: "21px",

                borderRadius: "10px",

                boxSizing: "border-box",

                marginBottom: "16px"

              }}
            />


            <label
              style={{
                display: "block",
                fontSize: "18px",
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

                minHeight: "62px",

                padding: "14px",

                fontSize: "19px",

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
                padding: "20px",
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


              <p
                style={{
                  fontSize: "17px"
                }}
              >

                {formatNumber(
                  production.quantity
                )}

                {" "}

                {production.unit}

                {" × "}

                {formatNumber(
                  production.price
                )}

                {" "}

                {production.currency}

              </p>

            </div>

          </Card>


          {/* =================================================
              الربح والخسارة
          ================================================== */}

          <Card
            title="📊 النتيجة المالية"
          >

            {canCalculateProfit ? (

              <>

                <p
                  style={{
                    fontSize: "19px"
                  }}
                >

                  💰 إجمالي المصروفات:
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
                    fontSize: "19px"
                  }}
                >

                  💵 إجمالي المبيعات:
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

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.8"
                }}
              >

                ⚠️ عند استخدام أكثر من عملة في المصروفات،
                يعرض التطبيق مجموع كل عملة بشكل مستقل
                ولا يقوم بتحويل العملات تلقائياً.

              </p>

            )}

          </Card>

        </>

      )}

    </div>

  );

}
