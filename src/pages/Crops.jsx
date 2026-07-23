import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Crops() {

  const {
    farms,
    fields,
    crops,
    setCrops,
  } = useContext(FarmContext);


  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [farmName, setFarmName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [seedQuantity, setSeedQuantity] = useState("");
  const [production, setProduction] = useState("");
  const [notes, setNotes] = useState("");


  const addCrop = () => {

    if (!cropName || !fieldName) return;


    const newCrop = {

      id: Date.now(),

      name: cropName,

      variety,

      farm: farmName,

      field: fieldName,

      planting: plantingDate,

      harvest: harvestDate,

      seeds: seedQuantity,

      production,

      notes,

    };


    setCrops([
      ...crops,
      newCrop
    ]);


    setCropName("");
    setVariety("");
    setFarmName("");
    setFieldName("");
    setPlantingDate("");
    setHarvestDate("");
    setSeedQuantity("");
    setProduction("");
    setNotes("");

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

      <h1>
        🌿 إدارة المحاصيل
      </h1>



      <Card title="إضافة محصول جديد">


        <input
          type="text"
          placeholder="اسم المحصول"
          value={cropName}
          onChange={(e)=>
            setCropName(e.target.value)
          }
        />


        <br /><br />


        <input
          type="text"
          placeholder="صنف المحصول"
          value={variety}
          onChange={(e)=>
            setVariety(e.target.value)
          }
        />


        <br /><br />


        <select
          value={farmName}
          onChange={(e)=>
            setFarmName(e.target.value)
          }
        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map((farm)=>(

            <option
              key={farm.id}
              value={farm.name}
            >
              {farm.name}
            </option>

          ))}


        </select>


        <br /><br />


        <select
          value={fieldName}
          onChange={(e)=>
            setFieldName(e.target.value)
          }
        >

          <option value="">
            اختر الحقل
          </option>


          {fields.map((field)=>(

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

        <input
          type="date"
          value={plantingDate}
          onChange={(e)=>
            setPlantingDate(e.target.value)
          }
        />


        <br /><br />


        <label>
          تاريخ الحصاد
        </label>

        <input
          type="date"
          value={harvestDate}
          onChange={(e)=>
            setHarvestDate(e.target.value)
          }
        />


        <br /><br />


        <input
          type="number"
          placeholder="كمية البذور"
          value={seedQuantity}
          onChange={(e)=>
            setSeedQuantity(e.target.value)
          }
        />


        <br /><br />


        <input
          type="number"
          placeholder="الإنتاج المتوقع"
          value={production}
          onChange={(e)=>
            setProduction(e.target.value)
          }
        />


        <br /><br />


        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e)=>
            setNotes(e.target.value)
          }
        />


        <br /><br />


        <Button onClick={addCrop}>
          حفظ المحصول
        </Button>


      </Card>



      <h2>
        قائمة المحاصيل
      </h2>



      {crops.map((crop)=>(


        <Card
          key={crop.id}
          title={crop.name}
        >

          <p>
            🌱 الصنف: {crop.variety}
          </p>


          <p>
            🏡 المزرعة: {crop.farm}
          </p>


          <p>
            🌾 الحقل: {crop.field}
          </p>


          <p>
            📅 الزراعة: {crop.planting}
          </p>


          <p>
            📅 الحصاد: {crop.harvest}
          </p>


          <p>
            🌰 البذور: {crop.seeds}
          </p>


          <p>
            📦 الإنتاج المتوقع: {crop.production}
          </p>


          <p>
            📝 الملاحظات: {crop.notes}
          </p>



          <Button
            onClick={()=>
              deleteCrop(crop.id)
            }
          >

            حذف المحصول

          </Button>


        </Card>


      ))}


    </div>

  );

}
