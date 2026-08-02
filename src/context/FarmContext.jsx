// src/context/FarmContext.jsx

import {
  createContext,
  useMemo,
  useState
} from "react";


import farmController
from "../controllers/farmController.js";

import fieldController
from "../controllers/fieldController.js";

import cropController
from "../controllers/cropController.js";


// =========================
// Context
// =========================

export const FarmContext =
createContext(null);



// =========================
// Provider
// =========================

export function FarmProvider({
  children
}) {


const [farms,setFarms] =
useState([]);


const [fields,setFields] =
useState([]);


const [crops,setCrops] =
useState([]);  
// =========================
// Farm Data States
// =========================


const [irrigations,setIrrigations] =
useState([]);


const [fertilizers,setFertilizers] =
useState([]);


const [pesticides,setPesticides] =
useState([]);


const [diseases,setDiseases] =
useState([]);


const [expenses,setExpenses] =
useState([]);


const [harvests,setHarvests] =
useState([]);


const [inventory,setInventory] =
useState([]);


const [consultations,setConsultations] =
useState([]);


const [aiQuestions,setAiQuestions] =
useState([]);



// =========================
// Generic CRUD Handler
// =========================


const createActions =
(
 data,
 setData,
 controller
)=>
({


load:
async ()=>{

 const result =
 await controller.getAll();

 setData(result);

 return result;

},



create:
async (item)=>{

 const result =
 await controller.create(item);


 setData(
 prev=>[
   ...prev,
   result
 ]
 );


 return result;

},



update:
async (
 id,
 updated
)=>{


 const result =
 await controller.update(
   id,
   updated
 );


 setData(
 prev=>
 prev.map(
 item =>
 item.id===id
 ? result
 : item
 )
 );


 return result;

},



remove:
async(id)=>{


 await controller.remove(id);


 setData(
 prev=>
 prev.filter(
 item =>
 item.id!==id
 )
 );


}


});  
// =========================
// Controllers Actions
// =========================


const farmActions =
createActions(
  farms,
  setFarms,
  farmController
);



const fieldActions =
createActions(
  fields,
  setFields,
  fieldController
);



const cropActions =
createActions(
  crops,
  setCrops,
  cropController
);  
// =========================
// More Controllers Actions
// =========================


const irrigationActions =
createActions(
  irrigations,
  setIrrigations,
  irrigationController
);



const fertilizerActions =
createActions(
  fertilizers,
  setFertilizers,
  fertilizerController
);



const pesticideActions =
createActions(
  pesticides,
  setPesticides,
  pesticideController
);



const diseaseActions =
createActions(
  diseases,
  setDiseases,
  diseaseController
);



const expenseActions =
createActions(
  expenses,
  setExpenses,
  expenseController
);



const harvestActions =
createActions(
  harvests,
  setHarvests,
  harvestController
);



const inventoryActions =
createActions(
  inventory,
  setInventory,
  inventoryController
);  
// =========================
// Context Value
// =========================


const value =
useMemo(
()=>({

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


  // Actions

  farmActions,

  fieldActions,

  cropActions,

  irrigationActions,

  fertilizerActions,

  pesticideActions,

  diseaseActions,

  expenseActions,

  harvestActions,

  inventoryActions,


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

  setAiQuestions


}),
[
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
]
);



// =========================
// Provider
// =========================


return (

<FarmContext.Provider
value={value}
>

{children}

</FarmContext.Provider>

);


}
