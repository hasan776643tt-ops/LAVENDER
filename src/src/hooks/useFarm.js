import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";


export default function useFarm() {

  const context = useContext(FarmContext);


  if (!context) {

    throw new Error(
      "useFarm يجب استخدامه داخل FarmProvider"
    );

  }


  return context;

}
