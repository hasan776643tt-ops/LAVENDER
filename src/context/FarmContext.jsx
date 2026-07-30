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
  // Farms Actions
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


      await farmController.deleteFarm(id);


      setFarms(prev=>

        prev.filter(
          farm =>
          farm.id !== id
        )

      );


    };






  // =========================
  // Fields Actions
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

          field.id === id
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
          field.id !== id
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
    deleteFarm,



    loadFields,

    addField,
    updateField,
    deleteField


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
