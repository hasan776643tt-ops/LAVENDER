// src/pages/Fields.jsx

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


export default function Fields(){

const {

farms,
fields,
fieldActions

}=useContext(FarmContext);



const emptyForm = {

farmId:"",
name:"",
soilType:"",
area:"",
crop:"",
plantingDate:"",
notes:""

};



const [form,setForm] =
useState(emptyForm);


const [editId,setEditId] =
useState(null);


const [search,setSearch] =
useState("");


const [farmFilter,setFarmFilter] =
useState("");



// =====================
// Input Change
// =====================

const handleChange = (e)=>{

setForm({

...form,

[e.target.name]:
e.target.value

});

};



// =====================
// Reset
// =====================

const clearForm = ()=>{

setForm(emptyForm);

setEditId(null);

};



// =====================
// Save
// =====================

const saveField = ()=>{


if(
!form.name ||
!form.farmId
)
return;



const fieldData = {

...form,

area:Number(form.area),

updatedAt:
new Date().toISOString()

};



if(editId){

fieldActions.update(

editId,

fieldData

);


}else{


fieldActions.create({

...fieldData,

createdAt:
new Date().toISOString()

});


}



clearForm();


};



// =====================
// Edit
// =====================

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


setEditId(field.id);


};



// =====================
// Farm Name
// =====================

const getFarmName = (farmId)=>{


const farm =
farms.find(

item =>
item.id === Number(farmId)

);



return farm
?
farm.name
:
"غير محددة";


};



// =====================
// Filter
// =====================

const filteredFields =

useMemo(()=>{


return fields.filter(field=>{


const searchMatch =

field.name
?.toLowerCase()
.includes(
search.toLowerCase()
);



const farmMatch =

farmFilter

?

Number(field.farmId) ===
Number(farmFilter)

:

true;



return searchMatch && farmMatch;


});


},[
fields,
search,
farmFilter
]);



// =====================
// UI
// =====================

return (

<div>


<h1>
🌱 إدارة الحقول الذكية
</h1>



<Card

title={
editId
?
"✏️ تعديل الحقل"
:
"➕ إضافة حقل"
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

placeholder="مساحة الحقل"

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



<Button

onClick={saveField}

>

{

editId
?
"حفظ التعديل"
:
"إضافة الحقل"

}

</Button>


</Card>





<Card

title="🔎 البحث والفلترة"

>


<input

placeholder="بحث عن حقل"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>



<select

value={farmFilter}

onChange={
e=>setFarmFilter(e.target.value)
}

>

<option value="">

كل المزارع

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


</Card>





<h2>
📋 قائمة الحقول
</h2>



{

filteredFields.map(field=>(


<Card

key={field.id}

title={
`🌱 ${field.name}`
}

>


<p>
🚜 المزرعة:
{getFarmName(field.farmId)}
</p>


<p>
🌍 التربة:
{field.soilType}
</p>


<p>
📏 المساحة:
{field.area} دونم
</p>


<p>
🌾 المحصول:
{field.crop}
</p>


<p>
📅 الزراعة:
{field.plantingDate}
</p>


<p>
📝 {field.notes || "لا يوجد"}
</p>



<Button

onClick={()=>editField(field)}

>

تعديل

</Button>



<Button

onClick={()=>
fieldActions.delete(field.id)
}

>

حذف

</Button>


</Card>


))


}



</div>

);

}
