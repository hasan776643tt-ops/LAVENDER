import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Expenses() {

  const {
    expenses,
    setExpenses,
  } = useContext(FarmContext);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ل.س");
  const [paymentMethod, setPaymentMethod] =
    useState("نقدي");

  const [priority, setPriority] =
    useState("متوسطة");

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const addExpense = () => {

    if (!category || !amount) return;

    const newExpense = {

      id: Date.now(),

      category,

      amount: Number(amount),

      currency,

      paymentMethod,

      priority,

      date,

      notes,

      createdAt:
        new Date().toLocaleString("ar-SY"),

    };

    setExpenses([
      ...expenses,
      newExpense,
    ]);

    setCategory("");
    setAmount("");
    setCurrency("ل.س");
    setPaymentMethod("نقدي");
    setPriority("متوسطة");
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

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  return (

    <div>

      <h1>
        💰 إدارة المصاريف
      </h1>

      <Card title="إضافة مصروف جديد">

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          <option value="">
            اختر التصنيف
          </option>

          <option>
            سماد
          </option>

          <option>
            مبيد
          </option>

          <option>
            وقود
          </option>

          <option>
            ري
          </option>

          <option>
            أجور عمال
          </option>

          <option>
            معدات
          </option>

          <option>
            نقل
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

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
              e.target.value
            )
          }
        >

          <option>
            منخفضة
          </option>

          <option>
            متوسطة
          </option>

          <option>
            عالية
          </option>

        </select>

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

      <Card title="ملخص المصاريف">

        <p>
          💵 إجمالي المصاريف:
          {" "}
          {totalExpenses}
        </p>

        <p>
          📊 عدد العمليات:
          {" "}
          {expenses.length}
        </p>

      </Card>

      <h2>
        📋 سجل المصاريف
      </h2>

      {expenses.map((item) => (

        <Card
          key={item.id}
          title={item.category}
        >

          <p>
            💵 القيمة:
            {" "}
            {item.amount}
            {" "}
            {item.currency}
          </p>

          <p>
            💳 الدفع:
            {" "}
            {item.paymentMethod}
          </p>

          <p>
            🔥 الأولوية:
            {" "}
            {item.priority}
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
            🕒 الإضافة:
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
            حذف المصروف
          </Button>

        </Card>

      ))}

    </div>

  );

}
