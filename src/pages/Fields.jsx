import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Fields() {
  const {
    farms,
    fields,
    setFields,
  } = useContext(FarmContext);

  const [fieldName, setFieldName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [soilType, setSoilType] = useState("");
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");
  const [plantingDate, setPlantingDate] =
    useState("");
  const [notes, setNotes] = useState("");

  const addField = () => {
    if (!fieldName || !farmName) return;

    const newField = {
      id: Date.now(),
      name: fieldName,
      farm: farmName,
      soil: soilType,
      area,
      crop,
      plantingDate,
      notes,
    };

    setFields([...fields, newField]);

    setFieldName("");
    setFarmName("");
    setSoilType("");
    setArea("");
    setCrop("");
    setPlantingDate("");
    setNotes("");
  };

  const deleteField = (id) => {
    setFields(
      fields.filter(
        (field) => field.id !== id
      )
    );
  };

  return (
    <div>
      <h1>🌱 إدارة الحقول</h1>

      <Card title="إضافة حقل جديد">

        <input
          type="text"
          placeholder="اسم الحقل"
          value={fieldName}
          onChange={(e) =>
            setFieldName(e.target.value)
          }
        />

        <br /><br />

        <select
          value={farmName}
          onChange={(e) =>
            setFarmName(e.target.value)
          }
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (
            <option
              key={farm.id}
              value={farm.name}
            >
              {farm.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="نوع التربة"
          value={soilType}
          onChange={(e) =>
            setSoilType(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="مساحة الحقل"
          value={area}
          onChange={(e) =>
            setArea(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="المحصول"
          value={crop}
          onChange={(e) =>
            setCrop(e.target.value)
          }
        />

        <br /><br />

        <input
          type="date"
          value={plantingDate}
          onChange={(e) =>
            setPlantingDate(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />

        <br /><br />

        <Button onClick={addField}>
          حفظ الحقل
        </Button>

      </Card>

      <h2>قائمة الحقول</h2>

      {fields.map((field) => (
        <Card
          key={field.id}
          title={field.name}
        >
          <p>🏡 المزرعة: {field.farm}</p>

          <p>🟤 التربة: {field.soil}</p>

          <p>📏 المساحة: {field.area}</p>

          <p>🌾 المحصول: {field.crop}</p>

          <p>
            📅 تاريخ الزراعة:
            {" "}
            {field.plantingDate}
          </p>

          <p>📝 الملاحظات: {field.notes}</p>

          <Button
            onClick={() =>
              deleteField(field.id)
            }
          >
            حذف الحقل
          </Button>
        </Card>
      ))}
    </div>
  );
}
