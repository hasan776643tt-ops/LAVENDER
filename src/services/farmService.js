// src/services/farmService.js

import farmRepository from "../repositories/farmRepository.js";

class FarmService {
  async getAllFarms() {
    return farmRepository.getAll();
  }

  async getFarmById(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.getById(id);
  }

  async createFarm(data) {
    if (!data || typeof data !== "object") {
      throw new Error("بيانات المزرعة مطلوبة");
    }

    if (!data.name || !String(data.name).trim()) {
      throw new Error("اسم المزرعة مطلوب");
    }

    return farmRepository.create(data);
  }

  async updateFarm(id, data) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    if (!data || typeof data !== "object") {
      throw new Error("بيانات التحديث مطلوبة");
    }

    return farmRepository.update(id, data);
  }

  async deleteFarm(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.delete(id);
  }
}

const farmService = new FarmService();

export default Object.freeze(farmService);
