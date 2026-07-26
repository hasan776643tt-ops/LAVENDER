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
    useState("ل.س");

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
        💰 إدارة المصاريف
      </h1>

      <Card title="إضافة مصروف">

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
            ل.س
          </option>

          <option>
            $
          </option>

          <option>
            ₺
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
          placeholder="ملاحظات"
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

      <Card title="📊 ملخص مالي">

        <h2>
          {total}
        </h2>

        <p>
          إجمالي المصاريف
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
            🧾 الفاتورة:
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
