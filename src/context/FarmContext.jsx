/* OTHER CRUD */


addIrrigation:
(data)=>
addRecord(
setIrrigations,
data
),

updateIrrigation:
(id,data)=>
updateRecord(
setIrrigations,
id,
data
),

deleteIrrigation:
(id)=>
deleteRecord(
setIrrigations,
id
),



addFertilizer:
(data)=>
addRecord(
setFertilizers,
data
),

updateFertilizer:
(id,data)=>
updateRecord(
setFertilizers,
id,
data
),

deleteFertilizer:
(id)=>
deleteRecord(
setFertilizers,
id
),
  addPesticide:
(data)=>
addRecord(
setPesticides,
data
),

updatePesticide:
(id,data)=>
updateRecord(
setPesticides,
id,
data
),

deletePesticide:
(id)=>
deleteRecord(
setPesticides,
id
),



addDisease:
(data)=>
addRecord(
setDiseases,
data
),

updateDisease:
(id,data)=>
updateRecord(
setDiseases,
id,
data
),

deleteDisease:
(id)=>
deleteRecord(
setDiseases,
id
),



addExpense:
(data)=>
addRecord(
setExpenses,
data
),

deleteExpense:
(id)=>
deleteRecord(
setExpenses,
id
),
