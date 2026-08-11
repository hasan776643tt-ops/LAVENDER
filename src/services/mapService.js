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
      throw new Error("بيانات الموقع مطلوبة");
    }

    if (!data.farmId) {
      throw new Error("المزرعة مطلوبة");
    }

    if (!data.latitude || !data.longitude) {
      throw new Error("إحداثيات الموقع مطلوبة");
    }

    return mapRepository.create(data);
  }

  async updateLocation(id, data) {
    if (!id) {
      throw new Error("معرف الموقع مطلوب");
    }

    return mapRepository.update(id, data);
  }

  async deleteLocation(id) {
    if (!id) {
      throw new Error("معرف الموقع مطلوب");
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

export default Object.freeze(mapService);
