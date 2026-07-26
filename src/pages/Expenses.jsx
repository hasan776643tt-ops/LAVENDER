import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Expenses() {

  const {
    expenses,
    setExpenses,
  } = useContext(FarmContext);

  const [type, setType] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [currency, setCurrency] =
    useState("ل.س - الليرة السورية");

  const [paymentMethod, setPaymentMethod] =
    useState("نقدي");

  const [supplier, setSupplier] =
    useState("");

  const [invoice, setInvoice] =
    useState("");

  const [date, setDate] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const addExpense = () => {

    if (!type || !amount) {
      return;
    }

    const newExpense = {

      id: Date.now(),

      type,

      amount: Number(amount),

      currency,

      paymentMethod,

      supplier,

      invoice,

      date,

      notes,

      createdAt:
        new Date().toLocaleString("ar"),

    };

    setExpenses([
      ...expenses,
      newExpense,
    ]);

    setType("");
    setAmount("");
    setSupplier("");
    setInvoice("");
    setDate("");
    setNotes("");

  };

  const deleteExpense = (id) => {

    setExpenses(
      expenses.filter(
        (item) => item.id !== id
      )
    );

  };

  const total =
    expenses.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  return (

    <div>

      <h1>
        💰 إدارة المصاريف الذكية
      </h1>

      <Card title="إضافة مصروف جديد">

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
        >

          <option value="">
            اختر نوع المصروف
          </option>

          <option>
            سماد
          </option>

          <option>
            مبيدات
          </option>

          <option>
            ري
          </option>

          <option>
            وقود
          </option>

          <option>
            أجور عمال
          </option>

          <option>
            صيانة
          </option>

          <option>
            معدات زراعية
          </option>

          <option>
            نقل وشحن
          </option>

          <option>
            أخرى
          </option>

        </select>

        <br /><br />

        <input
          type="number"
          placeholder="قيمة المصروف"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        <br /><br />

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(
              e.target.value
            )
          }
        >

          <option>
            ل.س - الليرة السورية
          </option>

          <option>
            $ - الدولار الأمريكي
          </option>

          <option>
            € - اليورو
          </option>

          <option>
            ₺ - الليرة التركية
          </option>

          <option>
            ر.س - الريال السعودي
          </option>

          <option>
            د.إ - الدرهم الإماراتي
          </option>

          <option>
            ر.ق - الريال القطري
          </option>

          <option>
            د.ك - الدينار الكويتي
          </option>

          <option>
            د.ب - الدينار البحريني
          </option>

          <option>
            ر.ع - الريال العماني
          </option>

          <option>
            د.أ - الدينار الأردني
          </option>

          <option>
            ل.ل - الليرة اللبنانية
          </option>

          <option>
            د.ع - الدينار العراقي
          </option>

          <option>
            ج.م - الجنيه المصري
          </option>

          <option>
            د.ل - الدينار الليبي
          </option>

          <option>
            د.ت - الدينار التونسي
          </option>

          <option>
            د.ج - الدينار الجزائري
          </option>

          <option>
            د.م - الدرهم المغربي
          </option>

          <option>
            م.أ - الأوقية الموريتانية
          </option>

          <option>
            ر.ي - الريال اليمني
          </option>

        </select>

        <br /><br />

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }
        >

          <option>
            نقدي
          </option>

          <option>
            تحويل بنكي
          </option>

          <option>
            بطاقة مصرفية
          </option>

          <option>
            محفظة إلكترونية
          </option>

        </select>

        <br /><br />

        <input
          type="text"
          placeholder="اسم المورد"
          value={supplier}
          onChange={(e) =>
            setSupplier(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="رقم الفاتورة"
          value={invoice}
          onChange={(e) =>
            setInvoice(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <textarea
          placeholder="ملاحظات إضافية"
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
        />

        <br /><br />

        <Button
          onClick={addExpense}
        >
          حفظ المصروف
        </Button>

      </Card>

      <Card title="📊 الملخص المالي">

        <h2>
          {total}
        </h2>

        <p>
          إجمالي المصاريف المسجلة
        </p>

        <p>
          عدد العمليات:
          {" "}
          {expenses.length}
        </p>

      </Card>

      <h2>
        📑 سجل المصاريف
      </h2>

      {expenses.map((item) => (

        <Card
          key={item.id}
          title={item.type}
        >

          <p>
            💵 القيمة:
            {" "}
            {item.amount}
          </p>

          <p>
            💱 العملة:
            {" "}
            {item.currency}
          </p>

          <p>
            🏦 طريقة الدفع:
            {" "}
            {item.paymentMethod}
          </p>

          <p>
            🏢 المورد:
            {" "}
            {item.supplier}
          </p>

          <p>
            🧾 رقم الفاتورة:
            {" "}
            {item.invoice}
          </p>

          <p>
            📅 التاريخ:
            {" "}
            {item.date}
          </p>

          <p>
            📝 الملاحظات:
            {" "}
            {item.notes}
          </p>

          <p>
            🕒 وقت التسجيل:
            {" "}
            {item.createdAt}
          </p>

          <Button
            onClick={() =>
              deleteExpense(
                item.id
              )
            }
          >
            حذف
          </Button>

        </Card>

      ))}

    </div>

  );

}
