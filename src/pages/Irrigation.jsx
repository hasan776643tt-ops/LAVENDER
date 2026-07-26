import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Irrigation() {

  const {
    farms,
    fields,
    irrigations,
    setIrrigations,
  } = useContext(FarmContext);


  const [farmName, setFarmName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [method, setMethod] = useState("");
  const [water, setWater] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");


  const addIrrigation = () => {

    if (!farmName || !fieldName || !method) return;


    const newIrrigation = {

      id: Date.now(),

      farm: farmName,

      field: fieldName,

      method,

      water,

      duration,

      date,

      notes,

    };


    setIrrigations([
      ...irrigations,
      newIrrigation
    ]);


    setFarmName("");
    setFieldName("");
    setMethod("");
    setWater("");
    setDuration("");
    setDate("");
    setNotes("");

  };


  const deleteIrrigation = (id) => {

    setIrrigations(
      irrigations.filter(
        (item) => item.id !== id
      )
    );

  };


  const farmFields = fields.filter(
    (field) => field.farm === farmName
  );


  return (

    <div>

      <h1>💧 إدارة الري</h1>


      <Card title="إضافة عملية ري جديدة">


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


          {farmFields.map((field)=>(

            <option
              key={field.id}
              value={field.name}
            >
              {field.name}
            </option>

          ))}


        </select>


        <br /><br />


        <input
          type="text"
          placeholder="طريقة الري (تنقيط، غمر، رش)"
          value={method}
          onChange={(e)=>
            setMethod(e.target.value)
          }
        />


        <br /><br />


        <input
          type="number"
          placeholder="كمية المياه"
          value={water}
          onChange={(e)=>
            setWater(e.target.value)
          }
        />


        <br /><br />


        <input
          type="number"
          placeholder="مدة الري بالدقائق"
          value={duration}
          onChange={(e)=>
            setDuration(e.target.value)
          }
        />


        <br /><br />


        <label>
          تاريخ الري
        </label>


        <input
          type="date"
          value={date}
          onChange={(e)=>
            setDate(e.target.value)
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


        <Button onClick={addIrrigation}>
          حفظ عملية الري
        </Button>


      </Card>



      <h2>
        سجل عمليات الري
      </h2>



      {irrigations.map((item)=>(


        <Card
          key={item.id}
          title={`💧 ${item.field}`}
        >

          <p>
            🏡 المزرعة: {item.farm}
          </p>


          <p>
            🌱 الحقل: {item.field}
          </p>


          <p>
            🚰 طريقة الري: {item.method}
          </p>


          <p>
            💦 كمية المياه: {item.water}
          </p>


          <p>
            ⏱ مدة الري: {item.duration} دقيقة
          </p>


          <p>
            📅 التاريخ: {item.date}
          </p>


          <p>
            📝 الملاحظات: {item.notes}
          </p>



          <Button
            onClick={() =>
              deleteIrrigation(item.id)
            }
          >
            حذف عملية الري
          </Button>


        </Card>


      ))}


    </div>

  );

}
