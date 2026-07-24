import { DataModel } from "../context/DataModel";

export const cropService = {
  getCrops() {
    return DataModel.crops;
  },

  addCrop(crop) {
    DataModel.crops.push(crop);
  },

  updateCrop(id, data) {
    const index = DataModel.crops.findIndex(c => c.id === id);

    if (index !== -1) {
      DataModel.crops[index] = {
        ...DataModel.crops[index],
        ...data,
      };
    }
  },

  deleteCrop(id) {
    DataModel.crops = DataModel.crops.filter(c => c.id !== id);
  },
};
