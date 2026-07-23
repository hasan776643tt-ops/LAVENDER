import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Fertilizers() {

  const {
    fields,
    fertilizers,
    setFertilizers,
  } = useContext(FarmContext);


  const [fieldName, setFieldName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");


  const addFertilizer = () => {

    if (!fieldName || !type) return;


    const newFertilizer = {

      id: Date.now(),

      field: fieldName,

      type: type,

      quantity: quantity,

      date: date,

      notes: notes,

    };


    setFertilizers([
      ...fertilizers,
      newFertilizer,
    ]);


    setFieldName("");
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


      <h2>إضافة سماد جديد</h2>


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


      <input
        type="text"
        placeholder="نوع السماد"
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      />


      <br /><br />


      <input
        type="number"
        placeholder="الكمية"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
      />


      <br /><br />


      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
      />


      <br /><br />


      <textarea
        placeholder="ملاحظات"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />


      <br /><br />


      <button onClick={addFertilizer}>
        حفظ السماد
      </button>


      <hr />


      <h2>سجل الأسمدة</h2>


      <ul>

        {fertilizers.map((item) => (

          <li key={item.id}>

            🌱 الحقل: {item.field}

            <br />

            🌾 النوع: {item.type}

            <br />

            الكمية: {item.quantity}

            <br />

            التاريخ: {item.date}

            <br />

            الملاحظات: {item.notes}


            <br />

            <button
              onClick={() =>
                deleteFertilizer(item.id)
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
