// src/pages/Fields.jsx

import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FarmContext
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";



export default function Fields() {


  const {

    farms,

    fields,

    addField,

    updateField,

    deleteField

  } = useContext(FarmContext);




  const initialForm = {

    farmId:"",
    name:"",
    soilType:"",
    area:"",
    crop:"",
    plantingDate:"",
    notes:""

  };



  const [form,setForm] =
    useState(initialForm);



  const [editId,setEditId] =
    useState(null);



  const [search,setSearch] =
    useState("");





  const handleChange = (e)=>{


    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });


  };





  const clearForm = ()=>{


    setForm(initialForm);

    setEditId(null);


  };





  const saveField = ()=>{


    if(
      !form.name ||
      !form.farmId
    )
    return;



    if(editId){


      updateField(
        editId,
        form
      );


    }else{


      addField(form);


    }



    clearForm();


  };







  const editField = (field)=>{


    setForm({

      farmId:
      field.farmId || "",

      name:
      field.name || "",

      soilType:
      field.soilType || "",

      area:
      field.area || "",

      crop:
      field.crop || "",

      plantingDate:
      field.plantingDate || "",

      notes:
      field.notes || ""

    });



    setEditId(
      field.id
    );


  };





  const filteredFields =
  useMemo(()=>{


    return fields.filter(
      field =>

      field.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    );


  },[
    fields,
    search
  ]);







  const getFarmName =
  (farmId)=>{


    const farm =
    farms.find(
      farm =>
      farm.id === farmId
    );


    return farm
    ? farm.name
    : "غير محددة";


  };







return (

<div>


<h1>
📍 إدارة الحقول الذكية
</h1>



<Card

title={
editId
?
"✏️ تعديل الحقل"
:
"➕ إضافة حقل جديد"
}

>




<select

name="farmId"

value={form.farmId}

onChange={handleChange}

>


<option value="">
اختر المزرعة
</option>


{

farms.map(
farm=>(

<option

key={farm.id}

value={farm.id}

>

{farm.name}

</option>

)

)

}


</select>





<input

name="name"

placeholder="اسم الحقل"

value={form.name}

onChange={handleChange}

/>





<input

name="soilType"

placeholder="نوع التربة"

value={form.soilType}

onChange={handleChange}

/>





<input

name="area"

type="number"

placeholder="مساحة الحقل بالدونم"

value={form.area}

onChange={handleChange}

/>





<input

name="crop"

placeholder="المحصول"

value={form.crop}

onChange={handleChange}

/>





<input

name="plantingDate"

type="date"

value={form.plantingDate}

onChange={handleChange}

/>





<textarea

name="notes"

placeholder="ملاحظات"

value={form.notes}

onChange={handleChange}

/>





<Button onClick={saveField}>

{

editId

?

"حفظ التعديل"

:

"إضافة الحقل"

}

</Button>



</Card>







<Card title="🔎 البحث">


<input

placeholder="ابحث عن حقل..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</Card>







<h2>
قائمة الحقول
</h2>





{

filteredFields.map(

field=>(


<Card

key={field.id}

title={
`🌱 ${field.name}`
}

>


<p>
🚜 المزرعة:
{" "}
{getFarmName(field.farmId)}
</p>


<p>
🟤 التربة:
{" "}
{field.soilType}
</p>


<p>
📏 المساحة:
{" "}
{field.area}
دونم
</p>


<p>
🌾 المحصول:
{" "}
{field.crop}
</p>


<p>
📅 تاريخ الزراعة:
{" "}
{field.plantingDate}
</p>


<p>
📝 الملاحظات:
{" "}
{field.notes}
</p>





<Button

onClick={()=>
editField(field)
}

>

تعديل

</Button>





<Button

onClick={()=>
deleteField(field.id)
}

>

حذف

</Button>



</Card>


)

)


}




</div>

);


}
