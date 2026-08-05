// src/hooks/useFarm.js


import {
  useContext
} from "react";


import {
  FarmContext
} from "../context/FarmContext.js";



export default function useFarm() {


  const context =
    useContext(FarmContext);



  if (!context) {

    throw new Error(
      "useFarm must be used within FarmProvider"
    );

  }



  return context;


}
