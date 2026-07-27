// DataModel.js
// LAVENDER Smart Farm - Unified Data Models


export const FarmModel = {
  id: "",
  name: "",
  ownerId: "",
  location: {
    latitude: "",
    longitude: "",
    address: "",
  },
  area: 0,
  notes: "",
  createdAt: "",
};


export const FieldModel = {
  id: "",
  farmId: "",
  name: "",
  area: 0,
  soilType: "",
  cropId: "",
  createdAt: "",
};


export const CropModel = {
  id: "",
  farmId: "",
  fieldId: "",
  name: "",
  variety: "",
  quantity: 0,
  unit: "kg",
  plantingDate: "",
  harvestDate: "",
  status: "growing",
};


export const IrrigationModel = {
  id: "",
  farmId: "",
  fieldId: "",
  method: "",
  waterAmount: 0,
  unit: "liter",
  date: "",
  notes: "",
};


export const FertilizerModel = {
  id: "",
  farmId: "",
  fieldId: "",
  cropId: "",
  type: "",
  quantity: 0,
  unit: "kg",
  date: "",
  notes: "",
};


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
};


export const DiseaseModel = {
  id: "",
  farmId: "",
  fieldId: "",
  cropId: "",
  name: "",
  severity: "low",
  symptoms: "",
  treatment: "",
  date: "",
};


export const ExpenseModel = {
  id: "",
  farmId: "",
  category: "",
  amount: 0,
  currency: "SYP",
  date: "",
  notes: "",
};


export const LocationModel = {
  id: "",
  farmId: "",
  latitude: "",
  longitude: "",
  accuracy: "",
};


export const ConsultationModel = {
  id: "",
  farmId: "",
  userId: "",
  subject: "",
  question: "",
  answer: "",
  status: "pending",
  date: "",
};


export const UserModel = {
  id: "",
  name: "",
  email: "",
  role: "farmer",
};


export const ReportModel = {
  id: "",
  farmId: "",
  title: "",
  type: "",
  content: "",
  createdAt: "",
};
