import { DataModel } from "../context/DataModel";

export const fertilizerService = {
  getFertilizers() {
    return DataModel.fertilizers;
  },

  addFertilizer(fertilizer) {
    DataModel.fertilizers.push(fertilizer);
  },

  updateFertilizer(id, data) {
    const index = DataModel.fertilizers.findIndex(f => f.id === id);

    if (index !== -1) {
      DataModel.fertilizers[index] = {
        ...DataModel.fertilizers[index],
        ...data,
      };
    }
  },

  deleteFertilizer(id) {
    DataModel.fertilizers = DataModel.fertilizers.filter(
      f => f.id !== id
    );
  },
};
