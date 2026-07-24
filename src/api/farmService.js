import { DataModel } from "../context/DataModel";

export const farmService = {
  getFarms() {
    return DataModel.farms;
  },

  addFarm(farm) {
    DataModel.farms.push(farm);
  },

  updateFarm(id, data) {
    const index = DataModel.farms.findIndex(f => f.id === id);

    if (index !== -1) {
      DataModel.farms[index] = {
        ...DataModel.farms[index],
        ...data,
      };
    }
  },

  deleteFarm(id) {
    DataModel.farms = DataModel.farms.filter(f => f.id !== id);
  },
};
