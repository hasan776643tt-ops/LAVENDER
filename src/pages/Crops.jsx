import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Crops() {
  const {
    fields,
    crops,
    setCrops,
  } = useContext(FarmContext);

  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [seedQuantity, setSeedQuantity] = useState("");

  const addCrop = () => {
    if (!cropName || !fieldName) return;

    const newCrop = {
      id: Date.now(),
      name: cropName,
      variety: variety,
      field: fieldName,
      planting: plantingDate,
      harvest: harvestDate,
      seeds: seedQuantity,
    };

    setCrops([
      ...crops,
      newCrop,
    ]);

    setCropName("");
    setVariety("");
    setFieldName("");
    setPlantingDate("");
    setHarvestDate("");
    setSeedQuantity("");
  };

  const deleteCrop = (id) => {
    setCrops(
      crops.filter(
        (crop) => crop.id !== id
      )
    );
  };

  return (
    <div>

      <h1>🌿 إدارة المحاصيل</h1>

      <h2>إضافة محصول جديد</h2>

      <input
        type="text"
        placeholder="اسم المحصول"
        value={cropName}
        onChange={(e) =>
          setCropName(e.target.value)
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="صنف المحصول"
        value={variety}
        onChange={(e) =>
          setVariety(e.target.value)
        }
      />

      <br /><br />

      <select
        value={fieldName}
        onChange={(e) =>
          setFieldName(e.target.value)
        }
      >

        <option value="">
          اختر الحقل
        </option>

        {fields.map((field) => (
          <option
            key={field.id}
            value={field.name}
          >
            {field.name}
          </option>
        ))}

      </select>

      <br /><br />

      <label>
        تاريخ الزراعة
      </label>

      <br />

      <input
        type="date"
        value={plantingDate}
        onChange={(e) =>
          setPlantingDate(e.target.value)
        }
      />

      <br /><br />

      <label>
        تاريخ الحصاد
      </label>

      <br />

      <input
        type="date"
        value={harvestDate}
        onChange={(e) =>
          setHarvestDate(e.target.value)
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="كمية البذور"
        value={seedQuantity}
        onChange={(e) =>
          setSeedQuantity(e.target.value)
        }
      />

      <br /><br />

      <button onClick={addCrop}>
        حفظ المحصول
      </button>

      <hr />

      <h2>قائمة المحاصيل</h2>

      <ul>

        {crops.map((crop) => (

          <li key={crop.id}>

            🌿 {crop.name}
            {" - "}
            🌱 {crop.variety}
            {" - "}
            🏡 {crop.field}
            {" - "}
            📏 البذور: {crop.seeds}

            <button
              onClick={() =>
                deleteCrop(crop.id)
              }
            >
              حذف
            </button>

          </li>

        ))}

      </ul>

    </div>
  );
}
