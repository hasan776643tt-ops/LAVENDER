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

  const [date, setDate] = useState("");

  const [duration, setDuration] = useState("");

  const [durationUnit, setDurationUnit] = useState("دقائق");

  const [notes, setNotes] = useState("");



  const addIrrigation = () => {

    if(
      !farmName ||
      !fieldName ||
      !method ||
      !water
    ) return;


    const newIrrigation = {

      id: Date.now(),

      farm: farmName,

      field: fieldName,

      method,

      water,

      date,

      duration,

      durationUnit,

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
    setDate("");
    setDuration("");
    setDurationUnit("دقائق");
    setNotes("");

  };



  const deleteIrrigation = (id)=>{

    setIrrigations(
      irrigations.filter(
        item=>item.id !== id
      )
    );

  };



  const farmFields = fields.filter(
    field =>
    field.farm === farmName
  );



  return (

    <div>

      <h1>
        💧 إدارة الري الذكي
      </h1>


      <Card title="إضافة عملية ري جديدة">


        <select
          value={farmName}
          onChange={(e)=>{
            setFarmName(e.target.value);
            setFieldName("");
          }}
        >

          <option value="">
            اختر المزرعة
          </option>


          {farms.map(farm=>(

            <option
              key={farm.id}
              value={farm.name}
            >
              {farm.name}
            </option>

          ))}


        </select>


        <br/><br/>



        <select
          value={fieldName}
          onChange={(e)=>
            setFieldName(e.target.value)
          }
        >

          <option value="">
            اختر الحقل
          </option>


          {farmFields.map(field=>(

            <option
              key={field.id}
              value={field.name}
            >
              {field.name}
            </option>

          ))}


        </select>



        <br/><br/>



        <input
          type="text"
          placeholder="طريقة الري"
          value={method}
          onChange={(e)=>
            setMethod(e.target.value)
          }
        />


        <br/><br/>



        <input
          type="number"
          placeholder="كمية المياه (لتر)"
          value={water}
          onChange={(e)=>
            setWater(e.target.value)
          }
        />


        <br/><br/>



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



        <br/><br/>



        <input
          type="number"
          placeholder="مدة الري"
          value={duration}
          onChange={(e)=>
            setDuration(e.target.value)
          }
        />



        <select
          value={durationUnit}
          onChange={(e)=>
            setDurationUnit(e.target.value)
          }
        >

          <option>
            دقائق
          </option>

          <option>
            ساعات
          </option>

          <option>
            أيام
          </option>

        </select>



        <br/><br/>



        <textarea

          placeholder="ملاحظات"

          value={notes}

          onChange={(e)=>
            setNotes(e.target.value)
          }

        />



        <br/><br/>



        <Button onClick={addIrrigation}>
          حفظ عملية الري
        </Button>


      </Card>



      <h2>
        سجل عمليات الري
      </h2>



      {
        irrigations.map(item=>(


          <Card
            key={item.id}
            title={item.field}
          >


            <p>
              🏡 المزرعة:
              {item.farm}
            </p>


            <p>
              💧 الطريقة:
              {item.method}
            </p>


            <p>
              🚰 المياه:
              {item.water} لتر
            </p>


            <p>
              ⏱ مدة الري:
              {item.duration}
              {" "}
              {item.durationUnit}
            </p>


            <p>
              📅 التاريخ:
              {item.date}
            </p>


            <p>
              📝 ملاحظات:
              {item.notes}
            </p>



            <Button
              onClick={()=>
                deleteIrrigation(item.id)
              }
            >
              حذف
            </Button>


          </Card>


        ))
      }



    </div>

  );

}
