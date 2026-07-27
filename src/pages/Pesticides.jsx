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


export default function Pesticides() {


  const {

    farms = [],
    fields = [],
    crops = [],
    pesticides = [],
    setPesticides,

  } = useContext(FarmContext);




  const [form,setForm] = useState({

    farm:"",
    field:"",
    crop:"",
    name:"",
    active:"",
    target:"",
    quantity:"",
    unit:"مل",
    method:"",
    date:"",
    safetyDays:"",
    notes:"",

  });





  const updateForm = (key,value)=>{

    setForm({

      ...form,

      [key]:value

    });

  };





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







  const addPesticide = ()=>{


    if(

      !form.farm ||

      !form.field ||

      !form.name

    ){

      alert(
        "اختر المزرعة والحقل وأدخل اسم المبيد"
      );

      return;

    }





    const newPesticide = {


      id:

      Date.now(),


      ...form,


      status:"نشط",


      createdAt:

      new Date().toISOString(),


    };





    setPesticides([

      newPesticide,

      ...pesticides

    ]);





    setForm({

      farm:"",
      field:"",
      crop:"",
      name:"",
      active:"",
      target:"",
      quantity:"",
      unit:"مل",
      method:"",
      date:"",
      safetyDays:"",
      notes:"",

    });


  };







  const deletePesticide=(id)=>{


    setPesticides(

      pesticides.filter(

        item=>

        item.id !== id

      )

    );


  };







  const getSafetyStatus=(days)=>{


    const value =
      Number(days);



    if(!value)

      return "غير محدد";



    if(value <= 3)

      return "🔴 يحتاج متابعة";



    if(value <= 7)

      return "🟡 قريب من الحصاد";



    return "🟢 آمن";

  };








return (

<div>


<h1>
🧪 إدارة المبيدات الذكية
</h1>



<p>
نظام متابعة عمليات الرش وفترات الأمان الزراعية.
</p>





<Card title="➕ إضافة عملية رش">


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

farmFields.map(item=>(

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





<input

placeholder="طريقة الاستخدام"

value={form.method}

onChange={(e)=>

updateForm(
"method",
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





<Button onClick={addPesticide}>

💾 حفظ عملية الرش

</Button>



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
{item.farm}
</p>


<p>
🌱 المحصول:
{item.crop}
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
⚖️ الكمية:
{item.quantity} {item.unit}
</p>


<p>
⏳ فترة الأمان:
{item.safetyDays} يوم
</p>


<p>
📌 الحالة:
{getSafetyStatus(item.safetyDays)}
</p>


<p>
📅 التاريخ:
{item.date}
</p>


<p>
📝 ملاحظات:
{item.notes}
</p>



<Button

onClick={()=>deletePesticide(item.id)}

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
