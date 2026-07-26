import {
  useState,
  useContext,
  useMemo,
} from "react";

import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Diseases() {


  const {
    farms = [],
    fields = [],
    diseases = [],
    setDiseases,
  } = useContext(FarmContext);



  const [form, setForm] = useState({

    farm: "",
    field: "",
    crop: "",

    type: "",

    name: "",

    severity: "متوسطة",

    status: "جديدة",

    source: "يدوي",

    infectionRate: "",

    discoveryDate: "",

    followDate: "",

    symptoms: "",

    diagnosis: "",

    treatment: "",

    image: "",

    notes: "",

  });



  const updateForm = (key,value)=>{

    setForm({

      ...form,

      [key]:value

    });

  };





  // الحقول التابعة للمزرعة

  const filteredFields = useMemo(()=>{


    if(!form.farm)
      return fields;


    return fields.filter(

      field =>
        field.farm === form.farm ||
        field.farmName === form.farm

    );


  },[fields,form.farm]);





  const smartAdvice = useMemo(()=>{


    if(form.severity==="عالية")

      return "⚠️ يوصى بالتدخل السريع ومراجعة مهندس زراعي.";


    if(form.severity==="متوسطة")

      return "🌱 يجب متابعة الحالة خلال الأيام القادمة.";


    return "✅ الحالة تحت السيطرة مع المتابعة.";

  },[form.severity]);





  const addDisease = ()=>{


    if(
      !form.field ||
      !form.type
    )
    return;



    const newDisease={


      id:Date.now(),


      ...form,


      createdAt:
      new Date().toISOString(),


      updatedAt:
      new Date().toISOString(),

    };



    setDiseases([

      ...diseases,

      newDisease

    ]);



    setForm({

      farm:"",
      field:"",
      crop:"",
      type:"",
      name:"",
      severity:"متوسطة",
      status:"جديدة",
      source:"يدوي",
      infectionRate:"",
      discoveryDate:"",
      followDate:"",
      symptoms:"",
      diagnosis:"",
      treatment:"",
      image:"",
      notes:"",

    });


  };





  const deleteDisease=(id)=>{


    setDiseases(

      diseases.filter(

        item=>item.id!==id

      )

    );

  };




  return (

<div>


<h1>
🦠 نظام الأمراض والآفات الذكي
</h1>



<Card title="إضافة حالة مرضية">


<select
value={form.farm}
onChange={
e=>updateForm(
"farm",
e.target.value
)
}
>

<option>
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
onChange={
e=>updateForm(
"field",
e.target.value
)
}
>

<option>
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
value={form.type}
onChange={
e=>updateForm(
"type",
e.target.value
)
}
>

<option>
نوع المشكلة
</option>

<option>
مرض فطري
</option>

<option>
مرض بكتيري
</option>

<option>
حشرة
</option>

<option>
فيروس
</option>

<option>
نقص عناصر
</option>

<option>
مشكلة ري
</option>

</select>



<br/><br/>



<input

placeholder="اسم المرض"

value={form.name}

onChange={
e=>updateForm(
"name",
e.target.value
)
}

/>



<br/><br/>



<select
value={form.severity}
onChange={
e=>updateForm(
"severity",
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

</select>



<br/><br/>



<select
value={form.status}
onChange={
e=>updateForm(
"status",
e.target.value
)
}
>

<option>
جديدة
</option>

<option>
قيد العلاج
</option>

<option>
تم الشفاء
</option>

<option>
تحتاج متابعة
</option>

</select>



<br/><br/>



<select
value={form.source}
onChange={
e=>updateForm(
"source",
e.target.value
)
}
>

<option>
يدوي
</option>

<option>
مهندس زراعي
</option>

<option>
ذكاء اصطناعي
</option>

</select>



<br/><br/>



<input

type="number"

placeholder="نسبة الإصابة %"

value={form.infectionRate}

onChange={
e=>updateForm(
"infectionRate",
e.target.value
)
}

/>



<br/><br/>



<input

type="date"

value={form.discoveryDate}

onChange={
e=>updateForm(
"discoveryDate",
e.target.value
)
}

/>



<br/><br/>



<textarea

placeholder="الأعراض"

value={form.symptoms}

onChange={
e=>updateForm(
"symptoms",
e.target.value
)
}

/>



<br/><br/>



<textarea

placeholder="التشخيص"

value={form.diagnosis}

onChange={
e=>updateForm(
"diagnosis",
e.target.value
)
}

/>



<br/><br/>



<textarea

placeholder="العلاج"

value={form.treatment}

onChange={
e=>updateForm(
"treatment",
e.target.value
)
}

/>



<br/><br/>



<textarea

placeholder="ملاحظات"

value={form.notes}

onChange={
e=>updateForm(
"notes",
e.target.value
)
}

/>



<br/><br/>


<p>
🤖 التوصية:
{smartAdvice}
</p>



<Button onClick={addDisease}>

حفظ الحالة

</Button>


</Card>





<Card title="📋 سجل الأمراض">


{

diseases.map(item=>(


<Card

key={item.id}

title={
item.name ||
item.type
}

>


<p>
🏡 {item.farm}
</p>


<p>
🌾 {item.field}
</p>


<p>
⚠️ الخطورة:
{item.severity}
</p>


<p>
📌 الحالة:
{item.status}
</p>


<p>
🤖 المصدر:
{item.source}
</p>


<p>
🦠 النوع:
{item.type}
</p>


<p>
💊 العلاج:
{item.treatment}
</p>



<Button

onClick={()=>deleteDisease(item.id)}

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
