// LAVENDER Smart Farm
// Enterprise Data Models
// Version 3.0


/* =========================
   Farm Model
========================= */

export const FarmModel = {

  id: "",

  name: "",

  ownerId: "",


  location: {

    latitude: "",

    longitude: "",

    address: ""

  },


  area: {

    value: 0,

    unit: "dunum"

  },


  cropIds: [],

  fieldIds: [],


  status: "active",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Field Model
========================= */

export const FieldModel = {

  id: "",


  farmId: "",


  name: "",


  area: {

    value: 0,

    unit: "dunum"

  },


  soilType: "",


  cropIds: [],


  irrigationType: "",


  locationId: "",


  status: "active",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Crop Model
========================= */

export const CropModel = {

  id: "",


  farmId: "",


  fieldId: "",


  name: "",


  variety: "",


  seedQuantity: {

    value: 0,

    unit: "kg"

  },


  production: {

    expected: 0,

    actual: 0,

    unit: "kg"

  },


  plantingDate: "",


  harvestDate: "",


  status: "growing",


  image: "",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Irrigation Model
========================= */

export const IrrigationModel = {

  id: "",


  farmId: "",


  fieldId: "",


  cropId: "",


  method: "",


  waterAmount: {

    value: 0,

    unit: "liter"

  },


  irrigationDate: "",


  duration: "",


  weatherCondition: "",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Fertilizer Model
========================= */

export const FertilizerModel = {

  id: "",


  farmId: "",


  fieldId: "",


  cropId: "",


  type: "",


  category: "chemical",


  quantity: {

    value: 0,

    unit: "kg"

  },


  applicationMethod: "",


  applicationDate: "",


  cost: {

    amount: 0,

    currency: "SYP"

  },


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Pesticide Model
========================= */

export const PesticideModel = {

  id: "",


  farmId: "",


  fieldId: "",


  cropId: "",


  name: "",


  activeIngredient: "",


  target: "",


  quantity: {

    value: 0,

    unit: "ml"

  },


  applicationMethod: "spray",


  safetyPeriod: 0,


  sprayDate: "",


  status: "planned",


  notes: "",


  createdAt: "",

  updatedAt: ""

};/* =========================
   Disease Model
========================= */

export const DiseaseModel = {

  id: "",


  farmId: "",


  fieldId: "",


  cropId: "",


  name: "",


  symptoms: "",


  severity: "low",


  riskLevel: "low",


  treatment: "",


  image: "",


  date: "",


  status: "active",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Expense Model
========================= */

export const ExpenseModel = {

  id: "",


  farmId: "",


  category: "",


  description: "",


  amount: 0,


  currency: "SYP",


  date: "",


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Location GPS Model
========================= */

export const LocationModel = {

  id: "",


  farmId: "",


  latitude: "",


  longitude: "",


  accuracy: "",


  address: "",


  createdAt: ""

};





/* =========================
   User Model
========================= */

export const UserModel = {

  id: "",


  name: "",


  email: "",


  phone: "",


  role: "farmer",


  permissions: [],


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Consultation Model
========================= */

export const ConsultationModel = {

  id: "",


  farmId: "",


  userId: "",


  engineerId: "",


  subject: "",


  question: "",


  answer: "",


  status: "pending",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Report Model
========================= */

export const ReportModel = {

  id: "",


  farmId: "",


  title: "",


  type: "",


  content: "",


  statistics: {},


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Harvest Model
========================= */

export const HarvestModel = {

  id: "",


  farmId: "",


  fieldId: "",


  cropId: "",


  quantity: {

    value: 0,

    unit: "kg"

  },


  quality: "",


  harvestDate: "",


  workerIds: [],


  notes: "",


  createdAt: "",

  updatedAt: ""

};





/* =========================
   Inventory Model
========================= */

export const InventoryModel = {

  id: "",


  farmId: "",


  name: "",


  category: "",


  quantity: 0,


  unit: "",


  minimumStock: 0,


  supplier: "",


  createdAt: "",

  updatedAt: ""

};
