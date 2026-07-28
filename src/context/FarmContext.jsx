// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useEffect
} from "react";


// =========================
// Context
// =========================

export const FarmContext =
createContext();



// =========================
// Helpers
// =========================


const createId = () =>
Date.now();



const loadData = (key)=>{

const saved =
localStorage.getItem(key);


return saved
?
JSON.parse(saved)
:
[];

};





// =========================
// Provider
// =========================


export function FarmProvider({
children
}){



// =========================
// Main Data
// =========================


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


const [harvests,setHarvests] =
useState(()=>loadData("harvests"));


const [inventory,setInventory] =
useState(()=>loadData("inventory"));


const [consultations,setConsultations] =
useState(()=>loadData("consultations"));


const [aiQuestions,setAiQuestions] =
useState(()=>loadData("aiQuestions"));




// =========================
// Auto Save Engine
// =========================


const storageList = {

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
harvests,
inventory,
consultations,
aiQuestions

};



useEffect(()=>{


Object.entries(storageList)
.forEach(([key,value])=>{


localStorage.setItem(
key,
JSON.stringify(value)
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
harvests,
inventory,
consultations,
aiQuestions
]);





// =========================
// CRUD ENGINE
// =========================


const addRecord = (
setter,
data
)=>{


setter(prev=>[

...prev,

{
id:createId(),
createdAt:
new Date().toISOString(),

...data

}

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
new Date().toISOString()
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


};  // =========================
// FARMS CRUD
// =========================

const addFarm = (data)=>
addRecord(
setFarms,
data
);


const updateFarm = (
id,
data
)=>
updateRecord(
setFarms,
id,
data
);


const deleteFarm = (id)=>
deleteRecord(
setFarms,
id
);





// =========================
// FIELDS CRUD
// =========================

const addField = (data)=>
addRecord(
setFields,
data
);


const updateField = (
id,
data
)=>
updateRecord(
setFields,
id,
data
);


const deleteField = (id)=>
deleteRecord(
setFields,
id
);





// =========================
// CROPS CRUD
// =========================

const addCrop = (data)=>
addRecord(
setCrops,
data
);


const updateCrop = (
id,
data
)=>
updateRecord(
setCrops,
id,
data
);


const deleteCrop = (id)=>
deleteRecord(
setCrops,
id
);





// =========================
// IRRIGATION CRUD
// =========================

const addIrrigation = (data)=>
addRecord(
setIrrigations,
data
);


const updateIrrigation = (
id,
data
)=>
updateRecord(
setIrrigations,
id,
data
);


const deleteIrrigation = (id)=>
deleteRecord(
setIrrigations,
id
);





// =========================
// FERTILIZERS CRUD
// =========================

const addFertilizer = (data)=>
addRecord(
setFertilizers,
data
);


const updateFertilizer = (
id,
data
)=>
updateRecord(
setFertilizers,
id,
data
);


const deleteFertilizer = (id)=>
deleteRecord(
setFertilizers,
id
);





// =========================
// PESTICIDES CRUD
// =========================

const addPesticide = (data)=>
addRecord(
setPesticides,
data
);


const updatePesticide = (
id,
data
)=>
updateRecord(
setPesticides,
id,
data
);


const deletePesticide = (id)=>
deleteRecord(
setPesticides,
id
);





// =========================
// DISEASES CRUD
// =========================

const addDisease = (data)=>
addRecord(
setDiseases,
data
);


const updateDisease = (
id,
data
)=>
updateRecord(
setDiseases,
id,
data
);


const deleteDisease = (id)=>
deleteRecord(
setDiseases,
id
);





// =========================
// EXPENSES CRUD
// =========================

const addExpense = (data)=>
addRecord(
setExpenses,
data
);


const updateExpense = (
id,
data
)=>
updateRecord(
setExpenses,
id,
data
);


const deleteExpense = (id)=>
deleteRecord(
setExpenses,
id
);





// =========================
// CONSULTATIONS CRUD
// =========================

const addConsultation = (data)=>
addRecord(
setConsultations,
data
);


const updateConsultation = (
id,
data
)=>
updateRecord(
setConsultations,
id,
data
);


const deleteConsultation = (id)=>
deleteRecord(
setConsultations,
id
);





// =========================
// AI QUESTIONS CRUD
// =========================

const addAiQuestion = (data)=>
addRecord(
setAiQuestions,
data
);


const deleteAiQuestion = (id)=>
deleteRecord(
setAiQuestions,
id
);





// =========================
// PROVIDER EXPORT
// =========================


return (

<FarmContext.Provider

value={{

// Data

farms,
fields,
crops,
irrigations,
fertilizers,
pesticides,
diseases,
expenses,
harvests,
inventory,
consultations,
aiQuestions,



// Setters

setFarms,
setFields,
setCrops,
setIrrigations,
setFertilizers,
setPesticides,
setDiseases,
setExpenses,
setHarvests,
setInventory,
setConsultations,
setAiQuestions,



// Farms

addFarm,
updateFarm,
deleteFarm,



// Fields

addField,
updateField,
deleteField,



// Crops

addCrop,
updateCrop,
deleteCrop,



// Irrigation

addIrrigation,
updateIrrigation,
deleteIrrigation,



// Fertilizers

addFertilizer,
updateFertilizer,
deleteFertilizer,



// Pesticides

addPesticide,
updatePesticide,
deletePesticide,



// Diseases

addDisease,
updateDisease,
deleteDisease,



// Expenses

addExpense,
updateExpense,
deleteExpense,



// Consultations

addConsultation,
updateConsultation,
deleteConsultation,



// AI

addAiQuestion,
deleteAiQuestion,



// Engine

addRecord,
updateRecord,
deleteRecord


}}


>

{children}

</FarmContext.Provider>


);

}
