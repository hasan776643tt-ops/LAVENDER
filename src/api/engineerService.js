import { DataModel } from "../context/DataModel";

export const engineerService = {
  getEngineers() {
    return DataModel.engineers || [];
  },

  addEngineer(engineer) {
    if (!DataModel.engineers) {
      DataModel.engineers = [];
    }

    DataModel.engineers.push(engineer);
  },

  updateEngineer(id, data) {
    const index = DataModel.engineers.findIndex(e => e.id === id);

    if (index !== -1) {
      DataModel.engineers[index] = {
        ...DataModel.engineers[index],
        ...data,
      };
    }
  },

  deleteEngineer(id) {
    DataModel.engineers = DataModel.engineers.filter(
      e => e.id !== id
    );
  },
};
