import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function Pesticides() {

  const {
    fields,
    pesticides,
    setPesticides,
  } = useContext(FarmContext);


  const [fieldName, setFieldName] = useState("");
  const [pesticideName, setPesticideName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");


  const addPesticide = () => {

    if (!fieldName || !pesticideName) return;


    const newPesticide = {

      id: Date.now(),

      field: fieldName,

      name: pesticideName,

      quantity: quantity,

      date: date,

      notes: notes,

    };


    setPesticides([
      ...pesticides,
      newPesticide,
    ]);


    setFieldName("");
    setPesticideName("");
    setQuantity("");
    setDate("");
    setNotes("");

  };


  const deletePesticide = (id) => {

    setPesticides(
      pesticides.filter(
        (item) => item.id !== id
      )
    );

  };


  return (
    <div>

      <h1>🧪 إدارة المبيدات</h1>


      <h2>إضافة مبيد جديد</h2>


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
        placeholder="اسم المبيد"
        value={pesticideName}
        onChange={(e) =>
          setPesticideName(e.target.value)
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


      <button onClick={addPesticide}>
        حفظ المبيد
      </button>


      <hr />


      <h2>سجل المبيدات</h2>


      <ul>

        {pesticides.map((item) => (

          <li key={item.id}>

            🧪 المبيد: {item.name}

            <br />

            🌱 الحقل: {item.field}

            <br />

            الكمية: {item.quantity}

            <br />

            التاريخ: {item.date}

            <br />

            الملاحظات: {item.notes}


            <button
              onClick={() =>
                deletePesticide(item.id)
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
