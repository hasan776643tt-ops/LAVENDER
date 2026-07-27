// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useEffect,
} from "react";


export const FarmContext = createContext();



/* =========================
   Storage Engine
========================= */

const loadData = (key, fallback = []) => {

  try {

    const data =
      localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : fallback;

  } catch {

    return fallback;

  }

};



const saveData = (key, value) => {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

};



/* =========================
   Helpers
========================= */

const createId = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    :
    Date.now().toString();



const addItem = (
  setter,
  data
) => {

  setter(prev => [

    ...prev,

    {
      id:createId(),

      createdAt:
        new Date()
        .toISOString(),

      updatedAt:
        new Date()
        .toISOString(),

      ...data
    }

  ]);

};



const updateItem = (
  setter,
  id,
  data
)=>{

  setter(prev =>

    prev.map(item =>

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



const deleteItem = (
  setter,
  id
)=>{

  setter(prev =>
    prev.filter(
      item =>
      item.id !== id
    )
  );

};




export default function FarmProvider({

 children

}) {



/* =========================
   Main Data Stores
========================= */


const [farms,setFarms] =
useState(()=>loadData("farms"));


const [fields,setFields] =
useState(()=>loadData("fields"));


const [crops,setCrops] =
useState(()=>loadData("crops"));


const [irrigations,setIrrigations] =
useState(()=>loadData("irrigations"));


const [fertilizers,setFertilizers] =
useState(()=>loadData("fertilizers"));


const [pesticides,setPesticides] =
useState(()=>loadData("pesticides"));


const [diseases,setDiseases] =
useState(()=>loadData("diseases"));


const [expenses,setExpenses] =
useState(()=>loadData("expenses"));


const [locations,setLocations] =
useState(()=>loadData("locations"));


const [users,setUsers] =
useState(()=>loadData("users"));


const [consultations,setConsultations] =
useState(()=>loadData("consultations"));


const [aiQuestions,setAiQuestions] =
useState(()=>loadData("aiQuestions"));




/* =========================
   Auto Save
========================= */


useEffect(()=>{

const data = {

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
aiQuestions

};


Object.entries(data)
.forEach(([key,value])=>{

saveData(key,value);

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
aiQuestions
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



const getIrrigationByField =
(fieldId)=>

irrigations.filter(
item =>
item.fieldId === fieldId
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




return (

<FarmContext.Provider

value={{

/* Data */

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


/* CRUD */

addFarm:
(data)=>
addItem(setFarms,data),

updateFarm:
(id,data)=>
updateItem(setFarms,id,data),

deleteFarm:
(id)=>
deleteItem(setFarms,id),



addField:
(data)=>
addItem(setFields,data),

updateField:
(id,data)=>
updateItem(setFields,id,data),

deleteField:
(id)=>
deleteItem(setFields,id),



addCrop:
(data)=>
addItem(setCrops,data),

updateCrop:
(id,data)=>
updateItem(setCrops,id,data),

deleteCrop:
(id)=>
deleteItem(setCrops,id),



addExpense:
(data)=>
addItem(setExpenses,data),


updateExpense:
(id,data)=>
updateItem(setExpenses,id,data),


deleteExpense:
(id)=>
deleteItem(setExpenses,id),



/* Relations */

getFieldsByFarm,

getCropsByField,

getIrrigationByField,

getFertilizersByCrop,

getPesticidesByCrop,

getDiseasesByCrop,

getExpensesByFarm


}}

>

{children}

</FarmContext.Provider>

);

}
