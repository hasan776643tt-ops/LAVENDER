import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Farms() {
  const { farms, setFarms } = useContext(FarmContext);

  const [farmName, setFarmName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [notes, setNotes] = useState("");

  const addFarm = () => {
    if (!farmName || !ownerName) return;

    const newFarm = {
      id: Date.now(),
      name: farmName,
      owner: ownerName,
      area: farmArea,
      location,
      cropType,
      irrigationType,
      plantingDate,
      notes,
    };

    setFarms([...farms, newFarm]);

    setFarmName("");
    setOwnerName("");
    setFarmArea("");
    setLocation("");
    setCropType("");
    setIrrigationType("");
    setPlantingDate("");
    setNotes("");
  };

  const deleteFarm = (id) => {
    setFarms(farms.filter((farm) => farm.id !== id));
  };

  return (
    <div>
      <h1>🌾 إدارة المزارع</h1>

      <Card title="إضافة مزرعة جديدة">

        <input
          type="text"
          placeholder="اسم المزرعة"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="اسم المالك"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="المساحة بالدونم"
          value={farmArea}
          onChange={(e) => setFarmArea(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="الموقع"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="نوع المحصول"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="نوع الري"
          value={irrigationType}
          onChange={(e) => setIrrigationType(e.target.value)}
        />

        <br /><br />

        <input
          type="date"
          value={plantingDate}
          onChange={(e) => setPlantingDate(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <br /><br />

        <Button onClick={addFarm}>
          إضافة المزرعة
        </Button>

      </Card>

      <h2>قائمة المزارع</h2>

      {farms.map((farm) => (
        <Card
          key={farm.id}
          title={farm.name}
        >
          <p>👤 المالك: {farm.owner}</p>

          <p>📏 المساحة: {farm.area} دونم</p>

          <p>📍 الموقع: {farm.location}</p>

          <p>🌱 المحصول: {farm.cropType}</p>

          <p>💧 الري: {farm.irrigationType}</p>

          <p>📅 تاريخ الزراعة: {farm.plantingDate}</p>

          <p>📝 الملاحظات: {farm.notes}</p>

          <Button
            onClick={() => deleteFarm(farm.id)}
          >
            حذف المزرعة
          </Button>
        </Card>
      ))}
    </div>
  );
}
