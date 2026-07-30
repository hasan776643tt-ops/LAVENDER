// src/context/FarmContext.jsx

import {
  createContext,
  useState,
  useMemo
} from "react";

import farmController
  from "../controllers/farmController.js";


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
  // Farm Actions
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

        prev.map(farm=>

          farm.id === id
          ?
          updated
          :
          farm

        )

      );


    };





  const deleteFarm =
    async(id)=>{


      await farmController.deleteFarm(
        id
      );


      setFarms(prev=>

        prev.filter(
          farm =>
          farm.id !== id
        )

      );


    };







  // =========================
  // Generic Actions
  // =========================


  const createActions =
    (setter)=>(()=>({



    }));





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



    loadFarms,

    addFarm,

    updateFarm,

    deleteFarm


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
