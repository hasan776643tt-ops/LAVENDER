import { useState } from "react";

export default function Crops() {

  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [seedQuantity, setSeedQuantity] = useState("");

  const [crops, setCrops] = useState([]);


  const addCrop = () => {

    if (!cropName) return;


    const newCrop = {

      id: Date.now(),

      name: cropName,

      variety: variety,

      field: fieldName,

      planting: plantingDate,

      harvest: harvestDate,

      seeds: seedQuantity,

    };


    setCrops([...crops, newCrop]);


    setCropName("");
    setVariety("");
    setFieldName("");
    setPlantingDate("");
    setHarvestDate("");
    setSeedQuantity("");

  };


  const deleteCrop = (id) => {

    const updatedCrops = crops.filter(
      (crop) => crop.id !== id
    );

    setCrops(updatedCrops);

  };


  return (

    <div>

      <h1>🌿 إدارة المحاصيل</h1>


      <h2>إضافة محصول جديد</h2>


      <input
        type="text"
        placeholder="اسم المحصول"
        value={cropName}
        onChange={(e)=>setCropName(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="صنف المحصول"
        value={variety}
        onChange={(e)=>setVariety(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="الحقل المرتبط"
        value={fieldName}
        onChange={(e)=>setFieldName(e.target.value)}
      />


      <br /><br />


      <label>تاريخ الزراعة</label>

      <br />

      <input
        type="date"
        value={plantingDate}
        onChange={(e)=>setPlantingDate(e.target.value)}
      />


      <br /><br />


      <label>تاريخ الحصاد</label>

      <br />

      <input
        type="date"
        value={harvestDate}
        onChange={(e)=>setHarvestDate(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="كمية البذور"
        value={seedQuantity}
        onChange={(e)=>setSeedQuantity(e.target.value)}
      />


      <br /><br />


      <button onClick={addCrop}>
        حفظ المحصول
      </button>


      <hr />


      <h2>قائمة المحاصيل</h2>


      <ul>

        {crops.map((crop)=>(

          <li key={crop.id}>

            🌿 {crop.name}

            {" - "}

            🌱 {crop.variety}

            {" - "}

            📏 البذور: {crop.seeds}


            <button
              onClick={()=>deleteCrop(crop.id)}
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>

  );
}
