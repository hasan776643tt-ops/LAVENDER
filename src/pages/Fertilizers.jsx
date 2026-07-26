import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Fertilizers() {


  const {
    farms,
    fields,
    fertilizers,
    setFertilizers,
  } = useContext(FarmContext);



  const [farmName, setFarmName] = useState("");

  const [fieldName, setFieldName] = useState("");

  const [type, setType] = useState("");

  const [quantity, setQuantity] = useState("");

  const [unit, setUnit] = useState("كغ");

  const [method, setMethod] = useState("");

  const [date, setDate] = useState("");

  const [notes, setNotes] = useState("");



  const addFertilizer = () => {


    if(
      !farmName ||
      !fieldName ||
      !type
    ) return;



    const newFertilizer = {


      id: Date.now(),

      farm: farmName,

      field: fieldName,

      type,

      quantity,

      unit,

      method,

      date,

      notes,

    };



    setFertilizers([
      ...fertilizers,
      newFertilizer
    ]);



    setFarmName("");

    setFieldName("");

    setType("");

    setQuantity("");

    setUnit("كغ");

    setMethod("");

    setDate("");

    setNotes("");

  };




  const deleteFertilizer = (id)=>{


    setFertilizers(

      fertilizers.filter(
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
        🌾 إدارة الأسمدة الذكية
      </h1>



      <Card title="إضافة عملية تسميد جديدة">


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

          placeholder="نوع السماد"

          value={type}

          onChange={(e)=>
            setType(e.target.value)
          }

        />



        <br/><br/>




        <input

          type="number"

          placeholder="كمية السماد"

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
            كغ
          </option>


          <option>
            طن
          </option>


          <option>
            لتر
          </option>


        </select>



        <br/><br/>




        <input

          type="text"

          placeholder="طريقة التسميد (تربة، رش، ري)"

          value={method}

          onChange={(e)=>
            setMethod(e.target.value)
          }

        />



        <br/><br/>




        <label>
          تاريخ التسميد
        </label>


        <input

          type="date"

          value={date}

          onChange={(e)=>
            setDate(e.target.value)
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




        <Button onClick={addFertilizer}>

          حفظ عملية التسميد

        </Button>



      </Card>





      <h2>
        سجل عمليات التسميد
      </h2>




      {
        fertilizers.map(item=>(


          <Card

            key={item.id}

            title={item.type}

          >


            <p>
              🏡 المزرعة: {item.farm}
            </p>


            <p>
              🌱 الحقل: {item.field}
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
              📝 الملاحظات:
              {item.notes}
            </p>



            <Button

              onClick={()=>
                deleteFertilizer(item.id)
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
