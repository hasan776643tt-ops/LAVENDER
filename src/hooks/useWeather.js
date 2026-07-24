import { useState } from "react";

export default function useWeather() {
  const [weather, setWeather] = useState(null);

  return {
    weather,
    setWeather,
  };
}
