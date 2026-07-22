import { useState } from "react";

export default function Irrigation() {

  const [fieldName, setFieldName] = useState("");
  const [method, setMethod] = useState("");
  const [waterAmount, setWaterAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [irrigations, setIrrigations] = useState([]);


  const addIrrigation = () => {

    if (!fieldName) return;


    const newIrrigation = {

      id: Date.now(),

      field: fieldName,

      method: method,

      water: waterAmount,

      date: date,

      notes: notes,

    };


    setIrrigations([
      ...irrigations,
      newIrrigation
    ]);


    setFieldName("");
    setMethod("");
    setWaterAmount("");
    setDate("");
    setNotes("");

  };


  const deleteIrrigation = (id) => {

    const updatedIrrigations =
      irrigations.filter(
        (item) => item.id !== id
      );

    setIrrigations(updatedIrrigations);

  };


  return (
    <div>

      <h1>💧 إدارة الري</h1>


      <h2>إضافة عملية ري جديدة</h2>


      <input
        type="text"
        placeholder="اسم الحقل"
        value={fieldName}
        onChange={(e)=>setFieldName(e.target.value)}
      />


      <br /><br />


      <select
        value={method}
        onChange={(e)=>setMethod(e.target.value)}
      >
        <option value="">
          اختر طريقة الري
        </option>

        <option>
          تنقيط
        </option>

        <option>
          رش
        </option>

        <option>
          غمر
        </option>

      </select>


      <br /><br />


      <input
        type="number"
        placeholder="كمية المياه"
        value={waterAmount}
        onChange={(e)=>setWaterAmount(e.target.value)}
      />


      <br /><br />


      <label>
        تاريخ الري
      </label>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
      />


      <br /><br />


      <textarea
        placeholder="ملاحظات"
        value={notes}
        onChange={(e)=>setNotes(e.target.value)}
      />


      <br /><br />


      <button onClick={addIrrigation}>
        حفظ عملية الري
      </button>


      <hr />


      <h2>سجل الري</h2>


      <ul>

        {irrigations.map((item)=>(

          <li key={item.id}>

            💧 الحقل: {item.field}

            {" - "}

            الطريقة: {item.method}

            {" - "}

            المياه: {item.water}


            <button
              onClick={()=>deleteIrrigation(item.id)}
            >
              حذف
            </button>

          </li>

        ))}

      </ul>


    </div>
  );
}
