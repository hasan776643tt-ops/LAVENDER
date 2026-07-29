// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useEffect,
  useMemo
} from "react";


// =========================
// Context
// =========================

export const FarmContext =
createContext();



// =========================
// Helpers
// =========================


const createId = () => {

  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {

    return crypto.randomUUID();

  }


  return Date.now().toString();

};




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
}) {



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
  // Optimized Storage Engine
  // =========================


  const storageList = useMemo(()=>({

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





  useEffect(()=>{


    Object.entries(storageList)
    .forEach(([key,value])=>{


      localStorage.setItem(

        key,

        JSON.stringify(value)

      );


    });


  },[storageList]);






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
        new Date()
        .toISOString(),

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






  // =========================
  // Generic CRUD
  // =========================


  const createActions = (setter)=>({

    add:(data)=>
    addRecord(
      setter,
      data
    ),


    update:(id,data)=>
    updateRecord(
      setter,
      id,
      data
    ),


    remove:(id)=>
    deleteRecord(
      setter,
      id
    )

  });






  const farmActions =
  createActions(setFarms);


  const fieldActions =
  createActions(setFields);


  const cropActions =
  createActions(setCrops);






  // =========================
  // Provider
  // =========================


  return (

    <FarmContext.Provider

    value={{

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



      addFarm:
      farmActions.add,

      updateFarm:
      farmActions.update,

      deleteFarm:
      farmActions.remove,



      addField:
      fieldActions.add,

      updateField:
      fieldActions.update,

      deleteField:
      fieldActions.remove,



      addCrop:
      cropActions.add,

      updateCrop:
      cropActions.update,

      deleteCrop:
      cropActions.remove,



      addRecord,

      updateRecord,

      deleteRecord


    }}

    >

      {children}

    </FarmContext.Provider>

  );

}
