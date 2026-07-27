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


export default function Crops() {


  const {

    farms,
    fields,
    crops,

    addCrop,
    updateCrop,
    deleteCrop

  } = useContext(FarmContext);



  const initialForm = {

    farmId:"",
    fieldId:"",
    name:"",
    variety:"",
    plantingDate:"",
    harvestDate:"",
    seedQuantity:"",
    expectedProduction:"",
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






  const saveCrop = ()=>{


    if(
      !form.name ||
      !form.fieldId
    )
    return;



    if(editId){


      updateCrop(
        editId,
        form
      );


    }else{


      addCrop(form);


    }



    clearForm();


  };






  const editCrop = (crop)=>{


    setForm({

      farmId:
      crop.farmId || "",

      fieldId:
      crop.fieldId || "",

      name:
      crop.name || "",

      variety:
      crop.variety || "",

      plantingDate:
      crop.plantingDate || "",

      harvestDate:
      crop.harvestDate || "",

      seedQuantity:
      crop.seedQuantity || "",

      expectedProduction:
      crop.expectedProduction || "",

      notes:
      crop.notes || ""

    });


    setEditId(crop.id);


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






  const filteredCrops =
  useMemo(()=>{


    return crops.filter(

      crop =>

      crop.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    );


  },[
    crops,
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





  const getFieldName =
  (fieldId)=>{


    const field =
    fields.find(
      field =>
      field.id === fieldId
    );


    return field
    ? field.name
    : "غير محدد";


  };







return (

<div>


<h1>
🌱 إدارة المحاصيل الذكية
</h1>



<Card

title={
editId
?
"✏️ تعديل محصول"
:
"➕ إضافة محصول جديد"
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





<select

name="fieldId"

value={form.fieldId}

onChange={handleChange}

>

<option value="">
اختر الحقل
</option>


{

farmFields.map(

field=>(

<option

key={field.id}

value={field.id}

>

{field.name}

</option>

)

)

}


</select>






<input

name="name"

placeholder="اسم المحصول"

value={form.name}

onChange={handleChange}

/>






<input

name="variety"

placeholder="الصنف"

value={form.variety}

onChange={handleChange}

/>






<label>
تاريخ الزراعة
</label>


<input

type="date"

name="plantingDate"

value={form.plantingDate}

onChange={handleChange}

/>






<label>
تاريخ الحصاد المتوقع
</label>


<input

type="date"

name="harvestDate"

value={form.harvestDate}

onChange={handleChange}

/>






<input

type="number"

name="seedQuantity"

placeholder="كمية البذور"

value={form.seedQuantity}

onChange={handleChange}

/>






<input

type="number"

name="expectedProduction"

placeholder="الإنتاج المتوقع"

value={form.expectedProduction}

onChange={handleChange}

/>






<textarea

name="notes"

placeholder="ملاحظات"

value={form.notes}

onChange={handleChange}

/>






<Button onClick={saveCrop}>

{

editId

?

"حفظ التعديل"

:

"إضافة المحصول"

}

</Button>



</Card>







<Card title="🔎 البحث">


<input

placeholder="بحث عن محصول..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</Card>








<h2>
قائمة المحاصيل
</h2>





{

filteredCrops.map(

crop=>(


<Card

key={crop.id}

title={
`🌿 ${crop.name}`
}

>


<p>
🚜 المزرعة:
{" "}
{getFarmName(crop.farmId)}
</p>


<p>
📍 الحقل:
{" "}
{getFieldName(crop.fieldId)}
</p>


<p>
🌱 الصنف:
{" "}
{crop.variety}
</p>


<p>
📅 الزراعة:
{" "}
{crop.plantingDate}
</p>


<p>
📦 الإنتاج المتوقع:
{" "}
{crop.expectedProduction}
</p>


<p>
📝 ملاحظات:
{" "}
{crop.notes}
</p>





<Button

onClick={()=>
editCrop(crop)
}

>

تعديل

</Button>





<Button

onClick={()=>
deleteCrop(crop.id)
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
