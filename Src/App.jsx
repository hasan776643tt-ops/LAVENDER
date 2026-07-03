import { useState } from "react";

export default function App() {
  const [farmName, setFarmName] = useState("");
  const [farms, setFarms] = useState([]);

  const addFarm = () => {
    if (farmName.trim() === "") return;

    setFarms([...farms, farmName]);
    setFarmName("");
  };

  return (
    <div>
      <h1>إدارة المزارع الذكية</h1>

      <input
        type="text"
        placeholder="اسم المزرعة"
        value={farmName}
        onChange={(e) => setFarmName(e.target.value)}
      />

      <button onClick={addFarm}>إضافة مزرعة</button>

      <h2>المزارع</h2>

      <ul>
        {farms.map((farm, index) => (
          <li key={index}>{farm}</li>
        ))}
      </ul>
    </div>
  );
}
