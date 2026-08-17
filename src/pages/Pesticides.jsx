// src/pages/Pesticides.jsx

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


export default function Pesticides() {


  const {

    farms = [],
    fields = [],
    crops = [],

    pesticides = [],

    pesticideActions,

  } = useContext(FarmContext);





  const initialForm = {

    farmId:"",

    fieldId:"",

    cropId:"",


    name:"",

    active:"",

    target:"",


    quantity:"",

    unit:"مل",


    method:"رش",


    date:"",


    safetyDays:"",


    status:"scheduled",


    priority:"medium",


    notes:"",

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







  const farmFields = useMemo(()=>{


    return fields.filter(

      field =>

      field.farmId === form.farmId

    );


  },[

    fields,

    form.farmId

  ]);







  const fieldCrops = useMemo(()=>{


    return crops.filter(

      crop =>

      crop.fieldId === form.fieldId

    );


  },[

    crops,

    form.fieldId

  ]);







  const totalQuantity = useMemo(()=>{


    return pesticides.reduce(

      (sum,item)=>

      sum +

      Number(
        item.quantity || 0
      ),

      0

    );


  },[pesticides]);







  const smartAdvice = useMemo(()=>{


    const days =

    Number(form.safetyDays);




    if(

      days > 0 &&

      days <= 3

    )

      return "🔴 فترة الأمان قصيرة، انتبه قبل الحصاد.";





    if(

      form.method === "رش"

    )

      return "🌱 تأكد من تغطية كامل النبات أثناء الرش.";





    if(

      form.priority === "high"

    )

      return "🚨 أولوية عالية، يفضل المتابعة بسرعة.";





    return "✅ عملية الرش تبدو مناسبة.";


  },[

    form.safetyDays,

    form.method,

    form.priority

  ]);







  const save = ()=>{


    if(

      !form.farmId ||

      !form.fieldId ||

      !form.name

    )

      return;





    if(editId){


      
pesticideActions.update(
  editId,
  form
);

    }

    else{


     pesticideActions.create(
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


      name:item.name,

      active:item.active,

      target:item.target,


      quantity:item.quantity,

      unit:item.unit,


      method:item.method,


      date:item.date,


      safetyDays:item.safetyDays,


      status:item.status,


      priority:item.priority,


      notes:item.notes,


    });



    setEditId(item.id);


  };return (

<div>


<h1>
🧪 نظام إدارة المبيدات الذكي
</h1>


<Card

title={
editId
?
"✏️ تعديل عملية رش"
:
"➕ إضافة عملية رش"
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


updateForm(
"cropId",
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





<input

placeholder="اسم المبيد"

value={form.name}

onChange={(e)=>

updateForm(
"name",
e.target.value
)

}

/>





<br/><br/>





<input

placeholder="المادة الفعالة"

value={form.active}

onChange={(e)=>

updateForm(
"active",
e.target.value
)

}

/>





<br/><br/>





<input

placeholder="الآفة أو المرض المستهدف"

value={form.target}

onChange={(e)=>

updateForm(
"target",
e.target.value
)

}

/>





<br/><br/>





<input

type="number"

placeholder="الكمية"

value={form.quantity}

onChange={(e)=>

updateForm(
"quantity",
e.target.value
)

}

/>





<select

value={form.unit}

onChange={(e)=>

updateForm(
"unit",
e.target.value
)

}

>


<option>
مل
</option>


<option>
لتر
</option>


<option>
كغ
</option>


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
رش
</option>


<option>
مع الري
</option>


<option>
تربة
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





<input

type="number"

placeholder="فترة الأمان بالأيام"

value={form.safetyDays}

onChange={(e)=>

updateForm(
"safetyDays",
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

🤖 التوصية:

{smartAdvice}

</p>





<Button onClick={save}>

{

editId

?

"حفظ التعديل"

:

"إضافة عملية رش"

}

</Button>


</Card>









<Card title="📊 إحصائيات المبيدات">


<p>
عدد عمليات الرش:
{pesticides.length}
</p>


<p>
إجمالي الكمية:
{totalQuantity}
</p>


</Card>









<Card title="📋 سجل عمليات الرش">


{

pesticides.map(item=>(


<Card

key={item.id}

title={item.name}

>


<p>
🏡 المزرعة:
{item.farmId}
</p>


<p>
🌱 المحصول:
{item.cropId}
</p>


<p>
🐛 الهدف:
{item.target}
</p>


<p>
⚗️ المادة الفعالة:
{item.active}
</p>


<p>
📦 الكمية:
{item.quantity} {item.unit}
</p>


<p>
⏳ فترة الأمان:
{item.safetyDays} يوم
</p>


<p>
📅 التاريخ:
{item.date}
</p>


<p>
⭐ الأولوية:
{item.priority}
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
  onClick={() =>
    pesticideActions.delete(item.id)
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
