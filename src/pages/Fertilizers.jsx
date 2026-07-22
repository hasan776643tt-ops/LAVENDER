import { useState } from "react";

export default function Fertilizers() {

  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [fertilizers, setFertilizers] = useState([]);


  const addFertilizer = () => {

    if (!type) return;


    const newFertilizer = {

      id: Date.now(),

      type: type,

      quantity: quantity,

      date: date,

      notes: notes,

    };


    setFertilizers([
      ...fertilizers,
      newFertilizer
    ]);


    setType("");
    setQuantity("");
    setDate("");
    setNotes("");

  };


  const deleteFertilizer = (id) => {

    setFertilizers(
      fertilizers.filter(
        (item) => item.id !== id
      )
    );

  };


  return (
    <div>

      <h1>🌾 إدارة الأسمدة</h1>


      <h2>
        إضافة سماد جديد
      </h2>


      <input
        type="text"
        placeholder="نوع السماد"
        value={type}
        onChange={(e)=>setType(e.target.value)}
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


      <button onClick={addFertilizer}>
        حفظ السماد
      </button>


      <hr />


      <h2>
        سجل الأسمدة
      </h2>


      <ul>

        {fertilizers.map((item)=>(

          <li key={item.id}>

            🌾 النوع: {item.type}

            <br />

            الكمية: {item.quantity}

            <br />

            التاريخ: {item.date}

            <br />

            الملاحظات: {item.notes}


            <br />

            <button
              onClick={()=>deleteFertilizer(item.id)}
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>
  );
}
