import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Farms() {
  const { farms, setFarms } = useContext(FarmContext);

  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [location, setLocation] = useState("");

  const addFarm = () => {
    if (!farmName) return;

    const newFarm = {
      id: Date.now(),
      name: farmName,
      area: farmArea,
      location: location,
    };

    setFarms([...farms, newFarm]);

    setFarmName("");
    setFarmArea("");
    setLocation("");
  };

  const deleteFarm = (id) => {
    const updatedFarms = farms.filter(
      (farm) => farm.id !== id
    );

    setFarms(updatedFarms);
  };

  return (
    <div>
      <h1>🌾 إدارة المزارع</h1>

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
        placeholder="مساحة المزرعة بالدونم"
        value={farmArea}
        onChange={(e) => setFarmArea(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="موقع المزرعة"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addFarm}>
        إضافة مزرعة
      </button>

      <hr />

      <h2>قائمة المزارع</h2>

      <ul>
        {farms.map((farm) => (
          <li key={farm.id}>
            🌾 {farm.name}
            {" - "}
            {farm.area} دونم
            {" - "}
            📍 {farm.location}

            <button
              onClick={() => deleteFarm(farm.id)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
