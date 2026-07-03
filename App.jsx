import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [farms, setFarms] = useState([]);

  const addFarm = () => {
    if (name === "") return;

    setFarms([...farms, name]);
    setName("");
  };

  return (
    <div>
      <h1>إدارة المزارع الذكية</h1>

      <p>أهلاً بك في المشروع</p>

      <input
        type="text"
        placeholder="اسم المزارع"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addFarm}>
        إضافة مزارع
      </button>

      <h2>قائمة المزارع</h2>

      <ul>
        {farms.map((farm, index) => (
          <li key={index}>{farm}</li>
        ))}
      </ul>
    </div>
  );
}
