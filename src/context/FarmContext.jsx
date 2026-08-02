// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useMemo
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
  createContext();




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
// Farms
// =========================  // =========================
// Farms
// =========================

const loadFarms = async()=>{

const data =
await farmController.getFarms();

setFarms(data);

};



const addFarm = async(data)=>{

const farm =
await farmController.createFarm(data);

setFarms(prev=>[
...prev,
farm
]);

};



const updateFarm =
async(id,data)=>{

const updated =
await farmController.updateFarm(
id,
data
);

setFarms(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteFarm =
async(id)=>{

await farmController.deleteFarm(id);

setFarms(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};




// =========================
// Fields
// =========================

const loadFields = async()=>{

const data =
await fieldController.getFields();

setFields(data);

};



const addField = async(data)=>{

const field =
await fieldController.createField(data);

setFields(prev=>[
...prev,
field
]);

};



const updateField =
async(id,data)=>{

const updated =
await fieldController.updateField(
id,
data
);

setFields(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteField =
async(id)=>{

await fieldController.deleteField(id);

setFields(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};




// =========================
// Crops
// =========================

const loadCrops = async()=>{

const data =
await cropController.getCrops();

setCrops(data);

};



const addCrop = async(data)=>{

const crop =
await cropController.createCrop(data);

setCrops(prev=>[
...prev,
crop
]);

};



const updateCrop =
async(id,data)=>{

const updated =
await cropController.updateCrop(
id,
data
);

setCrops(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteCrop =
async(id)=>{

await cropController.deleteCrop(id);

setCrops(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};




// =========================
// Inventory
// =========================

const loadInventory = async()=>{

const data =
await inventoryController.getAll();

setInventory(data);

};



const addInventory = async(data)=>{

const item =
await inventoryController.create(data);

setInventory(prev=>[
...prev,
item
]);

};



const updateInventory =
async(id,data)=>{

const updated =
await inventoryController.update(
id,
data
);


setInventory(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteInventory =
async(id)=>{

await inventoryController.delete(id);


setInventory(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};  // =========================
// Irrigation
// =========================

const loadIrrigations = async()=>{

const data =
await irrigationController.getIrrigations();

setIrrigations(data);

};



const addIrrigation = async(data)=>{

const irrigation =
await irrigationController.createIrrigation(data);

setIrrigations(prev=>[
...prev,
irrigation
]);

};



const updateIrrigation =
async(id,data)=>{

const updated =
await irrigationController.updateIrrigation(
id,
data
);

setIrrigations(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteIrrigation =
async(id)=>{

await irrigationController.deleteIrrigation(id);

setIrrigations(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};




// =========================
// Fertilizers
// =========================

const loadFertilizers = async()=>{

const data =
await fertilizerController.getAllFertilizers();

setFertilizers(data);

};



const addFertilizer = async(data)=>{

const fertilizer =
await fertilizerController.createFertilizer(data);

setFertilizers(prev=>[
...prev,
fertilizer
]);

};



const updateFertilizer =
async(id,data)=>{

const updated =
await fertilizerController.updateFertilizer(
id,
data
);

setFertilizers(prev=>

prev.map(item=>

String(item.id)===String(id)

?

updated

:

item

)

);

};



const deleteFertilizer =
async(id)=>{

await fertilizerController.deleteFertilizer(id);

setFertilizers(prev=>

prev.filter(item=>

String(item.id)!==
String(id)

)

);

};




// =========================
// Context Value
// =========================

const value = useMemo(()=>({

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


setExpenses,
setHarvests,
setInventory,

setConsultations,
setAiQuestions,



// Farms

loadFarms,

addFarm,
updateFarm,
deleteFarm,



// Fields

loadFields,

addField,
updateField,
deleteField,



// Crops

loadCrops,

addCrop,
updateCrop,
deleteCrop,



// Inventory

loadInventory,

addInventory,
updateInventory,
deleteInventory,


}),[

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
// Return
// =========================

return (

<FarmContext.Provider
value={value}
>

{children}

</FarmContext.Provider>

);


}
