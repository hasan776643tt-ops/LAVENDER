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
// =========================


const loadFarms = async()=>{

  const data =
    await farmController.getFarms();

  setFarms(data);

};



const addFarm = async(data)=>{

  const farm =
    await farmController.createFarm(
      data
    );


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

   String(item.id) === String(id)
   ?
   updated
   :
   item

  )

 );


};



const deleteFarm =
async(id)=>{


 await farmController.deleteFarm(
   id
 );


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
   await fieldController.createField(
     data
   );


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


 await fieldController.deleteField(
   id
 );


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
   await cropController.createCrop(
     data
   );


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


 await cropController.deleteCrop(
   id
 );


 setCrops(prev=>

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
   await irrigationController.createIrrigation(
     data
   );


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


 await irrigationController.deleteIrrigation(
   id
 );


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
   await fertilizerController.createFertilizer(
     data
   );


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


 await fertilizerController.deleteFertilizer(
   id
 );


 setFertilizers(prev=>

  prev.filter(item=>

   String(item.id)!==
   String(id)

  )

 );


};








// =========================
// Pesticides
// =========================


const loadPesticides = async()=>{


 const data =
   await pesticideController.getPesticides();


 setPesticides(data);


};




const addPesticide = async(data)=>{


 const pesticide =
   await pesticideController.createPesticide(
     data
   );


 setPesticides(prev=>[
   ...prev,
   pesticide
 ]);

};




const updatePesticide =
async(id,data)=>{


 const updated =
   await pesticideController.updatePesticide(
     id,
     data
   );


 setPesticides(prev=>

  prev.map(item=>

   String(item.id)===String(id)
   ?
   updated
   :
   item

  )

 );


};




const deletePesticide =
async(id)=>{


 await pesticideController.deletePesticide(
   id
 );


 setPesticides(prev=>

  prev.filter(item=>

   String(item.id)!==
   String(id)

  )

 );


};








// =========================
// Diseases
// =========================


const loadDiseases = async()=>{


 const data =
   await diseaseController.getDiseases();


 setDiseases(data);


};




const addDisease = async(data)=>{


 const disease =
   await diseaseController.createDisease(
     data
   );


 setDiseases(prev=>[
   ...prev,
   disease
 ]);

};




const updateDisease =
async(id,data)=>{


 const updated =
   await diseaseController.updateDisease(
     id,
     data
   );


 setDiseases(prev=>

  prev.map(item=>

   String(item.id)===String(id)
   ?
   updated
   :
   item

  )

 );


};




const deleteDisease =
async(id)=>{


 await diseaseController.deleteDisease(
   id
 );


 setDiseases(prev=>

  prev.filter(item=>

   String(item.id)!==
   String(id)

  )

 );


};








// =========================
// Expenses
// =========================


const loadExpenses = async()=>{


 const data =
   await expenseController.getExpenses();


 setExpenses(data);


};




const addExpense = async(data)=>{


 const expense =
   await expenseController.createExpense(
     data
   );


 setExpenses(prev=>[

   ...prev,

   expense

 ]);


};




const updateExpense =
async(id,data)=>{


 const updated =
   await expenseController.updateExpense(
     id,
     data
   );


 setExpenses(prev=>

  prev.map(item=>

   String(item.id)===String(id)

   ?

   updated

   :

   item

  )

 );


};




const deleteExpense =
async(id)=>{


 await expenseController.deleteExpense(
   id
 );


 setExpenses(prev=>

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



 loadFarms,

 addFarm,
 updateFarm,
 deleteFarm,


 loadFields,

 addField,
 updateField,
 deleteField,



 loadCrops,

 addCrop,
 updateCrop,
 deleteCrop,



 loadIrrigations,

 addIrrigation,
 updateIrrigation,
 deleteIrrigation,



 loadFertilizers,

 addFertilizer,
 updateFertilizer,
 deleteFertilizer,



 loadPesticides,

 addPesticide,
 updatePesticide,
 deletePesticide,



 loadDiseases,

 addDisease,
 updateDisease,
 deleteDisease,



 loadExpenses,

 addExpense,
 updateExpense,
 deleteExpense



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







return (

<FarmContext.Provider
 value={value}
>

{children}

</FarmContext.Provider>

);


}
