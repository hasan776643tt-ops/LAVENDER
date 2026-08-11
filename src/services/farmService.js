// src/repositories/mapRepository.js

import DataModel from "../models/DataModel.js";

class MapRepository {
  async getAll() {
    return DataModel.locations || [];
  }

  async getById(id) {
    const locations =
      DataModel.locations || [];

    return locations.find(
      (item) => item.id === id
    );
  }

  async create(data) {
    const locations =
      DataModel.locations || [];

    const newLocation = {
      id: Date.now(),
      ...data,
    };

    DataModel.locations = [
      ...locations,
      newLocation,
    ];

    return newLocation;
  }

  async update(id, data) {
    const locations =
      DataModel.locations || [];

    const index = locations.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return null;
    }

    const updatedLocation = {
      ...locations[index],
      ...data,
      id,
    };

    DataModel.locations = locations.map(
      (item, itemIndex) =>
        itemIndex === index
          ? updatedLocation
          : item
    );

    return updatedLocation;
  }

  async delete(id) {
    const locations =
      DataModel.locations || [];

    const exists = locations.some(
      (item) => item.id === id
    );

    if (!exists) {
      return false;
    }

    DataModel.locations =
      locations.filter(
        (item) => item.id !== id
      );

    return true;
  }
}

export default Object.freeze(
  new MapRepository()
);
