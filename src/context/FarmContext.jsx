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

import irrigationController
  from "../controllers/irrigationController.js";

import fertilizerController
  from "../controllers/fertilizerController.js";

import pesticideController
  from "../controllers/pesticideController.js";

import diseaseController
  from "../controllers/diseaseController.js";

import expenseController
  from "../controllers/expenseController.js";

import harvestController
  from "../controllers/harvestController.js";

import inventoryController
  from "../controllers/inventoryController.js";


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
// Generic CRUD Actions
// =========================

const createActions =
(
 setData,
 controller
)=>
({


load:
async()=>{

 const result =
 await controller.getAll();

 setData(result);

 return result;

},



create:
async(data)=>{

 const result =
 await controller.create(data);


 setData(
 prev=>[
  ...prev,
  result
 ]
 );


 return result;

},



update:
async(id,data)=>{

 const result =
 await controller.update(
  id,
  data
 );


 setData(
 prev=>
 prev.map(
 item=>
 item.id===id
 ? result
 : item
 )
 );


 return result;

},



delete:
async(id)=>{

 const result =
 await controller.delete(id);


 setData(
 prev=>
 prev.filter(
 item=>
 item.id!==id
 )
 );


 return result;

},



count:
async()=>{

 return controller.count();

},



exists:
async(id)=>{

 return controller.exists(id);

}


});



// =========================
// Actions
// =========================


const farmActions =
createActions(
 setFarms,
 farmController
);


const fieldActions =
createActions(
 setFields,
 fieldController
);


const cropActions =
createActions(
 setCrops,
 cropController
);


const irrigationActions =
createActions(
 setIrrigations,
 irrigationController
);


const fertilizerActions =
createActions(
 setFertilizers,
 fertilizerController
);


const pesticideActions =
createActions(
 setPesticides,
 pesticideController
);


const diseaseActions =
createActions(
 setDiseases,
 diseaseController
);


const expenseActions =
createActions(
 setExpenses,
 expenseController
);


const harvestActions =
createActions(
 setHarvests,
 harvestController
);


const inventoryActions =
createActions(
 setInventory,
 inventoryController
);



// =========================
// Context Value
// =========================


const value =
useMemo(
()=>({


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
