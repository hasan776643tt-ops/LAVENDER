import DataModel from "../models/DataModel.js";

class MapRepository {
  async getAll() {
    return Array.isArray(DataModel.locations)
      ? [...DataModel.locations]
      : [];
  }

  async getById(id) {
    const locations = await this.getAll();

    return (
      locations.find(
        (location) =>
          String(location.id) === String(id)
      ) || null
    );
  }

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error(
        "Location data is required"
      );
    }

    const locations = await this.getAll();

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
    const locations = await this.getAll();

    const index = locations.findIndex(
      (location) =>
        String(location.id) === String(id)
    );

    if (index === -1) {
      return null;
    }

    const updatedLocation = {
      ...locations[index],
      ...data,
      id: locations[index].id,
    };

    locations[index] = updatedLocation;

    DataModel.locations = locations;

    return updatedLocation;
  }

  async delete(id) {
    const locations = await this.getAll();

    const filteredLocations =
      locations.filter(
        (location) =>
          String(location.id) !== String(id)
      );

    if (
      filteredLocations.length ===
      locations.length
    ) {
      return false;
    }

    DataModel.locations =
      filteredLocations;

    return true;
  }

  async exists(id) {
    const location =
      await this.getById(id);

    return Boolean(location);
  }

  async count() {
    const locations =
      await this.getAll();

    return locations.length;
  }
}

const mapRepository =
  new MapRepository();

export default Object.freeze(
  mapRepository
);
