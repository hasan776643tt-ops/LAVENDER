import {
  useState,
  useContext,
  useMemo,
} from "react";

import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Engineer() {


  const {

    farms = [],

    fields = [],

    consultations = [],

    setConsultations,

  } = useContext(FarmContext);




  const [form,setForm] = useState({

    farm:"",

    field:"",

    crop:"",

    specialization:"",

    priority:"متوسطة",

    problem:"",

    date:"",

    status:"جديدة",

    reply:"",

  });





  const updateForm=(key,value)=>{

    setForm({

      ...form,

      [key]:value

    });

  };





  const filteredFields = useMemo(()=>{


    if(!form.farm)

      return fields;



    return fields.filter(

      field =>

      field.farm === form.farm ||

      field.farmName === form.farm

    );


  },[fields,form.farm]);







  const sendConsultation=()=>{


    if(

      !form.farm ||

      !form.field ||

      !form.problem

    )

    return;




    const newConsultation={


      id:Date.now(),


      ...form,


      createdAt:

      new Date().toISOString(),


      updatedAt:

      new Date().toISOString(),


    };



    setConsultations([

      ...consultations,

      newConsultation

    ]);




    setForm({

      farm:"",

      field:"",

      crop:"",

      specialization:"",

      priority:"متوسطة",

      problem:"",

      date:"",

      status:"جديدة",

      reply:"",

    });


  };






  const deleteConsultation=(id)=>{


    setConsultations(

      consultations.filter(

        item =>

        item.id !== id

      )

    );


  };





  return (

<div>


<h1>
👨‍🌾 نظام الاستشارات الزراعية الذكي
</h1>





<Card title="📨 طلب استشارة مهندس">


<select

value={form.farm}

onChange={e=>

updateForm(

"farm",

e.target.value

)

}

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

value={form.field}

onChange={e=>

updateForm(

"field",

e.target.value

)

}

>

<option value="">

اختر الحقل

</option>



{

filteredFields.map(field=>(


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





<select

value={form.specialization}

onChange={e=>

updateForm(

"specialization",

e.target.value

)

}

>


<option>

اختر تخصص المهندس

</option>


<option>

أمراض نبات

</option>


<option>

محاصيل

</option>


<option>

ري

</option>


<option>

تسميد

</option>


<option>

آفات زراعية

</option>


</select>





<br/><br/>





<input

placeholder="نوع المحصول"

value={form.crop}

onChange={e=>

updateForm(

"crop",

e.target.value

)

}

/>





<br/><br/>





<select

value={form.priority}

onChange={e=>

updateForm(

"priority",

e.target.value

)

}

>


<option>

منخفضة

</option>


<option>

متوسطة

</option>


<option>

عالية

</option>


<option>

عاجلة

</option>


</select>





<br/><br/>





<textarea

placeholder="وصف المشكلة الزراعية"

value={form.problem}

onChange={e=>

updateForm(

"problem",

e.target.value

)

}

/>





<br/><br/>





<input

type="date"

value={form.date}

onChange={e=>

updateForm(

"date",

e.target.value

)

}

/>





<br/><br/>





<Button

onClick={sendConsultation}

>

إرسال الاستشارة

</Button>



</Card>







<Card title="📋 سجل الاستشارات">


{

consultations.map(item=>(


<Card

key={item.id}

title={

item.specialization ||

"استشارة"

}

>


<p>

🏡 المزرعة:

{item.farm}

</p>


<p>

🌾 الحقل:

{item.field}

</p>


<p>

🌱 المحصول:

{item.crop}

</p>


<p>

🚨 الأولوية:

{item.priority}

</p>


<p>

⚠️ المشكلة:

{item.problem}

</p>


<p>

📌 الحالة:

{item.status}

</p>


<p>

📅 التاريخ:

{item.date}

</p>



<Button

onClick={()=>deleteConsultation(item.id)}

>

حذف

</Button>



</Card>



))


}


</Card>





</div>

  );

}
