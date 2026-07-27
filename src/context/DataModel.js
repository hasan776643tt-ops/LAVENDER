// DataModel.js
// نموذج بيانات مشروع LAVENDER Smart Farm

export const FarmModel = {
  id: "",
  name: "",
  owner: "",
  location: "",
  area: 0,
  crop: "",
  plantingDate: "",
  notes: "",
};


export const FieldModel = {
  id: "",
  farmId: "",
  fieldName: "",
  area: 0,
  soilType: "",
  crop: "",
};


export const CropModel = {
  id: "",
  name: "",
  variety: "",
  quantity: 0,
  plantingDate: "",
  harvestDate: "",
};


export const ExpenseModel = {
  id: "",
  farmId: "",
  type: "",
  amount: 0,
  currency: "SYP",
  date: "",
  notes: "",
};


export const IrrigationModel = {
  id: "",
  farmId: "",
  method: "",
  date: "",
  waterAmount: 0,
};


export const FertilizerModel = {
  id: "",
  farmId: "",
  type: "",
  quantity: 0,
  date: "",
};


export const DiseaseModel = {
  id: "",
  farmId: "",
  name: "",
  treatment: "",
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
  content: "",
  date: "",
};
