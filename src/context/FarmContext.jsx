// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useEffect,
} from "react";


// =========================
// Context
// =========================

export const FarmContext =
  createContext();



// =========================
// Helper Functions
// =========================

const createId = () =>
  Date.now();



const loadData = (key) => {

  const data =
    localStorage.getItem(key);

  return data
    ? JSON.parse(data)
    : [];

};




// =========================
// Provider
// =========================

export function FarmProvider({ children }) {


const [farms,setFarms] =
useState(() => loadData("farms"));


const [fields,setFields] =
useState(() => loadData("fields"));


const [crops,setCrops] =
useState(() => loadData("crops"));



const [irrigations,setIrrigations] =
useState(() => loadData("irrigations"));


const [fertilizers,setFertilizers] =
useState(() => loadData("fertilizers"));


const [pesticides,setPesticides] =
useState(() => loadData("pesticides"));


const [diseases,setDiseases] =
useState(() => loadData("diseases"));



const [expenses,setExpenses] =
useState(() => loadData("expenses"));



const [harvests,setHarvests] =
useState(() => loadData("harvests"));



const [inventory,setInventory] =
useState(() => loadData("inventory"));



const [consultations,setConsultations] =
useState(() => loadData("consultations"));


const [aiQuestions,setAiQuestions] =
useState(() => loadData("aiQuestions"));





// =========================
// Save LocalStorage
// =========================


useEffect(()=>{


localStorage.setItem(
"farms",
JSON.stringify(farms)
);


},[farms]);



useEffect(()=>{

localStorage.setItem(
"fields",
JSON.stringify(fields)
);

},[fields]);



useEffect(()=>{

localStorage.setItem(
"crops",
JSON.stringify(crops)
);

},[crops]);



useEffect(()=>{

localStorage.setItem(
"irrigations",
JSON.stringify(irrigations)
);

},[irrigations]);



useEffect(()=>{

localStorage.setItem(
"fertilizers",
JSON.stringify(fertilizers)
);

},[fertilizers]);



useEffect(()=>{

localStorage.setItem(
"pesticides",
JSON.stringify(pesticides)
);

},[pesticides]);



useEffect(()=>{

localStorage.setItem(
"diseases",
JSON.stringify(diseases)
);

},[diseases]);



useEffect(()=>{

localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);

},[expenses]);



useEffect(()=>{

localStorage.setItem(
"harvests",
JSON.stringify(harvests)
);

},[harvests]);



useEffect(()=>{

localStorage.setItem(
"inventory",
JSON.stringify(inventory)
);

},[inventory]);




// =========================
// CRUD Engine
// =========================


const addRecord =
(setter,data)=>{


setter(prev => [

...prev,

{
id:createId(),
...data
}

]);


};



const updateRecord =
(setter,id,data)=>{


setter(prev =>

prev.map(item =>

item.id === id

?
{
...item,
...data
}

:
item

)

);


};



const deleteRecord =
(setter,id)=>{


setter(prev =>

prev.filter(
item =>
item.id !== id
)

);


};




// =========================
// CRUD EXPORTS
// =========================


const addHarvest =
(data)=>
addRecord(
setHarvests,
data
);



const updateHarvest =
(id,data)=>
updateRecord(
setHarvests,
id,
data
);



const deleteHarvest =
(id)=>
deleteRecord(
setHarvests,
id
);



const addInventory =
(data)=>
addRecord(
setInventory,
data
);



const updateInventory =
(id,data)=>
updateRecord(
setInventory,
id,
data
);



const deleteInventory =
(id)=>
deleteRecord(
setInventory,
id
);





return (

<FarmContext.Provider

value={{

farms,
setFarms,

fields,
setFields,

crops,
setCrops,

irrigations,
setIrrigations,

fertilizers,
setFertilizers,

pesticides,
setPesticides,

diseases,
setDiseases,

expenses,
setExpenses,

harvests,
setHarvests,

inventory,
setInventory,

consultations,
setConsultations,

aiQuestions,
setAiQuestions,


addHarvest,
updateHarvest,
deleteHarvest,


addInventory,
updateInventory,
deleteInventory,


addRecord,
updateRecord,
deleteRecord,

}}

>


{children}


</FarmContext.Provider>

);


}
