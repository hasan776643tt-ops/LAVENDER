import { useState } from "react";

export default function Farms() {
  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [cropType, setCropType] = useState("");
  const [farms, setFarms] = useState([]);

  const addFarm = () => {
    if (!farmName) return;

    const newFarm = {
      name: farmName,
      area: farmArea,
      crop: cropType,
    };

    setFarms([...farms, newFarm]);

    setFarmName("");
    setFarmArea("");
    setCropType("");
  };

  return (
    <div>
      <h1>إدارة المزارع</h1>

      <input
        type="text"
        placeholder="اسم المزرعة"
        value={farmName}
        onChange={(e) => setFarmName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="مساحة المزرعة"
        value={farmArea}
        onChange={(e) => setFarmArea(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="نوع المحصول"
        value={cropType}
        onChange={(e) => setCropType(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addFarm}>إضافة مزرعة</button>

      <hr />

      <h2>قائمة المزارع</h2>

      <ul>
        {farms.map((farm, index) => (
          <li key={index}>
            {farm.name} - {farm.area} دونم - {farm.crop}
          </li>
        ))}
      </ul>
    </div>
  );
}
