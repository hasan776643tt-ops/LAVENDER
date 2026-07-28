// src/pages/Fields.jsx

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



export default function Fields(){


const {

farms,

fields,

addField,

updateField,

deleteField

}=useContext(FarmContext);




// =====================
// Form
// =====================


const emptyForm={

farmId:"",

name:"",

soilType:"",

area:"",

crop:"",

plantingDate:"",

notes:""

};



const [form,setForm]=
useState(emptyForm);



const [editId,setEditId]=
useState(null);



const [search,setSearch]=
useState("");



const [farmFilter,setFarmFilter]=
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
// Save Field
// =====================


const saveField=()=>{


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


addField({

...form,

createdAt:
new Date()
.toISOString()

});


}



clearForm();


};





// =====================
// Edit Field
// =====================


const editField=(field)=>{


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





// =====================
// Farm Name
// =====================


const getFarmName=(farmId)=>{


const farm =

farms.find(

item =>
item.id === farmId

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

field.farmId ===

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
