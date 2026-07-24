import { useState } from "react";

export default function useCrops() {
  const [crops, setCrops] = useState([]);

  return {
    crops,
    setCrops,
  };
}
