import { createContext, useState, useEffect } from "react";

export const FarmContext = createContext();

export default function FarmProvider({ children }) {

  const [farms, setFarms] = useState(() => {
    const savedFarms = localStorage.getItem("farms");
    return savedFarms ? JSON.parse(savedFarms) : [];
  });

  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [irrigations, setIrrigations] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [pesticides, setPesticides] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    localStorage.setItem("farms", JSON.stringify(farms));
  }, [farms]);

  return (
    <FarmContext.Provider
      value={{
        farms,
        setFarms,
        fields,
        setFields,
        crops,
        setCrops,
        irrigations,
        setIrrigations,
        fertilizers,
        setFertilizers,
        pesticides,
        setPesticides,
        diseases,
        setDiseases,
        expenses,
        setExpenses,
        locations,
        setLocations,
        users,
        setUsers,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}
