import { createContext, useState, useEffect } from "react";

export const FarmContext = createContext();

const getStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export default function FarmProvider({ children }) {

  const [farms, setFarms] = useState(() =>
    getStorageData("farms")
  );

  const [fields, setFields] = useState(() =>
    getStorageData("fields")
  );

  const [crops, setCrops] = useState(() =>
    getStorageData("crops")
  );

  const [irrigations, setIrrigations] = useState(() =>
    getStorageData("irrigations")
  );

  const [fertilizers, setFertilizers] = useState(() =>
    getStorageData("fertilizers")
  );

  const [pesticides, setPesticides] = useState(() =>
    getStorageData("pesticides")
  );

  const [diseases, setDiseases] = useState(() =>
    getStorageData("diseases")
  );

  const [expenses, setExpenses] = useState(() =>
    getStorageData("expenses")
  );

  const [locations, setLocations] = useState(() =>
    getStorageData("locations")
  );

  const [users, setUsers] = useState(() =>
    getStorageData("users")
  );

  useEffect(() => {
    localStorage.setItem("farms", JSON.stringify(farms));
    localStorage.setItem("fields", JSON.stringify(fields));
    localStorage.setItem("crops", JSON.stringify(crops));
    localStorage.setItem("irrigations", JSON.stringify(irrigations));
    localStorage.setItem("fertilizers", JSON.stringify(fertilizers));
    localStorage.setItem("pesticides", JSON.stringify(pesticides));
    localStorage.setItem("diseases", JSON.stringify(diseases));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("locations", JSON.stringify(locations));
    localStorage.setItem("users", JSON.stringify(users));
  }, [
    farms,
    fields,
    crops,
    irrigations,
    fertilizers,
    pesticides,
    diseases,
    expenses,
    locations,
    users,
  ]);

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
