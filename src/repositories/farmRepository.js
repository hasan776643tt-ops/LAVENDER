import { farmService } from "../api/farmService";

class FarmRepository {
  getAll() {
    return farmService.getFarms();
  }

  getById(id) {
    return this.getAll().find(farm => farm.id === id) || null;
  }

  create(farm) {
    farmService.addFarm(farm);
    return farm;
  }

  update(id, data) {
    farmService.updateFarm(id, data);
    return this.getById(id);
  }

  delete(id) {
    farmService.deleteFarm(id);
    return true;
  }
}

export const farmRepository = new FarmRepository();
