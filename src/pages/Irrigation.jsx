import {
  useState,
  useContext,
  useMemo,
} from "react";

import {
  FarmContext
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Irrigation() {


  const {
    farms = [],
    fields = [],
    irrigations = [],
    setIrrigations,
  } = useContext(FarmContext);



  const [form, setForm] = useState({

    farm: "",

    field: "",

    method: "تنقيط",

    water: "",

    waterUnit: "لتر",

    duration: "",

    durationUnit: "دقيقة",

    priority: "متوسطة",

    status: "مجدولة",

    date: "",

    notes: "",

  });



  const updateForm = (key,value)=>{

    setForm({

      ...form,

      [key]: value

    });

  };





  // الحقول حسب المزرعة

  const farmFields = useMemo(()=>{


    if(!form.farm)

      return fields;


    return fields.filter(

      field =>

      field.farm === form.farm ||

      field.farmName === form.farm

    );


  },[
    fields,
    form.farm
  ]);





  // تحليل ذكي

  const smartAdvice = useMemo(()=>{


    const water =
      Number(form.water);



    if(water > 10000)

      return "💧 كمية مياه كبيرة، يفضل مراجعة الاحتياج المائي للمحصول.";



    if(form.method==="تنقيط")

      return "🌱 نظام التنقيط فعال لتوفير المياه.";



    if(form.priority==="عاجلة")

      return "⚠️ يجب تنفيذ عملية الري بأسرع وقت.";



    return "✅ خطة الري مناسبة حالياً.";


  },[
    form.water,
    form.method,
    form.priority
  ]);





  const addIrrigation = ()=>{


    if(
      !form.farm ||
      !form.field ||
      !form.water
    )
    return;



    const newItem = {


      id:
      Date.now(),


      ...form,


      createdAt:
      new Date().toISOString(),


      updatedAt:
      new Date().toISOString(),

    };



    setIrrigations([

      ...irrigations,

      newItem

    ]);



    setForm({

      farm:"",
      field:"",
      method:"تنقيط",
      water:"",
      waterUnit:"لتر",
      duration:"",
      durationUnit:"دقيقة",
      priority:"متوسطة",
      status:"مجدولة",
      date:"",
      notes:"",

    });


  };





  const deleteIrrigation=(id)=>{


    setIrrigations(

      irrigations.filter(

        item =>
        item.id !== id

      )

    );


  };





  return (

<div>


<h1>
💧 نظام إدارة الري الذكي
</h1>




<Card title="➕ إضافة عملية ري">


<select

value={form.farm}

onChange={(e)=>{

updateForm(
"farm",
e.target.value
);

updateForm(
"field",
""
);

}}

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

farmFields.map(field=>(

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

value={form.method}

onChange={(e)=>

updateForm(
"method",
e.target.value
)

}

>

<option>
تنقيط
</option>

<option>
رش
</option>

<option>
غمر
</option>

<option>
محوري
</option>

<option>
يدوي
</option>

</select>




<br/><br/>




<input

type="number"

placeholder="كمية المياه"

value={form.water}

onChange={(e)=>

updateForm(
"water",
e.target.value
)

}

/>




<select

value={form.waterUnit}

onChange={(e)=>

updateForm(
"waterUnit",
e.target.value
)

}

>

<option>
لتر
</option>

<option>
متر مكعب
</option>

</select>




<br/><br/>




<input

type="number"

placeholder="مدة الري"

value={form.duration}

onChange={(e)=>

updateForm(
"duration",
e.target.value
)

}

/>



<select

value={form.durationUnit}

onChange={(e)=>

updateForm(
"durationUnit",
e.target.value
)

}

>

<option>
دقيقة
</option>

<option>
ساعة
</option>

</select>




<br/><br/>




<select

value={form.priority}

onChange={(e)=>

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




<select

value={form.status}

onChange={(e)=>

updateForm(
"status",
e.target.value
)

}

>

<option>
مجدولة
</option>

<option>
تم التنفيذ
</option>

<option>
ملغاة
</option>

</select>




<br/><br/>




<input

type="date"

value={form.date}

onChange={(e)=>

updateForm(
"date",
e.target.value
)

}

/>




<br/><br/>




<textarea

placeholder="ملاحظات"

value={form.notes}

onChange={(e)=>

updateForm(
"notes",
e.target.value
)

}

/>




<br/><br/>



<p>
🤖 التوصية:
{" "}
{smartAdvice}
</p>




<Button
onClick={addIrrigation}
>

💾 حفظ عملية الري

</Button>



</Card>







<Card title="📋 سجل عمليات الري">


{

irrigations.map(item=>(


<Card

key={item.id}

title={
item.field
}

>


<p>
🏡 المزرعة:
{" "}
{item.farm}
</p>


<p>
💧 الطريقة:
{" "}
{item.method}
</p>


<p>
🚰 المياه:
{" "}
{item.water}
{" "}
{item.waterUnit}
</p>


<p>
⏱ المدة:
{" "}
{item.duration}
{" "}
{item.durationUnit}
</p>


<p>
🚦 الحالة:
{" "}
{item.status}
</p>


<p>
⚡ الأولوية:
{" "}
{item.priority}
</p>


<p>
📅 التاريخ:
{" "}
{item.date}
</p>


<p>
📝 ملاحظات:
{" "}
{item.notes}
</p>



<Button

onClick={()=>deleteIrrigation(item.id)}

>

🗑 حذف

</Button>



</Card>


))

}


</Card>



</div>

);

}
