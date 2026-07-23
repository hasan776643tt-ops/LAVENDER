import { useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function useFarm() {

  const farmData = useContext(FarmContext);

  if (!farmData) {
    throw new Error(
      "useFarm يجب استخدامه داخل FarmProvider"
    );
  }

  return farmData;

}
