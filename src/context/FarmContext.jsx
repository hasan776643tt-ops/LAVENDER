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
useState([]);  // =========================
// Generic Actions
// =========================


const createActions = (
  data,
  setData,
  controller
)=>({

  getAll:
    () => controller.getAll(),

  add:
    (item)=>
    {
      const result =
      controller.create(item);

      setData([
        ...data,
        result
      ]);

      return result;
    },


  update:
    (id,updated)=>
    {
      const result =
      controller.update(
        id,
        updated
      );

      setData(
        data.map(
          item =>
          item.id === id
          ? result
          : item
        )
      );

      return result;
    },


  remove:
    (id)=>
    {
      const result =
      controller.remove(id);

      setData(
        data.filter(
          item =>
          item.id !== id
        )
      );

      return result;
    }

});




// =========================
// Controllers Binding
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


const value = useMemo(
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

  farmsActions:
    farmActions,

  fieldsActions:
    fieldActions,

  cropsActions:
    cropActions,


  irrigationActions,

  fertilizerActions,

  pesticideActions,

  diseaseActions,

  expenseActions,

  harvestActions,

  inventoryActions,


  // Direct setters
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
// Provider Return
// =========================


return (

<FarmContext.Provider
 value={value}
>

{children}

</FarmContext.Provider>

);


}  
