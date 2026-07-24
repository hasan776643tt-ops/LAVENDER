import { DataModel } from "../context/DataModel";

export const mapService = {
  getLocations() {
    return DataModel.maps;
  },

  addLocation(location) {
    DataModel.maps.push(location);
  },

  updateLocation(id, data) {
    const index = DataModel.maps.findIndex(m => m.id === id);

    if (index !== -1) {
      DataModel.maps[index] = {
        ...DataModel.maps[index],
        ...data,
      };
    }
  },

  deleteLocation(id) {
    DataModel.maps = DataModel.maps.filter(m => m.id !== id);
  },
};
