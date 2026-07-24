import { DataModel } from "../context/DataModel";

export const pesticideService = {
  getPesticides() {
    return DataModel.pesticides;
  },

  addPesticide(pesticide) {
    DataModel.pesticides.push(pesticide);
  },

  updatePesticide(id, data) {
    const index = DataModel.pesticides.findIndex(p => p.id === id);

    if (index !== -1) {
      DataModel.pesticides[index] = {
        ...DataModel.pesticides[index],
        ...data,
      };
    }
  },

  deletePesticide(id) {
    DataModel.pesticides = DataModel.pesticides.filter(
      p => p.id !== id
    );
  },
};
