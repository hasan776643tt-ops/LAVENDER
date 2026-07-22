import { useState } from "react";

export default function Expenses() {

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [expenses, setExpenses] = useState([]);


  const addExpense = () => {

    if (!type || !amount) return;


    const newExpense = {

      id: Date.now(),

      type: type,

      amount: Number(amount),

      date: date,

      notes: notes,

    };


    setExpenses([
      ...expenses,
      newExpense
    ]);


    setType("");
    setAmount("");
    setDate("");
    setNotes("");

  };


  const deleteExpense = (id) => {

    const updatedExpenses =
      expenses.filter(
        (item) => item.id !== id
      );

    setExpenses(updatedExpenses);

  };


  const total = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );


  return (
    <div>

      <h1>💰 إدارة المصاريف</h1>


      <h2>
        إضافة مصروف جديد
      </h2>


      <input
        type="text"
        placeholder="نوع المصروف"
        value={type}
        onChange={(e)=>setType(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="القيمة"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
      />


      <br /><br />


      <label>
        التاريخ
      </label>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
      />


      <br /><br />


      <textarea
        placeholder="ملاحظات"
        value={notes}
        onChange={(e)=>setNotes(e.target.value)}
      />


      <br /><br />


      <button onClick={addExpense}>
        حفظ المصروف
      </button>


      <hr />


      <h2>
        سجل المصاريف
      </h2>


      <h3>
        💵 المجموع: {total}
      </h3>


      <ul>

        {expenses.map((item)=>(

          <li key={item.id}>

            💰 {item.type}

            {" - "}

            {item.amount}

            <br />

            📅 {item.date}


            <button
              onClick={()=>deleteExpense(item.id)}
            >
              حذف
            </button>

          </li>

        ))}

      </ul>


    </div>
  );
}
