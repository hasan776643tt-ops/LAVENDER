import {
  useState,
  useContext,
  useMemo,
} from "react";

import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Fertilizers() {


  const {
    farms = [],
    fields = [],
    fertilizers = [],
    setFertilizers,
  } = useContext(FarmContext);



  const [form, setForm] = useState({

    farm: "",
    field: "",

    crop: "",

    type: "",

    category: "كيميائي",

    quantity: "",

    unit: "كغ",

    method: "تربة",

    stage: "",

    supplier: "",

    cost: "",

    currency: "ل.س",

    date: "",

    notes: "",

  });



  const updateForm = (key,value)=>{

    setForm({

      ...form,

      [key]: value,

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





  const totalQuantity = useMemo(()=>{


    return fertilizers.reduce(

      (sum,item)=>

      sum + Number(item.quantity || 0),

      0

    );


  },[fertilizers]);





  const smartAdvice = useMemo(()=>{


    if(form.category==="كيميائي")

      return "⚠️ يفضل الالتزام بالجرعة وعدم الإفراط.";


    if(form.category==="عضوي")

      return "🌱 السماد العضوي يحسن خصوبة التربة.";


    return "✅ تابع حالة المحصول بعد التسميد.";

  },[form.category]);





  const addFertilizer = ()=>{


    if(
      !form.farm ||
      !form.field ||
      !form.type
    )
    return;



    const newItem = {

      id: Date.now(),

      ...form,


      createdAt:
      new Date().toISOString(),

    };



    setFertilizers([

      ...fertilizers,

      newItem

    ]);



    setForm({

      farm:"",
      field:"",
      crop:"",
      type:"",
      category:"كيميائي",
      quantity:"",
      unit:"كغ",
      method:"تربة",
      stage:"",
      supplier:"",
      cost:"",
      currency:"ل.س",
      date:"",
      notes:"",

    });


  };





  const deleteFertilizer=(id)=>{


    setFertilizers(

      fertilizers.filter(

        item=>item.id!==id

      )

    );

  };





return (

<div>


<h1>
🌾 نظام إدارة الأسمدة الذكي
</h1>



<Card title="إضافة عملية تسميد">



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



<input

placeholder="اسم المحصول"

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
value={form.category}
onChange={e=>
updateForm(
"category",
e.target.value
)
}
>

<option>
عضوي
</option>

<option>
كيميائي
</option>

<option>
ورقي
</option>

<option>
مركب
</option>

</select>



<br/><br/>



<input

placeholder="نوع السماد"

value={form.type}

onChange={e=>
updateForm(
"type",
e.target.value
)
}

/>



<br/><br/>



<input

type="number"

placeholder="الكمية"

value={form.quantity}

onChange={e=>
updateForm(
"quantity",
e.target.value
)
}

/>



<select
value={form.unit}
onChange={e=>
updateForm(
"unit",
e.target.value
)
}
>

<option>
كغ
</option>

<option>
طن
</option>

<option>
لتر
</option>

</select>



<br/><br/>



<select
value={form.method}
onChange={e=>
updateForm(
"method",
e.target.value
)
}
>

<option>
تربة
</option>

<option>
رش
</option>

<option>
مع الري
</option>

</select>



<br/><br/>



<input

placeholder="مرحلة المحصول"

value={form.stage}

onChange={e=>
updateForm(
"stage",
e.target.value
)
}

/>



<br/><br/>



<input

placeholder="المورد"

value={form.supplier}

onChange={e=>
updateForm(
"supplier",
e.target.value
)
}

/>



<br/><br/>



<input

type="number"

placeholder="التكلفة"

value={form.cost}

onChange={e=>
updateForm(
"cost",
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



<textarea

placeholder="ملاحظات"

value={form.notes}

onChange={e=>
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



<Button onClick={addFertilizer}>
حفظ عملية التسميد
</Button>


</Card>





<Card title="📊 إحصائيات الأسمدة">

<p>
عدد العمليات:
{fertilizers.length}
</p>


<p>
إجمالي الكمية:
{totalQuantity}
</p>


</Card>





<Card title="📋 سجل التسميد">


{

fertilizers.map(item=>(

<Card
key={item.id}
title={item.type}
>


<p>
🏡 {item.farm}
</p>

<p>
🌱 {item.field}
</p>

<p>
📦 {item.quantity} {item.unit}
</p>

<p>
🧪 {item.category}
</p>

<p>
🚜 {item.method}
</p>

<p>
💰 {item.cost} {item.currency}
</p>


<Button
onClick={()=>
deleteFertilizer(item.id)
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
