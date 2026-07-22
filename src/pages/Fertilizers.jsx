import { useState } from "react";

export default function Pesticides() {

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sprayDate, setSprayDate] = useState("");
  const [safetyPeriod, setSafetyPeriod] = useState("");

  const [pesticides, setPesticides] = useState([]);


  const addPesticide = () => {

    if (!name) return;


    const newPesticide = {

      id: Date.now(),

      name: name,

      field: field,

      quantity: quantity,

      purpose: purpose,

      date: sprayDate,

      safety: safetyPeriod,

    };


    setPesticides([
      ...pesticides,
      newPesticide
    ]);


    setName("");
    setField("");
    setQuantity("");
    setPurpose("");
    setSprayDate("");
    setSafetyPeriod("");

  };


  const deletePesticide = (id) => {

    const updatedPesticides =
      pesticides.filter(
        (item) => item.id !== id
      );

    setPesticides(updatedPesticides);

  };


  return (
    <div>

      <h1>🧪 إدارة المبيدات</h1>


      <h2>إضافة مبيد جديد</h2>


      <input
        type="text"
        placeholder="اسم المبيد"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="الحقل أو المحصول"
        value={field}
        onChange={(e)=>setField(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="الكمية"
        value={quantity}
        onChange={(e)=>setQuantity(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="سبب الاستخدام"
        value={purpose}
        onChange={(e)=>setPurpose(e.target.value)}
      />


      <br /><br />


      <label>
        تاريخ الرش
      </label>

      <br />

      <input
        type="date"
        value={sprayDate}
        onChange={(e)=>setSprayDate(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="فترة الأمان"
        value={safetyPeriod}
        onChange={(e)=>setSafetyPeriod(e.target.value)}
      />


      <br /><br />


      <button onClick={addPesticide}>
        حفظ المبيد
      </button>


      <hr />


      <h2>سجل المبيدات</h2>


      <ul>

        {pesticides.map((item)=>(

          <li key={item.id}>

            🧪 {item.name}

            {" - "}

            الكمية: {item.quantity}

            {" - "}

            الحقل: {item.field}


            <button
              onClick={()=>deletePesticide(item.id)}
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>
  );
}
