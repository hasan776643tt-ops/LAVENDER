/* =========================
   AGRICULTURE CRUD SYSTEM
========================= */


// Irrigation

const addIrrigation = (data) =>
  addRecord(
    setIrrigations,
    data
  );


const updateIrrigation = (
  id,
  data
) =>
  updateRecord(
    setIrrigations,
    id,
    data
  );


const deleteIrrigation = (id) =>
  deleteRecord(
    setIrrigations,
    id
  );




// Fertilizers

const addFertilizer = (data) =>
  addRecord(
    setFertilizers,
    data
  );


const updateFertilizer = (
  id,
  data
) =>
  updateRecord(
    setFertilizers,
    id,
    data
  );


const deleteFertilizer = (id) =>
  deleteRecord(
    setFertilizers,
    id
  );




// Pesticides

const addPesticide = (data) =>
  addRecord(
    setPesticides,
    data
  );


const updatePesticide = (
  id,
  data
) =>
  updateRecord(
    setPesticides,
    id,
    data
  );


const deletePesticide = (id) =>
  deleteRecord(
    setPesticides,
    id
  );  // Diseases


const addDisease = (data) =>
  addRecord(
    setDiseases,
    data
  );


const updateDisease = (
  id,
  data
) =>
  updateRecord(
    setDiseases,
    id,
    data
  );


const deleteDisease = (id) =>
  deleteRecord(
    setDiseases,
    id
  );




// Expenses


const addExpense = (data) =>
  addRecord(
    setExpenses,
    data
  );


const updateExpense = (
  id,
  data
) =>
  updateRecord(
    setExpenses,
    id,
    data
  );


const deleteExpense = (id) =>
  deleteRecord(
    setExpenses,
    id
  );




// Future Agriculture Systems Ready


const addHarvest = (data) =>
  addRecord(
    setHarvests,
    data
  );


const updateHarvest = (
  id,
  data
) =>
  updateRecord(
    setHarvests,
    id,
    data
  );


const deleteHarvest = (id) =>
  deleteRecord(
    setHarvests,
    id
  );




const addInventory = (data) =>
  addRecord(
    setInventory,
    data
  );


const updateInventory = (
  id,
  data
) =>
  updateRecord(
    setInventory,
    id,
    data
  );


const deleteInventory = (id) =>
  deleteRecord(
    setInventory,
    id
  );
