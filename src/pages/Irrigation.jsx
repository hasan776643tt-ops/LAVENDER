// src/pages/Irrigation.jsx

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
  crops = [],

  irrigations = [],

  irrigationActions,

} = useContext(FarmContext);




  const initialForm = {

    farmId: "",

    fieldId: "",

    cropId: "",

    method: "تنقيط",

    waterAmount: "",

    waterUnit: "liter",

    duration: "",

    date: "",

    status: "scheduled",

    priority: "medium",

    notes: "",

  };



  const [form,setForm] =
    useState(initialForm);



  const [editId,setEditId] =
    useState(null);





  const updateForm = (
    key,
    value
  )=>{

    setForm(prev=>({

      ...prev,

      [key]:value

    }));

  };







  // الحقول المرتبطة بالمزرعة

  const farmFields = useMemo(()=>{

    return fields.filter(

      field =>

      field.farmId === form.farmId

    );

  },[
    fields,
    form.farmId
  ]);





  // المحاصيل المرتبطة بالحقل

  const fieldCrops = useMemo(()=>{

    return crops.filter(

      crop =>

      crop.fieldId === form.fieldId

    );

  },[
    crops,
    form.fieldId
  ]);






  // تحليل ذكي

  const smartAdvice = useMemo(()=>{


    const water =
      Number(form.waterAmount);



    if(
      water > 10000
    )

      return "⚠️ كمية المياه مرتفعة، راجع احتياج المحصول.";




    if(
      form.method === "تنقيط"
    )

      return "🌱 التنقيط مناسب لتوفير المياه.";




    if(
      form.priority === "high"
    )

      return "🚨 أولوية عالية، يفضل تنفيذ الري قريباً.";




    return "✅ خطة الري مناسبة.";



  },[
    form.waterAmount,
    form.method,
    form.priority
  ]);







  const save = () => {

  if (
    !form.farmId ||
    !form.fieldId ||
    !form.waterAmount
  ) {
    return;
  }

  if (editId) {

    irrigationActions.update(
      editId,
      form
    );

  } else {

    irrigationActions.create(
      form
    );

  }

  



    setForm(
      initialForm
    );


    setEditId(null);


  };







  const edit = (item)=>{


    setForm({

      farmId:item.farmId,

      fieldId:item.fieldId,

      cropId:item.cropId,

      method:item.method,

      waterAmount:item.waterAmount,

      waterUnit:item.waterUnit,

      duration:item.duration,

      date:item.date,

      status:item.status,

      priority:item.priority,

      notes:item.notes,

    });


    setEditId(item.id);


  };









return (

<div>


<h1>
💧 نظام الري الذكي
</h1>





<Card

title={
editId
?
"✏️ تعديل عملية ري"
:
"➕ إضافة عملية ري"
}

>



<select

value={form.farmId}

onChange={(e)=>{

updateForm(
"farmId",
e.target.value
);

updateForm(
"fieldId",
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

value={farm.id}

>

{farm.name}

</option>

))

}

</select>




<br/><br/>





<select

value={form.fieldId}

onChange={(e)=>

updateForm(
"fieldId",
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

value={field.id}

>

{field.name}

</option>

))

}

</select>





<br/><br/>






<select

value={form.cropId}

onChange={(e)=>

updateForm(
"cropId",
e.target.value
)

}

>


<option value="">
اختر المحصول
</option>



{

fieldCrops.map(crop=>(

<option

key={crop.id}

value={crop.id}

>

{crop.name}

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


</select>





<br/><br/>





<input

type="number"

placeholder="كمية المياه"

value={form.waterAmount}

onChange={(e)=>

updateForm(
"waterAmount",
e.target.value
)

}

/>





<br/><br/>





<input

type="number"

placeholder="مدة الري بالدقائق"

value={form.duration}

onChange={(e)=>

updateForm(
"duration",
e.target.value
)

}

/>





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





<select

value={form.priority}

onChange={(e)=>

updateForm(
"priority",
e.target.value
)

}

>

<option value="low">
منخفضة
</option>

<option value="medium">
متوسطة
</option>

<option value="high">
عالية
</option>


</select>





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





<p>
🤖 التحليل:
{smartAdvice}
</p>





<Button onClick={save}>

{

editId

?
"حفظ التعديل"

:

"إضافة الري"

}

</Button>



</Card>








<Card title="📋 سجل عمليات الري">


{

irrigations.map(item=>(


<Card

key={item.id}

title={
"عملية ري"
}

>


<p>
💧 الطريقة:
{item.method}
</p>


<p>
🚰 المياه:
{item.waterAmount}
</p>


<p>
📅 التاريخ:
{item.date}
</p>


<p>
🚦 الحالة:
{item.status}
</p>


<p>
📝 {item.notes}
</p>




<Button

onClick={()=>edit(item)}

>

تعديل

</Button>




<Button

onClick={()=>
  irrigationActions.delete(item.id)
}

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
