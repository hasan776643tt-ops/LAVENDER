import { DataModel } from "../context/DataModel";

export const irrigationService = {
  getIrrigations() {
    return DataModel.irrigations;
  },

  addIrrigation(irrigation) {
    DataModel.irrigations.push(irrigation);
  },

  updateIrrigation(id, data) {
    const index = DataModel.irrigations.findIndex(i => i.id === id);

    if (index !== -1) {
      DataModel.irrigations[index] = {
        ...DataModel.irrigations[index],
        ...data,
      };
    }
  },

  deleteIrrigation(id) {
    DataModel.irrigations = DataModel.irrigations.filter(
      i => i.id !== id
    );
  },
};
