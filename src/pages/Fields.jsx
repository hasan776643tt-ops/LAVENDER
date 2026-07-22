import { useState } from "react";

export default function Fields() {

  const [fieldName, setFieldName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [soilType, setSoilType] = useState("");
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");

  const [fields, setFields] = useState([]);


  const addField = () => {

    if (!fieldName) return;

    const newField = {
      id: Date.now(),
      name: fieldName,
      farm: farmName,
      soil: soilType,
      area: area,
      crop: crop,
    };


    setFields([...fields, newField]);

    setFieldName("");
    setFarmName("");
    setSoilType("");
    setArea("");
    setCrop("");
  };


  const deleteField = (id) => {

    const updatedFields = fields.filter(
      (field) => field.id !== id
    );

    setFields(updatedFields);

  };


  return (
    <div>

      <h1>🌱 إدارة الحقول</h1>


      <h2>إضافة حقل جديد</h2>


      <input
        type="text"
        placeholder="اسم الحقل"
        value={fieldName}
        onChange={(e)=>setFieldName(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="اسم المزرعة"
        value={farmName}
        onChange={(e)=>setFarmName(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="نوع التربة"
        value={soilType}
        onChange={(e)=>setSoilType(e.target.value)}
      />


      <br /><br />


      <input
        type="number"
        placeholder="مساحة الحقل"
        value={area}
        onChange={(e)=>setArea(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="المحصول"
        value={crop}
        onChange={(e)=>setCrop(e.target.value)}
      />


      <br /><br />


      <button onClick={addField}>
        حفظ الحقل
      </button>


      <hr />


      <h2>قائمة الحقول</h2>


      <ul>

        {fields.map((field)=>(

          <li key={field.id}>

            🌱 {field.name}
            {" - "}
            🌾 {field.crop}
            {" - "}
            📏 {field.area}
            {" - "}
            🟤 {field.soil}


            <button
              onClick={()=>deleteField(field.id)}
            >
              حذف
            </button>

          </li>

        ))}

      </ul>


    </div>
  );
}
