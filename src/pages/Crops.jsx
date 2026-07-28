// src/pages/Crops.jsx


import {
  useContext,
  useMemo,
  useState
} from "react";


import {
  FarmContext
} from "../context/FarmContext";


import Card from "../components/Card";
import Button from "../components/Button";




export default function Crops(){


const {


farms,

fields,

crops,


addCrop,

updateCrop,

deleteCrop


}=useContext(FarmContext);





// =====================
// Form Model
// =====================


const emptyForm = {


farmId:"",

fieldId:"",

name:"",

variety:"",

plantingDate:"",

harvestDate:"",

seedQuantity:"",

expectedProduction:"",

status:"",

notes:""


};





const [form,setForm]=
useState(emptyForm);



const [editId,setEditId]=
useState(null);



const [search,setSearch]=
useState("");





// =====================
// Change
// =====================


const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:
e.target.value


});


};





// =====================
// Clear
// =====================


const clearForm=()=>{


setForm({

...emptyForm

});


setEditId(null);


};  // =====================
// Save Crop
// =====================


const saveCrop=()=>{


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


addCrop({

...form,

createdAt:
new Date()
.toISOString()

});


}



clearForm();


};





// =====================
// Edit Crop
// =====================


const editCrop=(crop)=>{


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


status:
crop.status || "",


notes:
crop.notes || ""



});


setEditId(
crop.id
);


};





// =====================
// Fields By Farm
// =====================


const farmFields =

useMemo(()=>{


return fields.filter(


field =>

String(field.farmId)

===

String(form.farmId)


);


},[

fields,

form.farmId

]);





// =====================
// Search
// =====================


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





// =====================
// Names
// =====================


const getFarmName=(farmId)=>{


const farm =

farms.find(

item =>

String(item.id)

===

String(farmId)

);



return farm

?

farm.name

:

"غير محددة";


};





const getFieldName=(fieldId)=>{


const field =

fields.find(

item =>

String(item.id)

===

String(fieldId)

);



return field

?

field.name

:

"غير محدد";


};  // =====================
// UI
// =====================


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

"➕ إضافة محصول"

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





<select

name="fieldId"

value={form.fieldId}

onChange={handleChange}

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





<input

type="date"

name="plantingDate"

value={form.plantingDate}

onChange={handleChange}

/>





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





<input

name="status"

placeholder="حالة المحصول"

value={form.status}

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

placeholder="ابحث عن محصول"

value={search}

onChange={e=>

setSearch(e.target.value)

}

/>


</Card>





<h2>
🌾 قائمة المحاصيل
</h2>




{

filteredCrops.map(crop=>(


<Card

key={crop.id}

title={
`🌿 ${crop.name}`
}

>


<p>
🚜 المزرعة:
{getFarmName(crop.farmId)}
</p>


<p>
📍 الحقل:
{getFieldName(crop.fieldId)}
</p>


<p>
🌱 الصنف:
{crop.variety}
</p>


<p>
📅 الزراعة:
{crop.plantingDate}
</p>


<p>
📦 الإنتاج المتوقع:
{crop.expectedProduction}
</p>


<p>
📌 الحالة:
{crop.status}
</p>


<p>
📝 {crop.notes}
</p>





<Button

onClick={()=>editCrop(crop)}

>

تعديل

</Button>





<Button

onClick={()=>deleteCrop(crop.id)}

>

حذف

</Button>



</Card>


))


}



</div>

);


}
