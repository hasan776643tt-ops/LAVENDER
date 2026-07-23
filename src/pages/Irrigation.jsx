import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Irrigation() {
  const { irrigations, setIrrigations } =
    useContext(FarmContext);

  const [method, setMethod] = useState("");
  const [water, setWater] = useState("");
  const [date, setDate] = useState("");

  const addIrrigation = () => {
    if (!method || !water) return;

    const newIrrigation = {
      id: Date.now(),
      method: method,
      water: water,
      date: date,
    };

    setIrrigations([
      ...irrigations,
      newIrrigation,
    ]);

    setMethod("");
    setWater("");
    setDate("");
  };

  const deleteIrrigation = (id) => {
    setIrrigations(
      irrigations.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div>
      <h1>💧 إدارة الري</h1>

      <p>
        تسجيل عمليات ري الحقول ومتابعتها.
      </p>

      <h2>
        إضافة عملية ري
      </h2>

      <input
        type="text"
        placeholder="طريقة الري (تنقيط، رش...)"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="كمية المياه"
        value={water}
        onChange={(e) => setWater(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <button onClick={addIrrigation}>
        حفظ عملية الري
      </button>

      <hr />

      <h2>
        سجل الري
      </h2>

      <ul>
        {irrigations.map((item) => (
          <li key={item.id}>
            💧 الطريقة: {item.method}

            <br />

            🚰 المياه: {item.water}

            <br />

            📅 التاريخ: {item.date}

            <br />

            <button
              onClick={() => deleteIrrigation(item.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
