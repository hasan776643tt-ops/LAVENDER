// src/pages/Farms.jsx

import {
  useContext,
  useState,
  useMemo
} from "react";

import {
  FarmContext
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


export default function Farms(){

const {

farms,

addFarm,

updateFarm,

deleteFarm

}=useContext(FarmContext);



const emptyForm = {

name:"",
owner:"",
area:"",
location:"",
latitude:"",
longitude:"",
cropType:"",
irrigationType:"",
plantingDate:"",
notes:""

};



const [form,setForm]=
useState(emptyForm);



const [editId,setEditId]=
useState(null);



const [search,setSearch]=
useState("");





// =====================
// Change Handler
// =====================

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value

});

};





// =====================
// GPS
// =====================

const getCurrentLocation=()=>{


if(!navigator.geolocation){

alert(
"GPS غير مدعوم"
);

return;

}



navigator.geolocation.getCurrentPosition(

(position)=>{


const {

latitude,

longitude

}=position.coords;



setForm(prev=>({

...prev,

latitude,

longitude,

location:
`${latitude}, ${longitude}`

}));



},


()=>{

alert(
"تعذر تحديد الموقع"
);

}

);


};





// =====================
// Reset
// =====================

const clearForm=()=>{

setForm(emptyForm);

setEditId(null);

};





// =====================
// Save
// =====================

const saveFarm=()=>{


if(
!form.name ||
!form.owner
)
return;



if(editId){


updateFarm(

editId,

form

);


}else{


addFarm({

...form,

created:
new Date()
.toISOString()

});


}



clearForm();


};  // =====================
// Edit Farm
// =====================

const editFarm = (farm)=>{


setForm({

name:farm.name || "",

owner:farm.owner || "",

area:farm.area || "",

location:farm.location || "",

latitude:farm.latitude || "",

longitude:farm.longitude || "",

cropType:farm.cropType || "",

irrigationType:
farm.irrigationType || "",

plantingDate:
farm.plantingDate || "",

notes:farm.notes || ""

});


setEditId(
farm.id
);


};





// =====================
// Search
// =====================

const filteredFarms =

useMemo(()=>{


return farms.filter(farm=>


farm.name

?.toLowerCase()

.includes(

search.toLowerCase()

)


);


},[
farms,
search
]);





// =====================
// UI
// =====================


return (

<div>


<h1>
🌱 إدارة المزارع الذكية
</h1>



<Card

title={

editId

?

"✏️ تعديل المزرعة"

:

"➕ إضافة مزرعة"

}

>


<input

name="name"

placeholder="اسم المزرعة"

value={form.name}

onChange={handleChange}

/>



<input

name="owner"

placeholder="اسم المالك"

value={form.owner}

onChange={handleChange}

/>



<input

name="area"

type="number"

placeholder="المساحة بالدونم"

value={form.area}

onChange={handleChange}

/>



<input

name="location"

placeholder="📍 موقع المزرعة"

value={form.location}

readOnly

/>



<Button

onClick={getCurrentLocation}

>

📍 تحديد الموقع

</Button>




<input

name="cropType"

placeholder="🌱 نوع المحصول"

value={form.cropType}

onChange={handleChange}

/>




<input

name="irrigationType"

placeholder="💧 نوع الري"

value={form.irrigationType}

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

onClick={saveFarm}

>

{

editId

?

"حفظ التعديل"

:

"إضافة المزرعة"

}

</Button>


</Card>





<Card

title="🔎 البحث"

>


<input

placeholder="ابحث عن مزرعة"

value={search}

onChange={e=>

setSearch(
e.target.value
)

}

/>


</Card>





<h2>
🚜 قائمة المزارع
</h2>




{

filteredFarms.map(farm=>(


<Card

key={farm.id}

title={
`🚜 ${farm.name}`
}

>


<p>
👤 المالك:
{farm.owner}
</p>


<p>
📏 المساحة:
{farm.area} دونم
</p>



<p>
📍 الموقع:
{farm.location}
</p>



<p>
🌱 المحصول:
{farm.cropType}
</p>



<p>
💧 الري:
{farm.irrigationType}
</p>



<p>
📅 تاريخ الزراعة:
{farm.plantingDate}
</p>



<p>
📝 {farm.notes}
</p>




<Button

onClick={()=>editFarm(farm)}

>

تعديل

</Button>




<Button

onClick={()=>deleteFarm(farm.id)}

>

حذف

</Button>



</Card>


))


}



</div>

);


}
