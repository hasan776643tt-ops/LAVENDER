import { farmRepository } from "../repositories/farmRepository";

class FarmController {
  getFarms() {
    return farmRepository.getAll();
  }

  getFarmById(id) {
    return farmRepository.getById(id);
  }

  createFarm(farm) {
    return farmRepository.create(farm);
  }

  updateFarm(id, data) {
    return farmRepository.update(id, data);
  }

  deleteFarm(id) {
    return farmRepository.delete(id);
  }
}

export const farmController = new FarmController();
