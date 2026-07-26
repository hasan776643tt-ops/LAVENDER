import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Pesticides() {


  const {
    farms,
    fields,
    pesticides,
    setPesticides,
  } = useContext(FarmContext);



  const [farmName, setFarmName] = useState("");

  const [fieldName, setFieldName] = useState("");

  const [name, setName] = useState("");

  const [target, setTarget] = useState("");

  const [quantity, setQuantity] = useState("");

  const [unit, setUnit] = useState("مل");

  const [method, setMethod] = useState("");

  const [date, setDate] = useState("");

  const [safetyDays, setSafetyDays] = useState("");

  const [notes, setNotes] = useState("");



  const addPesticide = () => {


    if(
      !farmName ||
      !fieldName ||
      !name
    ) return;



    const newPesticide = {


      id: Date.now(),

      farm: farmName,

      field: fieldName,

      name,

      target,

      quantity,

      unit,

      method,

      date,

      safetyDays,

      notes,


    };



    setPesticides([

      ...pesticides,

      newPesticide

    ]);



    setFarmName("");

    setFieldName("");

    setName("");

    setTarget("");

    setQuantity("");

    setUnit("مل");

    setMethod("");

    setDate("");

    setSafetyDays("");

    setNotes("");

  };




  const deletePesticide = (id)=>{


    setPesticides(

      pesticides.filter(

        item => item.id !== id

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
        🧪 إدارة المبيدات الذكية
      </h1>



      <Card title="إضافة عملية رش جديدة">


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


          {
            farms.map(farm=>(

              <option
                key={farm.id}
                value={farm.name}
              >

                {farm.name}

              </option>

            ))
          }


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


          {
            farmFields.map(field=>(

              <option

                key={field.id}

                value={field.name}

              >

                {field.name}

              </option>

            ))
          }


        </select>



        <br/><br/>




        <input

          type="text"

          placeholder="اسم المبيد"

          value={name}

          onChange={(e)=>

            setName(e.target.value)

          }

        />



        <br/><br/>




        <input

          type="text"

          placeholder="الآفة أو المرض المستهدف"

          value={target}

          onChange={(e)=>

            setTarget(e.target.value)

          }

        />



        <br/><br/>




        <input

          type="number"

          placeholder="الكمية"

          value={quantity}

          onChange={(e)=>

            setQuantity(e.target.value)

          }

        />



        <select

          value={unit}

          onChange={(e)=>

            setUnit(e.target.value)

          }

        >

          <option>
            مل
          </option>


          <option>
            لتر
          </option>


          <option>
            كغ
          </option>


        </select>



        <br/><br/>




        <input

          type="text"

          placeholder="طريقة الاستخدام"

          value={method}

          onChange={(e)=>

            setMethod(e.target.value)

          }

        />



        <br/><br/>




        <label>
          تاريخ الرش
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

          placeholder="فترة الأمان قبل الحصاد بالأيام"

          value={safetyDays}

          onChange={(e)=>

            setSafetyDays(e.target.value)

          }

        />



        <br/><br/>




        <textarea

          placeholder="ملاحظات"

          value={notes}

          onChange={(e)=>

            setNotes(e.target.value)

          }

        />



        <br/><br/>




        <Button onClick={addPesticide}>

          حفظ عملية الرش

        </Button>



      </Card>





      <h2>
        سجل المبيدات
      </h2>




      {
        pesticides.map(item=>(


          <Card

            key={item.id}

            title={item.name}

          >


            <p>
              🏡 المزرعة: {item.farm}
            </p>


            <p>
              🌱 الحقل: {item.field}
            </p>


            <p>
              🐛 الهدف: {item.target}
            </p>


            <p>
              ⚖️ الكمية:
              {item.quantity} {item.unit}
            </p>


            <p>
              🚜 الطريقة:
              {item.method}
            </p>


            <p>
              📅 التاريخ:
              {item.date}
            </p>


            <p>
              ⏳ فترة الأمان:
              {item.safetyDays} يوم
            </p>


            <p>
              📝 الملاحظات:
              {item.notes}
            </p>



            <Button

              onClick={()=>deletePesticide(item.id)}

            >

              حذف

            </Button>



          </Card>


        ))
      }



    </div>

  );

}
