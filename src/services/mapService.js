import mapRepository from "../repositories/mapRepository.js";

class MapService {
  async getAllLocations() {
    return mapRepository.getAll();
  }

  async getLocationById(id) {
    return mapRepository.getById(id);
  }

  async createLocation(data) {
    if (!data || typeof data !== "object") {
      throw new Error("MAP_DATA_REQUIRED");
    }

    if (!data.farmId) {
      throw new Error("MAP_FARM_REQUIRED");
    }

    if (
      !data.latitude ||
      !data.longitude
    ) {
      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );
    }

    return mapRepository.create(data);
  }

  async updateLocation(id, data) {
    if (!id) {
      throw new Error("MAP_ID_REQUIRED");
    }

    return mapRepository.update(
      id,
      data
    );
  }

  async deleteLocation(id) {
    if (!id) {
      throw new Error("MAP_ID_REQUIRED");
    }

    return mapRepository.delete(id);
  }

  async locationExists(id) {
    return mapRepository.exists(id);
  }

  async countLocations() {
    return mapRepository.count();
  }
}

const mapService = new MapService();

export default Object.freeze(
  mapService
);
