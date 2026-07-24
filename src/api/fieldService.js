import { DataModel } from "../context/DataModel";

export const fieldService = {
  getFields() {
    return DataModel.fields;
  },

  addField(field) {
    DataModel.fields.push(field);
  },

  updateField(id, data) {
    const index = DataModel.fields.findIndex(f => f.id === id);

    if (index !== -1) {
      DataModel.fields[index] = {
        ...DataModel.fields[index],
        ...data,
      };
    }
  },

  deleteField(id) {
    DataModel.fields = DataModel.fields.filter(f => f.id !== id);
  },
};
