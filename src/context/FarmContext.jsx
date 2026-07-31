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



  const [farms, setFarms] =
    useState([]);


  const [fields, setFields] =
    useState([]);


  const [crops, setCrops] =
    useState([]);


  const [irrigations, setIrrigations] =
    useState([]);


  const [fertilizers, setFertilizers] =
    useState([]);


  const [pesticides, setPesticides] =
    useState([]);


  const [diseases, setDiseases] =
    useState([]);




  const [expenses, setExpenses] =
    useState([]);


  const [harvests, setHarvests] =
    useState([]);


  const [inventory, setInventory] =
    useState([]);


  const [consultations, setConsultations] =
    useState([]);


  const [aiQuestions, setAiQuestions] =
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

   prev.map(farm=>

    String(farm.id) === String(id)
    ?
    updated
    :
    farm

   )

 );

};



const deleteFarm =
async(id)=>{


 await farmController.deleteFarm(id);


 setFarms(prev=>

  prev.filter(

   farm =>
   String(farm.id)!==String(id)

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

  prev.map(field=>

   String(field.id)===String(id)
   ?
   updated
   :
   field

  )

 );


};




const deleteField =
async(id)=>{


 await fieldController.deleteField(id);


 setFields(prev=>

  prev.filter(

   field =>
   String(field.id)!==String(id)

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

  prev.map(crop=>

   String(crop.id)===String(id)
   ?
   updated
   :
   crop

  )

 );


};




const deleteCrop =
async(id)=>{


 await cropController.deleteCrop(id);


 setCrops(prev=>

  prev.filter(

   crop =>
   String(crop.id)!==String(id)

  )

 );


};









// =========================
// Irrigation
// =========================


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



const deleteIrrigation =
async(id)=>{

 await irrigationController.deleteIrrigation(id);


 setIrrigations(prev=>

  prev.filter(
   item =>
   String(item.id)!==String(id)
  )

 );

};








// =========================
// Fertilizers
// =========================


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




const deleteFertilizer =
async(id)=>{


 await fertilizerController.deleteFertilizer(id);


 setFertilizers(prev=>

  prev.filter(
   item =>
   String(item.id)!==String(id)
  )

 );


};








// =========================
// Pesticides
// =========================


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




const deletePesticide =
async(id)=>{


 await pesticideController.deletePesticide(id);


 setPesticides(prev=>

  prev.filter(
   item =>
   String(item.id)!==String(id)
  )

 );


};








// =========================
// Diseases
// =========================


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




const deleteDisease =
async(id)=>{


 await diseaseController.deleteDisease(id);


 setDiseases(prev=>

  prev.filter(
   item =>
   String(item.id)!==String(id)
  )

 );


};









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


 addIrrigation,
 deleteIrrigation,


 addFertilizer,
 deleteFertilizer,


 addPesticide,
 deletePesticide,


 addDisease,
 deleteDisease



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
