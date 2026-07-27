import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Diseases() {


  const {

    farms = [],
    fields = [],
    crops = [],
    diseases = [],
    setDiseases,

  } = useContext(FarmContext);





  const initialForm = {

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

    notes:"",

  };





  const [form,setForm] =
    useState(initialForm);





  const updateForm = (key,value)=>{

    setForm(prev=>({

      ...prev,

      [key]:value

    }));

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







  const riskAnalysis = useMemo(()=>{


    const rate =
      Number(form.infectionRate || 0);



    if(

      form.severity === "عالية" ||

      rate >= 50

    ){

      return {

        level:"🔴 خطر مرتفع",

        advice:
        "يجب التدخل السريع ومراجعة مهندس زراعي."

      };

    }




    if(

      form.severity === "متوسطة" ||

      rate >= 20

    ){

      return {

        level:"🟡 خطر متوسط",

        advice:
        "ينصح بالمراقبة والمتابعة المستمرة."

      };

    }




    return {

      level:"🟢 خطر منخفض",

      advice:
      "الحالة مستقرة مع المتابعة."

    };


  },[

    form.severity,

    form.infectionRate

  ]);







  const addDisease = ()=>{


    if(

      !form.field ||

      !form.type

    ){

      alert(
        "اختر الحقل ونوع المشكلة"
      );

      return;

    }




    const newDisease = {


      id:

      Date.now(),


      ...form,


      risk:

      riskAnalysis.level,


      recommendation:

      riskAnalysis.advice,


      createdAt:

      new Date().toISOString(),


      updatedAt:

      new Date().toISOString(),

    };





    setDiseases([

      newDisease,

      ...diseases

    ]);





    setForm(initialForm);


  };







  const deleteDisease=(id)=>{


    setDiseases(

      diseases.filter(

        item =>

        item.id !== id

      )

    );


  };







  return (

<div>


<h1>
🦠 نظام الأمراض الزراعي الذكي
</h1>


<p>
تشخيص ومتابعة الأمراض والآفات مع تحليل مستوى الخطورة.
</p>






<Card title="➕ تسجيل حالة جديدة">



<select

value={form.farm}

onChange={(e)=>

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

farms.map(item=>(

<option

key={item.id}

value={item.name}

>

{item.name}

</option>


))

}


</select>





<br/><br/>





<select

value={form.field}

onChange={(e)=>

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

filteredFields.map(item=>(

<option

key={item.id}

value={item.name}

>

{item.name}

</option>


))

}


</select>





<br/><br/>





<select

value={form.crop}

onChange={(e)=>

updateForm(
"crop",
e.target.value
)

}

>

<option value="">
اختر المحصول
</option>


{

crops.map(item=>(

<option

key={item.id}

value={item.name}

>

{item.name}

</option>


))

}


</select>





<br/><br/>





<input

placeholder="اسم المرض أو الآفة"

value={form.name}

onChange={(e)=>

updateForm(
"name",
e.target.value
)

}

/>





<br/><br/>





<select

value={form.type}

onChange={(e)=>

updateForm(
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
فيروس
</option>

<option>
حشرة
</option>

<option>
نقص عناصر
</option>

<option>
مشكلة ري
</option>


</select>





<br/><br/>





<select

value={form.severity}

onChange={(e)=>

updateForm(
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





<input

type="number"

placeholder="نسبة الإصابة %"

value={form.infectionRate}

onChange={(e)=>

updateForm(
"infectionRate",
e.target.value
)

}

/>





<br/><br/>





<textarea

placeholder="الأعراض"

value={form.symptoms}

onChange={(e)=>

updateForm(
"symptoms",
e.target.value
)

}

/>





<br/><br/>





<textarea

placeholder="التشخيص"

value={form.diagnosis}

onChange={(e)=>

updateForm(
"diagnosis",
e.target.value
)

}

/>





<br/><br/>





<textarea

placeholder="العلاج"

value={form.treatment}

onChange={(e)=>

updateForm(
"treatment",
e.target.value
)

}

/>





<br/><br/>





<p>

🤖 التحليل:

<br/>

{riskAnalysis.level}

<br/>

{riskAnalysis.advice}

</p>





<Button onClick={addDisease}>

💾 حفظ الحالة

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
🏡 المزرعة:
{item.farm}
</p>


<p>
🌱 المحصول:
{item.crop}
</p>


<p>
🦠 النوع:
{item.type}
</p>


<p>
⚠️ الخطورة:
{item.risk}
</p>


<p>
💊 العلاج:
{item.treatment}
</p>


<p>
🤖 التوصية:
{item.recommendation}
</p>


<Button

onClick={()=>deleteDisease(item.id)}

>

🗑️ حذف

</Button>



</Card>


))


}



</Card>




</div>

  );

}
