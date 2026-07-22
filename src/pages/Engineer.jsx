import { useState } from "react";

export default function Engineer() {

  const [farmerName, setFarmerName] = useState("");
  const [crop, setCrop] = useState("");
  const [problem, setProblem] = useState("");
  const [date, setDate] = useState("");

  const [consultations, setConsultations] = useState([]);


  const sendConsultation = () => {

    if (!farmerName || !problem) return;


    const newConsultation = {

      id: Date.now(),

      farmer: farmerName,

      crop: crop,

      problem: problem,

      date: date,

      status: "بانتظار رد المهندس",

    };


    setConsultations([
      ...consultations,
      newConsultation
    ]);


    setFarmerName("");
    setCrop("");
    setProblem("");
    setDate("");

  };


  const deleteConsultation = (id) => {

    const updatedConsultations =
      consultations.filter(
        (item) => item.id !== id
      );


    setConsultations(updatedConsultations);

  };


  return (
    <div>

      <h1>👨‍🌾 استشارة المهندس الزراعي</h1>


      <h2>
        إرسال طلب استشارة
      </h2>


      <input
        type="text"
        placeholder="اسم المزارع"
        value={farmerName}
        onChange={(e)=>setFarmerName(e.target.value)}
      />


      <br /><br />


      <input
        type="text"
        placeholder="نوع المحصول"
        value={crop}
        onChange={(e)=>setCrop(e.target.value)}
      />


      <br /><br />


      <textarea
        placeholder="اكتب المشكلة الزراعية"
        value={problem}
        onChange={(e)=>setProblem(e.target.value)}
      />


      <br /><br />


      <label>
        تاريخ الطلب
      </label>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
      />


      <br /><br />


      <button onClick={sendConsultation}>
        إرسال الاستشارة
      </button>


      <hr />


      <h2>
        سجل الاستشارات
      </h2>


      <ul>

        {consultations.map((item)=>(

          <li key={item.id}>

            👨‍🌾 المزارع: {item.farmer}

            <br />

            🌿 المحصول: {item.crop}

            <br />

            ⚠️ المشكلة: {item.problem}

            <br />

            📅 التاريخ: {item.date}

            <br />

            🔔 الحالة: {item.status}


            <br /><br />

            <button
              onClick={()=>deleteConsultation(item.id)}
            >
              حذف
            </button>


          </li>

        ))}

      </ul>


    </div>
  );
}
