// src/context/FarmContext.jsx

import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";



export const FarmContext =
  createContext();



/* =========================
   Storage Engine
========================= */


const loadStorage = (
  key,
  defaultValue = []
)=>{

  try {

    const data =
      localStorage.getItem(key);


    return data
      ? JSON.parse(data)
      : defaultValue;


  } catch(error){

    console.error(
      "Storage Error:",
      error
    );

    return defaultValue;

  }

};



const saveStorage = (
  key,
  value
)=>{

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

};




/* =========================
   ID Generator
========================= */


const createId = ()=>{

  if(
    window.crypto &&
    crypto.randomUUID
  ){

    return crypto.randomUUID();

  }


  return Date.now()
  .toString();

};




/* =========================
   CRUD Engine
========================= */


const createRecord = (
 data
)=>{

 return {

  id:createId(),

  createdAt:
  new Date()
  .toISOString(),

  updatedAt:
  new Date()
  .toISOString(),

  ...data

 };

};



const addRecord = (
 setter,
 data
)=>{

 setter(prev=>[
  ...prev,
  createRecord(data)
 ]);

};



const updateRecord = (
 setter,
 id,
 data
)=>{

 setter(prev=>

  prev.map(item=>

   item.id === id

   ?

   {

    ...item,
    ...data,

    updatedAt:
    new Date()
    .toISOString()

   }

   :

   item

  )

 );

};



const deleteRecord = (
 setter,
 id
)=>{

 setter(prev=>

  prev.filter(
   item =>
   item.id !== id
  )

 );

};






/* =========================
   Provider
========================= */


export default function FarmProvider({
 children
}){



/* =========================
   Main Data
========================= */


const [farms,setFarms] =
useState(()=>loadStorage("farms"));



const [fields,setFields] =
useState(()=>loadStorage("fields"));



const [crops,setCrops] =
useState(()=>loadStorage("crops"));



const [irrigations,setIrrigations] =
useState(()=>loadStorage("irrigations"));



const [fertilizers,setFertilizers] =
useState(()=>loadStorage("fertilizers"));



const [pesticides,setPesticides] =
useState(()=>loadStorage("pesticides"));



const [diseases,setDiseases] =
useState(()=>loadStorage("diseases"));



const [expenses,setExpenses] =
useState(()=>loadStorage("expenses"));



const [locations,setLocations] =
useState(()=>loadStorage("locations"));



const [users,setUsers] =
useState(()=>loadStorage("users"));



const [consultations,setConsultations] =
useState(()=>loadStorage("consultations"));



const [aiQuestions,setAiQuestions] =
useState(()=>loadStorage("aiQuestions"));



const [settings,setSettings] =
useState(()=>

loadStorage(
"settings",
{
 theme:"light",
 language:"ar",
 currency:"SYP",
 notifications:true
}

)

);






/* =========================
   Auto Save
========================= */


useEffect(()=>{


const database={

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
locations,
users,
consultations,
aiQuestions,
settings

};



Object.entries(database)
.forEach(([key,value])=>{

saveStorage(
key,
value
);

});


},[

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
locations,
users,
consultations,
aiQuestions,
settings

]);







/* =========================
   Smart Relations
========================= */


const getFieldsByFarm =
(farmId)=>

fields.filter(
field =>
field.farmId === farmId
);



const getCropsByField =
(fieldId)=>

crops.filter(
crop =>
crop.fieldId === fieldId
);



const getIrrigationByCrop =
(cropId)=>

irrigations.filter(
item =>
item.cropId === cropId
);



const getFertilizersByCrop =
(cropId)=>

fertilizers.filter(
item =>
item.cropId === cropId
);



const getPesticidesByCrop =
(cropId)=>

pesticides.filter(
item =>
item.cropId === cropId
);



const getDiseasesByCrop =
(cropId)=>

diseases.filter(
item =>
item.cropId === cropId
);



const getExpensesByFarm =
(farmId)=>

expenses.filter(
item =>
item.farmId === farmId
);






/* =========================
   Dashboard Analytics
========================= */


const statistics = useMemo(()=>({

farms:
farms.length,

fields:
fields.length,

crops:
crops.length,

irrigations:
irrigations.length,

fertilizers:
fertilizers.length,

pesticides:
pesticides.length,

diseases:
diseases.length,

expenses:
expenses.length,

users:
users.length


}),[

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
users

]);







return (

<FarmContext.Provider

value={{

/* DATA */

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
locations,
users,
consultations,
aiQuestions,
settings,



/* SETTERS */

setFarms,
setFields,
setCrops,
setIrrigations,
setFertilizers,
setPesticides,
setDiseases,
setExpenses,
setLocations,
setUsers,
setConsultations,
setAiQuestions,
setSettings,



/* FARM CRUD */

addFarm:
(data)=>
addRecord(
setFarms,
data
),


updateFarm:
(id,data)=>
updateRecord(
setFarms,
id,
data
),


deleteFarm:
(id)=>
deleteRecord(
setFarms,
id
),




/* FIELD CRUD */

addField:
(data)=>
addRecord(
setFields,
data
),


updateField:
(id,data)=>
updateRecord(
setFields,
id,
data
),


deleteField:
(id)=>
deleteRecord(
setFields,
id
),




/* CROP CRUD */


addCrop:
(data)=>
addRecord(
setCrops,
data
),


updateCrop:
(id,data)=>
updateRecord(
setCrops,
id,
data
),


deleteCrop:
(id)=>
deleteRecord(
setCrops,
id
),




/* OTHER CRUD */


addIrrigation:
(data)=>
addRecord(
setIrrigations,
data
),


addFertilizer:
(data)=>
addRecord(
setFertilizers,
data
),


addPesticide:
(data)=>
addRecord(
setPesticides,
data
),


addDisease:
(data)=>
addRecord(
setDiseases,
data
),


addExpense:
(data)=>
addRecord(
setExpenses,
data
),



deleteExpense:
(id)=>
deleteRecord(
setExpenses,
id
),




/* RELATIONS */


getFieldsByFarm,

getCropsByField,

getIrrigationByCrop,

getFertilizersByCrop,

getPesticidesByCrop,

getDiseasesByCrop,

getExpensesByFarm,




/* DASHBOARD */


statistics



}}

>

{children}

</FarmContext.Provider>


);

}
