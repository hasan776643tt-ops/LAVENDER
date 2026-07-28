// src/pages/Diseases.jsx

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


export default function Diseases() {


  const {

    farms = [],
    fields = [],
    crops = [],

    diseases = [],

    addDisease,
    updateDisease,
    deleteDisease,

  } = useContext(FarmContext);





  const initialForm = {

    farmId:"",

    fieldId:"",

    cropId:"",


    diseaseName:"",

    symptoms:"",

    severity:"متوسطة",


    treatment:"",


    date:"",


    status:"active",


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









  const totalDiseases = useMemo(()=>{


    return diseases.length;


  },[diseases]);









  const activeDiseases = useMemo(()=>{


    return diseases.filter(

      item =>

      item.status === "active"

    ).length;


  },[diseases]);









  const smartAdvice = useMemo(()=>{


    if(
      form.severity === "شديدة"
    )

      return "🚨 إصابة شديدة، يفضل التدخل السريع.";





    if(
      form.severity === "متوسطة"
    )

      return "⚠️ تابع الحالة خلال الأيام القادمة.";





    if(
      form.severity === "خفيفة"
    )

      return "🌱 يمكن المتابعة مع إجراءات وقائية.";





    return "✅ الحالة تحتاج إلى متابعة.";




  },[

    form.severity

  ]);









  const save = ()=>{


    if(

      !form.farmId ||

      !form.fieldId ||

      !form.diseaseName

    )

      return;





    if(editId){


      updateDisease(

        editId,

        form

      );


    }

    else{


      addDisease(

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


      diseaseName:item.diseaseName,

      symptoms:item.symptoms,

      severity:item.severity,


      treatment:item.treatment,


      date:item.date,


      status:item.status,


      priority:item.priority,


      notes:item.notes,


    });



    setEditId(item.id);


  };


return
  (<div>


<h1>
🌿 نظام إدارة الأمراض الذكي
</h1>




<Card

title={
editId
?
"✏️ تعديل حالة مرضية"
:
"➕ إضافة حالة مرضية"
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

placeholder="اسم المرض"

value={form.diseaseName}

onChange={(e)=>

updateForm(
"diseaseName",
e.target.value
)

}

/>





<br/><br/>





<textarea

placeholder="أعراض المرض"

value={form.symptoms}

onChange={(e)=>

updateForm(
"symptoms",
e.target.value
)

}

/>





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
خفيفة
</option>


<option>
متوسطة
</option>


<option>
شديدة
</option>


</select>





<br/><br/>





<input

placeholder="العلاج المستخدم"

value={form.treatment}

onChange={(e)=>

updateForm(
"treatment",
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





<select

value={form.status}

onChange={(e)=>

updateForm(
"status",
e.target.value
)

}

>


<option value="active">
نشطة
</option>


<option value="treated">
تم العلاج
</option>


<option value="monitoring">
تحت المراقبة
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

"إضافة المرض"

}

</Button>



</Card>









<Card title="📊 إحصائيات الأمراض">


<p>
عدد الحالات:
{totalDiseases}
</p>


<p>
الحالات النشطة:
{activeDiseases}
</p>


</Card>









<Card title="📋 سجل الأمراض">


{

diseases.map(item=>(


<Card

key={item.id}

title={item.diseaseName}

>


<p>
🌱 الأعراض:
{item.symptoms}
</p>


<p>
⚠️ الشدة:
{item.severity}
</p>


<p>
💊 العلاج:
{item.treatment}
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
