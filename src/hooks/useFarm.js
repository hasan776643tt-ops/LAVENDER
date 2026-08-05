// src/hooks/useFarm.js


import { useContext } from "react";

import { FarmContext } from "../context/FarmContext";



function useFarm() {


  const farmContext =
    useContext(FarmContext);



  if (!farmContext) {

    throw new Error(
      "useFarm must be used within FarmProvider"
    );

  }



  return {

    farms:
      farmContext.farms,

    selectedFarm:
      farmContext.selectedFarm,

    createFarm:
      farmContext.createFarm,

    updateFarm:
      farmContext.updateFarm,

    deleteFarm:
      farmContext.deleteFarm,

    setSelectedFarm:
      farmContext.setSelectedFarm

  };


}



export default useFarm;
