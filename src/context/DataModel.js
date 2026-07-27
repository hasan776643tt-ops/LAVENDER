// LAVENDER Smart Farm
// Enterprise Data Models
// Version 2.0


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


  quantity: 0,


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


  method: "",


  waterAmount: {

    value: 0,

    unit: "liter"

  },


  irrigationDate: "",


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


  quantity: {

    value: 0,

    unit: "kg"

  },


  applicationDate: "",


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


  quantity: 0,


  safetyPeriod: "",


  sprayDate: "",


  status: "planned",


  notes: "",


  createdAt: "",

  updatedAt: ""

};







/* =========================
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


  amount: 0,


  currency: "SYP",


  date: "",


  notes: "",


  createdAt: "",

  updatedAt: ""

};







/* =========================
   Location Model
========================= */

export const LocationModel = {

  id: "",


  farmId: "",


  latitude: "",


  longitude: "",


  accuracy: "",


  createdAt: ""

};







/* =========================
   Consultation Model
========================= */

export const ConsultationModel = {

  id: "",


  farmId: "",


  userId: "",


  subject: "",


  question: "",


  answer: "",


  status: "pending",


  createdAt: "",


  updatedAt: ""

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
   Report Model
========================= */

export const ReportModel = {

  id: "",


  farmId: "",


  title: "",


  type: "",


  content: "",


  createdAt: "",

  updatedAt: ""

};
