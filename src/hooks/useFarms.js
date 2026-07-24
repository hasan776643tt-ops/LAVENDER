import { useState } from "react";

export default function useFarms() {
  const [farms, setFarms] = useState([]);

  return {
    farms,
    setFarms,
  };
}
