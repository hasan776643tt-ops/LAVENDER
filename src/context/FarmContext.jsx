import { createContext, useState, useEffect } from "react";

export const FarmContext = createContext();

const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`خطأ في قراءة ${key}`, error);
    return [];
  }
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
    localStorage.setItem(
      "farms",
      JSON.stringify(farms)
    );
  }, [farms]);

  useEffect(() => {
    localStorage.setItem(
      "fields",
      JSON.stringify(fields)
    );
  }, [fields]);

  useEffect(() => {
    localStorage.setItem(
      "crops",
      JSON.stringify(crops)
    );
  }, [crops]);

  useEffect(() => {
    localStorage.setItem(
      "irrigations",
      JSON.stringify(irrigations)
    );
  }, [irrigations]);

  useEffect(() => {
    localStorage.setItem(
      "fertilizers",
      JSON.stringify(fertilizers)
    );
  }, [fertilizers]);

  useEffect(() => {
    localStorage.setItem(
      "pesticides",
      JSON.stringify(pesticides)
    );
  }, [pesticides]);

  useEffect(() => {
    localStorage.setItem(
      "diseases",
      JSON.stringify(diseases)
    );
  }, [diseases]);

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      "locations",
      JSON.stringify(locations)
    );
  }, [locations]);

  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );
  }, [users]);

  const resetSystem = () => {

    localStorage.clear();

    setFarms([]);
    setFields([]);
    setCrops([]);
    setIrrigations([]);
    setFertilizers([]);
    setPesticides([]);
    setDiseases([]);
    setExpenses([]);
    setLocations([]);
    setUsers([]);

  };

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

        resetSystem,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}
