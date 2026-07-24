import { DataModel } from "../context/DataModel";

export const diseaseService = {
  getDiseases() {
    return DataModel.diseases;
  },

  addDisease(disease) {
    DataModel.diseases.push(disease);
  },

  updateDisease(id, data) {
    const index = DataModel.diseases.findIndex(d => d.id === id);

    if (index !== -1) {
      DataModel.diseases[index] = {
        ...DataModel.diseases[index],
        ...data,
      };
    }
  },

  deleteDisease(id) {
    DataModel.diseases = DataModel.diseases.filter(
      d => d.id !== id
    );
  },
};
